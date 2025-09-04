
import { GoogleGenAI, Type } from "@google/genai";
import type { InvoiceDetails, TaxCalculationResult, GeneratedContract } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const generateInvoiceHtml = async (details: InvoiceDetails): Promise<string> => {
    const prompt = `
Generate a professional HTML invoice based on the following JSON data.
The invoice should be well-formatted, clean, and easy to read.
Use Tailwind CSS classes for styling. Do not include <style> tags or external CSS links.
The currency is South African Rand (R).

If a 'companyLogo' is provided in the JSON data, display it at the top of the invoice, usually on the left or right side, opposite the "INVOICE" title. The 'companyLogo' is a Base64 data URI. Use an <img> tag like this: <img src="..." alt="Company Logo" style="max-height: 80px;">.
If a 'header' value is provided, display it prominently at the top of the invoice (e.g., as a large title).
If a 'footer' value is provided, display it at the very bottom of the invoice, centered.
If the 'toVatNumber' field is present in the JSON data, display it clearly under the client's address.
If 'paymentTerms' are provided, display them clearly on the invoice, for example, near the date or the total amount due.
Calculate the total for each line item and a grand total at the bottom.
Make it look like a real, professional invoice.

JSON Data:
${JSON.stringify(details, null, 2)}
`;
    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        const text = response.text;
        // Clean up the response, removing markdown backticks for HTML
        return text.replace(/```html/g, '').replace(/```/g, '').trim();
    } catch (error) {
        console.error("Error generating invoice:", error);
        throw new Error("Failed to generate invoice. Please try again.");
    }
};

export const calculateTax = async (income: number, expenses: number): Promise<TaxCalculationResult> => {
    const prompt = `
Given the following financial figures for a South African Small Business (SME), calculate the estimated income tax.
- Annual Income: R ${income}
- Annual Deductible Expenses: R ${expenses}

Provide the result as a JSON object.
Assume this is for a sole proprietor for the latest available tax year in South Africa.
Provide brief explanatory notes.
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
                        taxableIncome: { type: Type.STRING, description: "Calculated as Income - Expenses" },
                        estimatedTax: { type: Type.STRING, description: "The estimated tax liability in ZAR" },
                        notes: { 
                            type: Type.ARRAY, 
                            items: { type: Type.STRING },
                            description: "Brief notes about the calculation, mentioning tax brackets or key assumptions."
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