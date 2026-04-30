# Interview Prep Notes: AI Interview Platform

Use this document to prepare for interviews when discussing your **AI Interview Prep Platform**. It highlights the key technical decisions, challenges you overcame, and your overall architecture.

---

## 1. The Elevator Pitch (What is this project?)
"I built a full-stack AI-powered platform to help candidates prepare for job interviews. The application takes a user's PDF resume and a target job description, parses the data, and uses Google's Gemini AI to generate a highly tailored, ATS-friendly resume and a comprehensive interview report. The report includes a match score, customized technical and behavioral questions, identified skill gaps, and a day-by-day preparation plan."

---

## 2. Architecture & Tech Stack

**Frontend:**
- **React.js:** Used for building a dynamic, responsive Single Page Application (SPA).
- **SCSS:** Implemented modular styling with robust dark/light mode theming and cross-browser CSS compatibility (e.g., using proper vendor prefixes for gradient text).
- **React Router:** For seamless client-side navigation.

**Backend:**
- **Node.js & Express.js:** RESTful API architecture handling file uploads and business logic.
- **MongoDB & Mongoose:** Used to persistently store generated interview reports linked to user accounts.
- **Multer:** Handled multipart/form-data for seamless PDF file uploads from the frontend.
- **Puppeteer:** A headless browser automation tool used to dynamically convert AI-generated HTML resumes into downloadable, formatted PDF files.
- **pdf-parse:** Used to extract raw text content from uploaded PDF resumes.

**AI Integration:**
- **Google Generative AI SDK (`@google/genai`):** Interfaced with the Gemini API to analyze the resume against job descriptions using advanced Prompt Engineering.

---

## 3. Key Technical Challenges & Solutions

This is the most important section for interviews. Interviewers love hearing about problems you faced and how you debugged them.

### Challenge 1: Unreliable AI Output Formatting (Schema Validation)
**The Problem:** The Gemini AI models sometimes struggled to consistently return structured JSON, occasionally hallucinating text or completely ignoring the `@google/genai` library's `responseSchema` configuration. This caused Mongoose validation errors (`TypeError: InterviewReportModel.create is not a function` or missing fields) when trying to save the report to the database.
**The Solution:** I implemented strict **Prompt Engineering**. Instead of relying solely on the API's schema parameter, I injected a hardcoded, explicit JSON template directly into the prompt instructions, explicitly commanding the AI to return *only* that structure. This guaranteed the output matched my Mongoose schema perfectly.

### Challenge 2: AI API Rate Limiting & High Demand Errors
**The Problem:** The backend frequently crashed with `503 Service Unavailable (High Demand)` and `429 Quota Exceeded` errors because the standard Gemini models (`gemini-2.5-flash`) were overwhelmed or I hit my free-tier limits.
**The Solution:** 
1. **Model Fallback:** I dynamically switched the model configuration to `gemini-2.5-flash-lite`, which bypassed the severe quota limitations while maintaining fast, high-quality responses.
2. **Resilience (Retry Logic):** To handle intermittent 503 network/demand errors gracefully, I wrapped the API calls in an asynchronous **Retry Loop**. The system now automatically catches 503 errors, waits for 2 seconds, and retries the request (up to 3 times) before failing. This dramatically improved the reliability of the application without the user even noticing the backend hiccups.

### Challenge 3: Third-Party Package Upgrades (`pdf-parse`)
**The Problem:** The backend threw a `TypeError: pdfParse is not a function`. The `pdf-parse` library was updated to `v2`, which introduced breaking changes by migrating from a single default exported function to an Object-Oriented class (`PDFParse`).
**The Solution:** I dug into the node_modules documentation to understand the new API surface, rewrote the integration to instantiate the `PDFParse` class, utilized the new `getText()` method, and properly called `destroy()` to prevent memory leaks in the Node.js server.

---

## 4. Potential Follow-up Questions from Interviewers

**Q: Why did you use Puppeteer to generate PDFs instead of a simpler library?**
*A: While libraries like `jspdf` exist, they struggle with complex HTML/CSS rendering. Puppeteer uses a real headless Chromium browser, ensuring that the AI-generated HTML resumes look identical to how they would render on a webpage, complete with precise margins and fonts.*

**Q: How did you handle security?**
*A: Environment variables (`.env`) protect sensitive keys like the MongoDB URI, JWT Secrets, and the Google API Key. The application uses JWT middleware (`authMiddleware`) to protect routes and ensure users can only access their own interview reports.*

**Q: If you had more time, how would you scale this application?**
*A: I would implement a job queue (like Redis + BullMQ) for the AI generation processes. AI requests and Puppeteer PDF generation are heavy operations. Processing them asynchronously via webhooks or WebSockets would prevent the Express HTTP requests from timing out and improve user experience with loading states.*
