import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
    withCredentials: true,
});

export async function generateInterviewReport(formData) {
    try {
        const response = await api.post('/api/interview/generate-report', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err) {
        console.error("API Error: ", err);
        throw err;
    }
}

export async function generateTailoredResume(formData) {
    try {
        const response = await api.post('/api/interview/generate-resume', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            responseType: 'blob' // important for handling the PDF buffer
        });
        return response.data;
    } catch (err) {
        console.error("API Error: ", err);
        throw err;
    }
}
