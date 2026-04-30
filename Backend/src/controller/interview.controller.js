const { PDFParse } = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const InterviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Resume file is required" });
        }

        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const resumeText = pdfData.text;
        await parser.destroy();
        
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !selfDescription) {
            return res.status(400).json({ success: false, message: "jobDescription and selfDescription are required" });
        }

        const interviewReportbyAi = await generateInterviewReport({
            resume: resumeText, 
            jobDescription, 
            selfDescription
        });

        const interviewReport = await InterviewReportModel.create({
            resume: resumeText, 
            jobDescription, 
            selfDescription,
            ...interviewReportbyAi,
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            message: "Interview report generated successfully",
            data: interviewReport
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ success: false, message: "Failed to generate report", error: error.message });
    }
}

async function generateTailoredResumeController(req, res) {
    try {
        let resumeText = req.body.resumeText;
        
        if (!resumeText) {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Resume file or resumeText is required" });
            }
            const parser = new PDFParse({ data: req.file.buffer });
            const pdfData = await parser.getText();
            resumeText = pdfData.text;
            await parser.destroy();
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !selfDescription) {
            return res.status(400).json({ success: false, message: "jobDescription and selfDescription are required" });
        }

        const pdfBuffer = await generateResumePdf({
            resume: resumeText,
            jobDescription,
            selfDescription
        });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=tailored_resume.pdf"
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating resume:", error);
        res.status(500).json({ success: false, message: "Failed to generate tailored resume", error: error.message });
    }
}

module.exports = { generateInterviewReportController, generateTailoredResumeController };
