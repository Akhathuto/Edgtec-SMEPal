# SMEPal | Enterprise-Grade AI Business Assistant

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.0-indigo?style=for-the-badge&logo=google&logoColor=white)

SMEPal is a high-fidelity, AI-powered administrative suite specifically engineered for South African Small and Medium-sized Enterprises (SMEs). By leveraging the latest breakthroughs in large language models and real-time grounding, SMEPal transforms complex statutory and operational hurdles into streamlined, automated workflows.

---

## 🏗️ Core Architecture

SMEPal is built on a "Privacy-First" local telemetry model. Your sensitive business data (Client lists, Invoice history, Expense logs) remains stored in your browser's local sandbox, ensuring maximum sovereignty and POPIA compliance.

### ✨ Primary Studios & Desks

-   **🎙️ Strategy Desk (AI Advisor)**: A multi-modal consultation terminal. Supports low-latency voice interaction and real-time Google Search grounding to provide accurate advice on ZAR economic shifts, SARS legislation (2024/2025), and CCMA protocols.
-   **🎨 Neural Invoice Studio**: Generative HTML engine that builds professional, branded invoices. Choose from multiple design "DNA" types (Modern, Minimal, Bold) and export directly to high-res PDF.
-   **🔍 Audit Studio (Receipt Scanner)**: Uses advanced vision models to extract merchant signatures, dates, and deductible amounts from photographs of receipts, automatically populating your audit trail.
-   **⚖️ Legal Studio (Contract Assistant)**: Generates high-fidelity contract templates from natural language descriptions, tailored for the South African legal context.
-   **📉 Taxation Estimator**: A predictive engine that calculates individual income tax liability based on the latest SARS tax brackets and rebates.
-   **🏢 Registration Portal**: A guided CIPC company registration wizard that manages name reservation, director appointment, and compliance document ingestion.
-   **📢 Marketing Studio**: Synthesizes high-converting social media copy and AI visual prompts tailored to specific South African demographics.

---

## 🧠 Intelligence Layer

SMEPal utilizes a tiered model strategy to balance speed and reasoning depth:

-   **Gemini 3 Pro Preview**: Powers the Strategy Desk and Legal Studio for complex reasoning, legislative analysis, and long-form document drafting.
-   **Gemini 3 Flash Preview**: Handles high-speed tasks like standard invoicing and name suggestions.
-   **Gemini 2.5 Flash Image**: Drives the Audit Studio OCR, performing sub-second extraction of financial data from raw imagery.
-   **Gemini 2.5 Flash Native Audio**: Enables the low-latency voice consultation experience in the Strategy Desk.

---

## 🚀 Getting Started

### Prerequisites

-   A modern browser (Chrome, Edge, or Safari) with `localStorage` enabled.
-   A valid **Google Gemini API Key**.

### Configuration

The application requires an environment variable `API_KEY` to be set in your execution context.

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/sme-pal.git
    cd sme-pal
    ```

2.  **Initialize Development Server**:
    Serve the project using a local server like `live-server` or `vite`.
    ```bash
    # Example using live-server
    live-server --port=8080
    ```

3.  **Neural Link Sync**:
    Upon first launch, navigate to **Application Settings** to configure your Enterprise defaults (VAT rates, Banking details, and AI Reasoning depth).

---

## 🛡️ Security & Sovereignty

-   **POPIA Compliance**: SMEPal includes a "Storage Purge Protocol" in the settings suite, allowing users to instantly destroy all local telemetry.
-   **Data Portability**: Users can export their entire workspace as an encrypted JSON telemetry snapshot for manual backup or migration.
-   **End-to-End Encryption**: All communication with the Gemini Neural Engine is secured via TLS 1.3.

---

## 🛠️ Project Hierarchy

```text
/
├── components/
│   ├── common/         # Atomic UI components (Button, Input, Card, Spinner)
│   ├── ...             # Feature-specific "Studios" and "Desks"
├── hooks/
│   └── useClients.ts   # LocalStorage state management logic
├── services/
│   └── geminiService.ts# Neural Engine Orchestrator (API integration)
├── utils/
│   └── validation.ts   # RSA ID (Luhn) and Payment integrity logic
├── types.ts            # Core TypeScript definitions
├── App.tsx             # Main layout & Navigation router
└── index.tsx           # React root initialization
```

---

## 📞 Support & Identity

SMEPal is proudly developed by **EDGTEC (Pty) Ltd** (Reg: 2025/534716/07).

-   **Lead Developer**: Ranthutu Lepheane
-   **Email**: r.lepheane@outlook.com
-   **HQ**: Springs, Gauteng, South Africa

*Disclaimer: SMEPal provides AI-generated guidance and templates. It is not a substitute for professional legal or financial advice from a certified South African attorney or Chartered Accountant.*