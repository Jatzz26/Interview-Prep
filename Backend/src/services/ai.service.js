const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const genai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("the technical question that is relevant to the job description and resume"),
            answer: z.string().describe("how to answer this question"),
            intention: z.string().describe("the intention of the question")
        })
    ).describe("technical questions that can be asked in an interview along with how to answer them and the intention of the question"),
    behaviouralQuestions: z.array(
        z.object({
            question: z.string().describe("the behavioural question that is relevant to the job description and resume"),
            answer: z.string().describe("how to answer this question"),
            intention: z.string().describe("the intention of the question")
        })
    ).describe("behavioral questions that can be asked in an interview along with how to answer them and the intention of the question"),
    skillGaps: z.array(
        z.object({
            skill: z.string().describe("the skill which the candidate is lacking"),
            severity: z.enum(["high", "medium", "low"]).describe("the severity of the skill gap")
        }).describe("skill gaps that the candidate has")
    ),
    preparationPlan: z.array(
        z.object({
            day: z.number().describe("the day numbers in preparation plan"),
            focus: z.string().describe("the main focus of the day in the preparation plan,e.g. data structures and algorithms,react.js,node.js,databases,projects,behavioral questions"),
            tasks: z.array(z.string().describe("list of tasks to be done on this day to follow the preparation plan"))
        })
    ).describe("the preparation plan for the candidate to prepare for the interview, divided day by day with focus and tasks for each day")
})

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {

    const prompt = `
        generate an interview report for the given job description, resume and self description

        jobDescription: ${jobDescription}
        resume: ${resume}
        selfDescription: ${selfDescription}
    `;

    const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }
    })

    return JSON.parse(response.text);
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4", 
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, jobDescription, selfDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    });

    const prompt = `Generate an ATS-friendly resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        The response should be a JSON object with a single field "html" which contains the HTML content of the resume.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. 
                        The HTML content should be well-formatted, visually appealing, simple, and professional.
                        The content should be ATS friendly. Keep it 1-2 pages long.
                    `;

    const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    });

    const jsonContent = JSON.parse(response.text);
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf }