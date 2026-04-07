import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { InvoiceDetails, InvoiceItem, TaxCalculationResult, GeneratedContract, ComplianceGuide, DirectorVerificationResult, Expense, MarketingContent } from '../types';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. The application might not work as expected.");
}

// Basic model for simpler tasks
const DEFAULT_MODEL = 'gemini-3-flash-preview';
// Pro model for complex reasoning and creative generation
const PRO_MODEL = 'gemini-3-pro-preview';

export const generateInvoiceHtml = async (details: InvoiceDetails): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const theme = details.theme || 'standard';
    
    const themeInstructions = {
        standard: "Use professional indigo and slate colors. Clean, balanced whitespace. Standard sans-serif fonts.",
        modern: "Use a modern layout with a subtle light-indigo background for the header. Use rounded-xl corners. Indigo-600 for primary accents. Sleek design.",
        minimal: "Ultra-clean. No heavy backgrounds. Use thin lines (border-slate-100) and gray-600 text. Very high white space. Minimalist aesthetic.",
        bold: "High contrast. Use a deep indigo or professional navy header area with white text. Strong borders. Bold font weights for totals. Energetic look."
    };

    const prompt = `
Generate a professional HTML invoice based on the following JSON data.
The invoice must be styled using Tailwind CSS classes directly in the HTML. Do not include any <style> tags or external CSS links. The final output should be a single HTML snippet that can be rendered inside a div.
The currency is South African Rand (R).

**Theme Style to Apply:** 
${themeInstructions[theme]}

**Invoice Structure & Design (Follow these instructions strictly):**

1.  **Main Header:**
    -   Use a flexbox container (\`flex justify-between items-start\`).
    -   **On the left:** If 'companyLogo' (a Base64 data URI) is provided, display it. The image's max-height should be 80px (\`style="max-height: 80px; width: auto;"\`).
    -   **On the right:** In a right-aligned block, if 'header' text is provided and not empty, display it as a large, bold title. Below the title, display the invoice number, the date, and the **due date** (if provided).

2.  **Company & Client Details:**
    -   Below the header, create a two-column layout using flexbox.
    -   The left column is for the 'From' details. Clearly label and display 'fromBusinessNumber' (as "Reg No.") and 'fromVatNumber' (as "VAT No.") if they exist.
    -   The right column is for the 'To' details.

3.  **Line Items Table:**
    -   Present the 'items' in a clean table. Include columns: "Description", "Qty", "Unit Price", and "Total".
    -   Calculate and display the total for each line item.

4.  **Totals & Payment:**
    -   **Banking Details:** If 'bankDetails' is provided, display it in a styled box. Use \`whitespace-pre-wrap\`.
    -   **Grand Total:** Display a large total amount.
    -   **Pay Now Button:** If 'paymentLink' is provided, render a prominent button using an \`<a>\` tag. Style it to match the theme. Include a credit card SVG icon.

5.  **Notes & Footer:**
    -   Display 'notes' and 'paymentTerms'.
    -   **Footer:** If provided, render a small centered footer at the very bottom with a top border.

**JSON Data:**
${JSON.stringify(details, null, 2)}
`;
    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
        });
        const text = response.text;

        if (typeof text !== 'string' || !text) {
            throw new Error("The AI failed to generate a valid invoice.");
        }

        return text.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error("Error generating invoice:", error);
        throw new Error("An unknown error occurred while generating the invoice.");
    }
};

export const calculateTax = async (income: number, expenses: number, deductions: number, credits: number): Promise<TaxCalculationResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
You are an expert tax assistant for South Africa.
Calculate the estimated income tax for an individual for the latest available tax year based on these figures:

- Gross Income: R ${income}
- Business Expenses: R ${expenses}
- Additional Deductions: R ${deductions}
- Tax Credits (Rebates): R ${credits}

