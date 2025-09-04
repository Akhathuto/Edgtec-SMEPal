import { GoogleGenAI, Type } from "@google/genai";
import type { InvoiceDetails, TaxCalculationResult, GeneratedContract, ComplianceGuide, DirectorVerificationResult } from '../types';

// A log can be useful for debugging without stopping execution.
if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. The application might not work as expected.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = 'gemini-2.5-flash';

export const generateInvoiceHtml = async (details: InvoiceDetails): Promise<string> => {
    const prompt = `
Generate a professional HTML invoice based on the following JSON data.
The invoice must be styled using Tailwind CSS classes directly in the HTML. Do not include any <style> tags or external CSS links. The final output should be a single HTML snippet that can be rendered inside a div.
The currency is South African Rand (R).

**Invoice Structure & Design (Follow these instructions strictly):**

1.  **Main Header:**
    -   Use a flexbox container (\`flex justify-between items-start\`).
    -   **On the left:** If 'companyLogo' (a Base64 data URI) is provided, display it. The image's max-height should be 80px (\`style="max-height: 80px; width: auto;"\`).
    -   **On the right:** Display the 'header' text (e.g., "INVOICE") as a large, bold title (\`text-3xl font-bold text-right\`). Below the title, display the invoice number and date, also right-aligned.

2.  **Company & Client Details:**
    -   Below the header, create a two-column layout using flexbox.
    -   The left column is for the 'From' details (your company). Clearly label and display 'fromBusinessNumber' (as "Company Reg No.") and 'fromVatNumber' (as "VAT No.") if they exist.
    -   The right column is for the 'To' details (the client). Clearly label and display 'toBusinessNumber' and 'toVatNumber' if they exist.

3.  **Line Items Table:**
    -   Present the 'items' in a clean, full-width table.
    -   Include columns: "Description", "Quantity", "Unit Price", and "Line Total".
    -   Calculate and display the total for each line item.

4.  **Totals & Payment:**
    -   On the right side, below the table, display the final "Grand Total".
    -   If a 'paymentLink' URL is provided, you MUST render a highly visible 'Pay Now' button next to the total. Use an \`<a>\` tag styled like a button (e.g., \`bg-green-600 text-white font-bold py-2 px-4 rounded\`).
    -   Display 'paymentTerms' nearby.

5.  **Notes & Footer:**
    -   Display any provided 'notes'.
    -   At the very bottom, separated by a top border, create a centered footer (\`text-center\`). Display the 'footer' text here in a smaller font (\`text-sm text-gray-500\`).

**JSON Data:**
${JSON.stringify(details, null, 2)}
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        const text = response.text;

        if (typeof text !== 'string' || !text) {
            console.error("AI did not return valid text content for invoice. Full response:", JSON.stringify(response, null, 2));
            throw new Error("The AI failed to generate a valid invoice because the response was empty. This can be caused by content safety filters or an API issue. Please adjust your input or try again.");
        }

        // Clean up the response, removing markdown backticks for HTML
        return text.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error("Error generating invoice:", error);
        if (error instanceof Error) {
            throw error; // Re-throw the specific error
        }
        throw new Error("An unknown error occurred while generating the invoice.");
    }
};

export const calculateTax = async (income: number, expenses: number, deductions: number, credits: number): Promise<TaxCalculationResult> => {
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
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        taxableIncome: { type: Type.STRING, description: "Calculated as (Income - Expenses - Deductions), formatted as a number string." },
                        estimatedTax: { type: Type.STRING, description: "The final estimated tax liability in ZAR after applying credits, formatted as a number string." },
                        notes: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Brief notes about the calculation, mentioning tax brackets or key assumptions like the tax year."
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
    const prompt = `
Based on the following description, generate a simple, basic contract suitable for a small business in South Africa.
The contract should be clear and easy to understand.
Description: "${description}"

Provide the output as a JSON object with a title and an array of clauses, where each clause has a 'heading' and a 'body'.
This is for informational purposes only and is not legal advice. Include a disclaimer to this effect in the final clause.
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "The title of the contract." },
                        clauses: {
                            type: Type.ARRAY,
                            description: "An array of contract clauses.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    heading: { type: Type.STRING, description: "The heading of the clause." },
                                    body: { type: Type.STRING, description: "The full text of the clause." }
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
    const prompt = `
Act as a branding expert for a new South African business.
Based on the following description, suggest 5 creative, professional, and memorable company names.
The names should be suitable for a '.co.za' domain. Avoid names that are too generic.
Description: "${description}"

Return the names as a simple JSON array of strings.
`;
    try {
        const response = await ai.models.generateContent({
            model,
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
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A clear title for the guide, e.g., 'Guide to SARS PAYE Registration for a Pty Ltd'" },
                        introduction: { type: Type.STRING, description: "A brief introduction explaining what this registration is for." },
                        requiredDocuments: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "A list of documents and information needed, e.g., 'Certified ID copy of each director'."
                        },
                        steps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    step: { type: Type.INTEGER },
                                    instruction: { type: Type.STRING, description: "Main instruction for the step, including any markdown links to official URLs." },
                                    details: { type: Type.STRING, description: "Additional details or notes for this step." }
                                }
                            }
                        },
                        disclaimer: { type: Type.STRING, description: "A standard disclaimer that this is not official advice." }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error generating compliance guide:", error);
        throw new Error("Failed to generate compliance guide. Please try again.");
    }
};

export const verifyDirectorDetails = async (name: string, idNumber: string, clientValidationResult: string | null): Promise<DirectorVerificationResult> => {
    const prompt = `
Act as a compliance assistant for a South African business owner who is verifying a director's details for a CIPC company registration.
The user has provided the following details:
- Director Name: "${name}"
- SA ID Number: "${idNumber}"
- Client-side validation result: ${clientValidationResult ? `"${clientValidationResult}"` : `"The ID number passed checksum and format validation."`}

IMPORTANT: You do not have access to the Department of Home Affairs database. Do not claim to perform a real-time check or confirm if the ID is real. Your role is to provide guidance based on the provided information.

Generate a JSON object with a "Verification Report". The report should include:
1.  A 'status' of 'Verified', 'Attention Required', or 'Invalid'. Use 'Verified' if client-side validation passed. Use 'Invalid' if it failed. Use 'Attention Required' if the name seems unusual or could have typos.
2.  A 'message' summarizing the findings.
3.  A 'recommendations' array with a checklist of the user's next steps (e.g., getting a certified copy).
4.  A 'commonIssues' array listing potential problems the user should double-check (e.g., name spelling mismatches, expired documents).
5.  A clear 'disclaimer' stating this is a preliminary check and not an official verification.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        status: { type: Type.STRING, description: "The overall status: 'Verified', 'Attention Required', or 'Invalid'." },
                        message: { type: Type.STRING, description: "A summary message of the verification check." },
                        recommendations: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Actionable next steps for the user."
                        },
                        commonIssues: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Common problems the user should be aware of."
                        },
                        disclaimer: { type: Type.STRING, description: "A standard disclaimer." }
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error verifying director details:", error);
        throw new Error("Failed to generate verification report. Please try again.");
    }
};