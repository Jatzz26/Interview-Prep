# AI Interview Prep Platform

An intelligent, full-stack application designed to help job seekers prepare for interviews by leveraging the power of Generative AI. The platform analyzes resumes against job descriptions to generate tailored ATS-friendly resumes, comprehensive interview reports, technical/behavioral questions, and personalized preparation plans.

## 🚀 Features

- **Resume Analysis:** Upload a PDF resume and a target job description to get a detailed match score.
- **ATS Resume Tailoring:** Generate a cleanly formatted, ATS-optimized HTML/PDF resume tailored specifically to the job description you are targeting.
- **AI Mock Interview Generation:** Receive a customized interview report containing:
  - Technical & Behavioral Questions
  - Ideal Answers & Interviewer Intentions
  - Identified Skill Gaps and their Severities
  - A structured Day-by-Day Preparation Plan
- **Robust Architecture:** Powered by Google's latest Gemini AI models (`gemini-2.5-flash-lite`), featuring automatic retry loops and fallback mechanisms to ensure high availability.
- **Secure Authentication:** User authentication and protected routes to manage personal interview reports securely.

## 💻 Tech Stack

### Frontend
- **Framework:** React.js
- **Styling:** SCSS (with a responsive, modern dark/light mode UI)
- **Routing:** React Router

### Backend
- **Server:** Node.js with Express.js
- **Database:** MongoDB (via Mongoose)
- **AI Integration:** Google Generative AI SDK (`@google/genai`)
- **PDF Processing:** `pdf-parse` (v2), `puppeteer` (for HTML-to-PDF conversion)
- **File Uploads:** Multer

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB running locally or a MongoDB Atlas URI
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Jatzz26/Interview-Prep.git
cd Interview-Prep
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend` directory (if required) and configure your backend API URL.

Start the frontend development server:
```bash
npm run dev
```

## 🧠 How the AI Works

The platform utilizes Google's **Gemini 2.5 Flash Lite** model. To ensure strict JSON formatting and avoid schema-parsing errors, the backend utilizes explicit structured-prompt engineering. A built-in automatic retry mechanism intercepts `503 High Demand` errors to provide a seamless, robust user experience even during peak API traffic times.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