Follow these steps precisely:
1.  Determine the 'taxableIncome' by calculating: (Gross Income - Business Expenses - Additional Deductions).
2.  Calculate the initial tax liability on the 'taxableIncome' using the latest official SARS tax brackets.
3.  Determine the final 'estimatedTax' by subtracting the 'Tax Credits' from the initial tax liability.
4.  In the 'notes', you MUST state the tax year you used for the calculation (e.g., "Based on 2024/2025 tax brackets.").
5.  In the 'notes', also briefly explain the impact of the credits on the final tax amount.

Return a JSON object that strictly follows the provided schema. The numbers in the JSON should be formatted as strings without currency symbols or thousands separators.
`;
    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        taxableIncome: { type: Type.STRING },
                        estimatedTax: { type: Type.STRING },
                        notes: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                        }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error calculating tax:", error);
        throw new Error("Failed to calculate tax. Please try again.");
    }
};

export const generateContract = async (description: string): Promise<GeneratedContract> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Based on the following description, generate a simple, basic contract suitable for a small business in South Africa.
The contract should be clear and easy to understand.
Description: "${description}"

Provide the output as a JSON object with a title and an array of clauses, where each clause has a 'heading' and a 'body'.
This is for informational purposes only and is not legal advice. Include a disclaimer to this effect in the final clause.
`;
    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        clauses: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    heading: { type: Type.STRING },
                                    body: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating contract:", error);
        throw new Error("Failed to generate contract. Please try again.");
    }
};

export const suggestCompanyNames = async (description: string): Promise<string[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Act as a branding expert for a new South African business.
Based on the following description, suggest 5 creative, professional, and memorable company names.
The names should be suitable for a '.co.za' domain. Avoid names that are too generic.
Description: "${description}"

Return the names as a simple JSON array of strings.
`;
    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error suggesting company names:", error);
        throw new Error("Failed to suggest company names. Please try again.");
    }
};

export const getComplianceGuide = async (topic: string, description: string): Promise<ComplianceGuide> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Act as a compliance expert for South African SMEs. The user wants a guide for "${topic}".
Their business situation is: "${description}".

Based on this, generate a step-by-step guide for them to complete this process on the official government website.

Provide the output as a JSON object.
Make the guide clear, concise, and easy for a non-expert to follow.
Include direct markdown links to the official government portals (e.g., sars.gov.za, CIPC e-Services, UIF uFiling).
`;
    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        introduction: { type: Type.STRING },
                        requiredDocuments: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                        },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    step: { type: Type.INTEGER },
                                    instruction: { type: Type.STRING },
                                    details: { type: Type.STRING }
                                }
                            }
                        },
                        disclaimer: { type: Type.STRING }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating compliance guide:", error);
        throw new Error("Failed to generate compliance guide. Please try again later.");
    }
};

export const verifyDirectorDetails = async (name: string, idNumber: string, clientValidationResult: string | null): Promise<DirectorVerificationResult> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Act as a compliance assistant for a South African business owner who is verifying a director's details for a CIPC company registration.
The user has provided the following details:
- Director Name: "${name}"
- SA ID Number: "${idNumber}"
- Client-side validation result: ${clientValidationResult ? `"${clientValidationResult}"` : `"The ID number passed checksum and format validation."`}

IMPORTANT: You do not have access to the Department of Home Affairs database. Your role is to provide guidance based on the provided information.

Generate a JSON object with a "Verification Report". The report should include:
1.  A 'status' of 'Verified', 'Attention Required', or 'Invalid'.
2.  A 'message' summarizing the findings.
3.  A 'recommendations' array with a checklist of next steps.
4.  A 'commonIssues' array listing potential problems.
5.  A clear 'disclaimer' stating this is a preliminary check.
`;

    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 2000 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING },
                        message: { type: Type.STRING },
                        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
                        commonIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
                        disclaimer: { type: Type.STRING }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error verifying director details:", error);
        throw new Error("Failed to generate verification report.");
    }
};

export const analyzeReceipt = async (base64Image: string, mimeType: string): Promise<Omit<Expense, 'id'>> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Analyze this image of a receipt. Extract the following details:
- Merchant Name
- Date (Format: YYYY-MM-DD)
- Total Amount (Numbers only)
- Category (e.g., Meals, Transport, Office Supplies, Utilities, Other)
- A brief description of items.

Return a JSON object. If a field isn't clear, make a reasonable guess or leave it empty.
`;
    const cleanBase64 = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: cleanBase64 } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        merchant: { type: Type.STRING },
                        date: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                    }
                }
            }
        });
        
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error analyzing receipt:", error);
        throw new Error("Failed to analyze receipt. Please try again or ensure the image is clear.");
    }
};

