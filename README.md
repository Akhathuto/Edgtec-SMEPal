# AI Business Assistant for South African SMEs (SMEPal)

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-API-blue?style=for-the-badge&logo=google&logoColor=white)

SMEPal is an AI-powered assistant designed to help South African Small and Medium-sized Enterprises (SMEs) streamline their administrative tasks. It provides a suite of tools to simplify invoicing, tax estimation, contract drafting, and client management, saving business owners time and effort.

## Our Story: Built by EDGTEC

> SMEPal is proudly developed by **EDGTEC (Pty) Ltd (Reg: 2025/534716/07)**, a South African technology company. As a small business ourselves, we experienced firsthand the administrative hurdles that many South African SMEs face. From complex invoicing to navigating compliance, these tasks consume valuable time that could be spent on growth.
>
> This experience was the driving force behind SMEPal. We built this suite of tools to solve our own problems and to empower other entrepreneurs with a simple, powerful, and AI-driven assistant. Our goal is to make business administration less of a burden, allowing SMEs to focus on what truly matters: their passion and their business.

## ✨ Key Features

-   **📄 AI Invoice Generator**: Create professional, branded invoices. Customize with your company logo, fill client details from a saved list, and generate clean HTML with Tailwind CSS.
-   **🧾 AI Tax Calculator**: Get a quick estimate of annual income tax liability for a sole proprietor in South Africa.
-   **✍️ AI Contract Assistant**: Generate basic contract templates from a natural language description.
-   **👥 Client Management**: Add, view, edit, and delete client details. Data is stored locally in your browser, and you can export your client list to CSV.
-   **🏢 Company Registration Service**: A guided, multi-step form to collect all necessary information for CIPC registration, offered as a paid service.
-   **🗓️ Payroll Reminders**: A dashboard of key statutory deadlines for South African businesses (PAYE, VAT, etc.).
-   **ℹ️ Informational Pages**: Includes 'About Us', 'Contact', and a helpful FAQ section.

## 🚀 Tech Stack

-   **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **AI Integration**: [Google Gemini API](https://ai.google.dev/) via the `@google/genai` SDK.

## 🔧 Getting Started

This project is set up to run in a modern development environment that supports TypeScript and JSX compilation without a traditional build step, using ES modules and import maps.

### Prerequisites

You will need a local web server capable of serving static files. A popular choice is `live-server`:
```bash
npm install -g live-server
```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-url.com/sme-pal.git
    cd sme-pal
    ```

2.  **Configure Environment Variables:**
    This application requires a Google Gemini API key. Ensure the `API_KEY` environment variable is available in the execution context where the application is served. See the [Environment Variables](#-environment-variables) section for more details.

3.  **Run the application:**
    Start a local server from the root of the project directory.
    ```bash
    live-server
    ```
    The application should now be running and accessible in your browser, typically at `http://127.0.0.1:8080`.

## 🔐 Environment Variables

To use the AI-powered features, you must provide a Google Gemini API key.

-   `API_KEY`: Your Google Gemini API key.

The application is configured to read this key from `process.env.API_KEY`. It must be set in the environment where the app is built or served.

## 🧠 How the AI Works

The application leverages the Google Gemini API (`gemini-2.5-flash` model) to power its core features:

-   **Invoicing**: A detailed prompt is constructed with the user's invoice data in JSON format. The AI is asked to return a professional HTML structure using Tailwind CSS classes.
-   **Tax Calculation**: The model is given income/expense data and instructed to return a structured JSON object with the tax estimation, using the `responseSchema` feature.
-   **Contract Generation**: The user's description is sent to the model, which is prompted to generate a JSON object containing a contract title and an array of clauses.
-   **Company Name Suggestion**: During registration, the AI suggests creative company names based on a business description.

## 💰 Monetization

The application is designed around a Freemium model:
-   **Free Tier**: Access to core tools with some limitations.
-   **Pro Tier (R99–R499/mo)**: Unlocks advanced features, unlimited usage, and integrations (e.g., calendar reminders).
-   **Company Registration Service**: A one-time fee of R499 for handling the CIPC registration process.

## 📂 Project Structure

```
/
├── components/
│   ├── common/         # Reusable components (Button, Input, Card)
│   ├── ...             # Feature-specific components
├── hooks/
│   └── useClients.ts   # Custom hook for localStorage client management
├── services/
│   └── geminiService.ts# Handles all API calls to the Google Gemini API
├── types.ts            # TypeScript interfaces and enums
├── App.tsx             # Main application component
├── index.html          # Entry HTML file
└── index.tsx           # React application entry point
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## ⚠️ Disclaimer

The Tax Calculator and Contract Assistant tools are for informational purposes only and do not constitute professional financial or legal advice. Users should consult with a qualified accountant or lawyer for their specific needs.

## 📞 Contact

EDGTEC (Pty) Ltd
-   **Email**: r.lepheane@outlook.com
-   **Phone**: +27 71 184 6709
