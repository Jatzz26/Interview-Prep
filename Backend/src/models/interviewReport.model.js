const mongoose = require('mongoose')

/**
 * -Job description : string
 * - resume text : string
 * - self description : string
 * 
 * -matchScore : number
 * 
 * Technical questions and answers : [{
 *                                     question: "",
 *                                     answer: "",
 *                                     intention:""
 * }]
 * Behavioural questions and answers: [{
 *                                       question: "",
 *                                       answer: "",
 *                                       intention: ""
 * }] 
 * skills gap : [{
 *                skill : "",
 *                severity : ""{
 *                              type : string,
 *                              enum : ["high","medium","low"]
 *                              }
 * }]
 * preparation plan : [{
 *                      day : number,
 *                      focus : string,
 *                      tasks : [string]
 * }]
 */
const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
}, {
    _id: false
})

const behaviouralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
},
    {
        _id: false
    }
)

const skillsGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        required: [true, "Severity is required"],
        enum: ["high", "medium", "low"]
    }
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: {
        type: [String],
        required: [true, "Tasks are required"]
    }
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    title: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behaviouralQuestions: [behaviouralQuestionSchema],
    skillGaps: [skillsGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
})