export const generateMarketingContent = async (topic: string, platform: string, audience: string): Promise<MarketingContent> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Act as a digital marketing expert for a South African SME.
Generate a creative and engaging marketing post based on:
- Topic/Product: "${topic}"
- Platform: "${platform}"
- Target Audience: "${audience}"

Return a JSON object with:
1. 'content': The actual post text (include emojis).
2. 'hashtags': An array of relevant hashtags.
3. 'imageIdea': A description of an image that would work well with this post.
`;

    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 1500 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        platform: { type: Type.STRING },
                        content: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        imageIdea: { type: Type.STRING },
                    }
                }
            }
        });
        
        const result = JSON.parse(response.text.trim());
        result.platform = platform; 
        return result;
    } catch (error) {
        console.error("Error generating marketing content:", error);
        throw new Error("Failed to generate marketing content.");
    }
};

export const createAdvisorChat = (context?: any): Chat => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const contextStr = context ? `\n\n**Current Business Context:**\n${JSON.stringify(context, null, 2)}` : '';
    
    return ai.chats.create({
        model: PRO_MODEL,
        config: {
            tools: [{ googleSearch: {} }],
            systemInstruction: `You are a knowledgeable and helpful business advisor for South African SMEs. Provide clear, concise, and practical advice on topics like tax, compliance, marketing, and operations within the South African context. Use Markdown for formatting. Use Google Search to verify current interest rates, tax laws for 2024/2025, or any recent government gazette changes. If search results are used, mention the source.${contextStr}`,
        }
    });
};

export const getSmartInvoiceRecommendations = async (businessSector: string, currentItems: InvoiceItem[]): Promise<{ suggestedItems: string[], pricingAdvice: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Act as a business consultant for a South African SME in the "${businessSector}" sector.
Based on their current invoice items: ${JSON.stringify(currentItems)}, provide:
1. A list of 3-5 additional services or products they could potentially upsell or include.
2. Brief pricing advice or market trends for this sector in South Africa.

Return a JSON object with 'suggestedItems' (array of strings) and 'pricingAdvice' (string).
`;

    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestedItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                        pricingAdvice: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error getting invoice recommendations:", error);
        throw new Error("Failed to get smart recommendations.");
    }
};

export const getDailyBusinessTip = async (): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = "Provide a single, short, valuable business tip for a South African small business owner. It could be about tax, motivation, marketing, or efficiency. Keep it under 50 words.";
    try {
        const response = await ai.models.generateContent({
            model: DEFAULT_MODEL,
            contents: prompt,
        });
        return response.text || "Consistency is key to business growth. Review your goals daily.";
    } catch (error) {
        console.error("Error getting daily tip:", error);
        return "Consistency is key to business growth. Review your goals daily.";
    }
};

export const getComplianceReadinessCheck = async (formData: any): Promise<{ score: number; feedback: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const prompt = `
Act as a CIPC and SARS compliance auditor for South African company registrations.
Review the following company registration data and provide a "Readiness Score" (0-100) and detailed feedback.
Focus on:
1.  Completeness of names.
2.  Director information (at least one director for a Private Company).
3.  Address completeness.
4.  Potential issues with the proposed names (e.g., too generic, offensive, or likely to be rejected by CIPC).

Data:
${JSON.stringify(formData, null, 2)}

Return a JSON object with 'score' (number) and 'feedback' (string, use markdown for formatting).
`;

    try {
        const response = await ai.models.generateContent({
            model: PRO_MODEL,
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 1500 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        feedback: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text.trim());
    } catch (error) {
        console.error("Error getting readiness check:", error);
        throw new Error("Failed to get compliance readiness check.");
    }
};
