

# 🚀 ResumeAI

### *The Hyper-Focused ATS Optimization Engine powered by Gemini 3.1 Flash-Lite, Express, and React 19.*

[![React 19](https://img.shields.io/badge/React-19.0.1-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.1.14-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.23-FF4081?style=for-the-badge&logo=framer&logoColor=white)](https://motion.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
<br />
[![Express API](https://img.shields.io/badge/Express_Server-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini 3.1](https://img.shields.io/badge/Gemini_3.1--Flash--Lite-GenAI_2.4-F4B400?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Bundler](https://img.shields.io/badge/Esbuild-0.25.0-FFCF00?style=for-the-badge&logo=esbuild&logoColor=black)](https://esbuild.github.io/)
[![License](https://img.shields.io/badge/License-Apache_2.0-D22128?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#%EF%B8%A3-system-architecture">Pipeline Architecture</a> •
  <a href="#%EF%B8%A3-api-endpoints">Backend Endpoints</a> •
  <a href="#-ui-component-breakdown">Frontend Map</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

</div>

---

## ✨ Key Features

ResumeAI breaks away from traditional static template fillers. It implements an interactive, multi-stage conversational engine designed to systematically find job history gaps, extract business metrics, and generate bulletproof application profiles.

### 🔍 1. Contextual Missing-Metrics Interview
* **Automated Gap-Analysis:** Parses historical work experiences and checks your bullet items against the strict performance criteria of your targeted role.
* **Upward Mobility Tracking:** If an employment duration at any single company exceeds 4 years, the engine automatically triggers an explicit conversational prompt to capture sub-promotions, scope expansions, and structural advancements.

### 📈 2. Strict Google X-Y-Z Formatting
* Transforms raw text into executive action bullets following the formula: **"Accomplished [X], as measured by [Y], by doing [Z]"**.
* **Dynamic Vocabulary Matrix:** Restricts repetitive action verb usages. Consecutive bullet lines are blocked from using identical vocabulary, forcing highly engaging phrases (*Spearheaded, Engineered, Optimized, Architected, Catalyzed*).

### 💬 3. CoPilot Live Workspace Chat
* Fine-tune specific elements of your structural resume in real-time using a direct natural language chat window.
* **Payload Anti-Truncation Protection:** Structural history nodes, company details, or background matrices are never dropped or clipped for page space constraints during text refinement loops.

### 🧲 4. Growth & Outreach Pipeline Suite
* **LinkedIn Sync:** Instantly creates a hook-driven, 2-paragraph Bio section alongside a maximum-scannable 220-character professional Headline.
* **Cold Outreach Engine:** Crafts ultra-punchy cold LinkedIn DMs (capped under 600 characters) or highly converting B2B Cold Email sales frames matching specific job descriptions.



## 🗺️ System Architecture

The workflow seamlessly moves data between client-side rendering engines and server-side model processing nodes:

graph TD
    A[Step 1: Upload Mesh Text / PDF] -->|POST /api/analyze| B(AI Model Analysis)
    B -->|Generates Contextual Questions| C[Step 2: Interactive Metric Extraction Chat]
    C -->|POST /api/generate| D(Structural JSON Pipeline Builder)
    D -->|Injects Base64 Visual Assets| E[Step 3: Canvas Workspace View]
    E -->|User Edits: POST /api/copilot| F(Live CoPilot Realtime Refinement)
    E -->|Export Tooling| G[PDF Previews & Engine Outreaches]


## ⚙️ App Configurations & Type Definitions

The platform leverages a single, shared structural contract (`ResumeData`) ensuring absolute data sync across all backend calls and frontend transformations:

export interface ResumeData {
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string; // MM/YYYY Format Enforced
    targetTitle: string;
  };
  professionalSummary: string;
  skills: {
    coreExpertise: string[];
    technicalTools: string[];
    methodologies: string[];
  };
  workExperience: WorkExperience[];
  education: Education[];
  profileImageBase64?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  certifications?: string[];
  projects?: Project[];
  languages?: string[];
}


## 🪟 API Endpoints

### `POST /api/analyze`

Inspects raw document payloads against the desired destination role title to build precise, metrics-driven diagnostic queries.

* **Input Payload:** `{ resumeText: string, targetRole: string }`
* **Output Payload:** `InterviewCompany[]`

### `POST /api/generate`

Compiles interview responses and original historical details into a heavily polished, ATS-optimized JSON layout.

### `POST /api/copilot`

Monitors conversational tweaks to scale, prune, re-write, or condense resume entries without losing primary historical indices.

### `POST /api/generate-outreach`

Builds networking resources optimized across separate delivery platforms:

* `outreachType: 'linkedin'` → 600-character, greeting-free, high-impact direct message.
* `outreachType: 'email'` → 150-word sales framework featuring a scannable 3-bullet matrix.

---

## 🗂️ UI Component Breakdown

* **`Step1_Upload.tsx`** → Context initiator. Handles baseline document reading, target title ingestion, and profile image file loading.
* **`Step2_Interview.tsx`** → Renders targeted contextual interview workflows generated for each job experience node.
* **`Step3_Workspace.tsx`** → The control center. Splits views between data adjustment panels, layout configurations, and live document canvas preview panels.
* **`PdfLivePreview.tsx`** → Leverages `@react-pdf/renderer` to build real-time visual previews of 30+ custom template variants.
* **`LinkedInSync.tsx` & `MetricsSheet.tsx**` → Accessory dashboards to process quick LinkedIn enhancements and load pre-quantified Google metrics spreadsheets.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** running on your local development machine.

### 1. Project Installation

Clone down your source files and install the required modules:

```bash
git clone [https://github.com/your-username/resume-maker.git](https://github.com/your-username/resume-maker.git)
cd resume-maker
npm install

```

### 2. Environment Setup

Configure your API credentials by setting up your local configuration keys:

```env
GEMINI_API_KEY=your_gemini_api_key_here

```

### 3. Launch Development Server

Boot up the dual Vite development environment alongside the local backend routes:

```bash
npm run dev

```

Your service will begin hosting instantly at `http://localhost:3000`.

### 4. Build for Production

To bundle client modules and cross-compile your Node.js runtime code using esbuild:

```bash
npm run build
npm start

```

---
