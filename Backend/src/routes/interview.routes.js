const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../controller/interview.controller");
const upload = require("../middleware/file.middleware");

const interviewRouter = express.Router();


interviewRouter.post("/generate-report", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController)
interviewRouter.post("/generate-resume", authMiddleware.authUser, upload.single("resume"), interviewController.generateTailoredResumeController)

module.exports = interviewRouter;