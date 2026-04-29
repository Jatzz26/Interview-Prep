import React, { useState, useRef } from 'react';
import { 
    FileText, 
    UploadCloud, 
    MapPin, 
    Rocket, 
    LogOut, 
    Moon, 
    Sun,
    Plus,
    User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../auth/hooks/useAuth';
import { generateInterviewReport } from '../services/interview.api';
import './home.scss';

const Home = () => {
    const { handleLogout, user } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState('dark');
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [selfDescription, setSelfDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef(null);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleDropAreaClick = () => {
        fileInputRef.current.click();
    };

    const handleGenerate = async () => {
        if (!jobDescription || !resumeFile || !selfDescription) {
            alert('Please provide Job Description, Resume, and Personal Introduction.');
            return;
        }

        setIsGenerating(true);
        try {
            const formData = new FormData();
            formData.append('jobDescription', jobDescription);
            formData.append('resume', resumeFile);
            formData.append('selfDescription', selfDescription);

            const result = await generateInterviewReport(formData);
            console.log('Report generated successfully:', result);
            navigate('/report', { state: { report: result.data } });
        } catch (error) {
            console.error('Failed to generate interview:', error);
            alert('Failed to generate interview.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={`home-wrapper ${theme}`}>
            <nav className="navbar">
                <div className="nav-left">
                    <span className="logo">Interview Prep</span>
                </div>
                <div className="nav-center">
                    <a href="#" className="nav-link active">DASHBOARD</a>
                </div>
                <div className="nav-right">
                    <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="icon-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </nav>

            <main className="home-main">
                <header className="hero-section">
                    <h1>AI Interview <span>Prep</span></h1>
                    <p>Refine your professional delivery with our high-stakes executive coach. Precision feedback for ambitious leaders.</p>
                </header>

                <div className="main-card">
                    <div className="card-columns">
                        <div className="left-col">
                            <div className="input-group">
                                <label htmlFor="jobDescription">
                                    <FileText size={16} className="label-icon" />
                                    Target Job Description
                                </label>
                                <textarea 
                                    name="jobDescription" 
                                    id="jobDescription" 
                                    placeholder="Paste the full job description here to calibrate the AI coach..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="right-col">
                            <div className="input-group">
                                <label htmlFor="resume">
                                    <FileText size={16} className="label-icon" />
                                    Resume (PDF)
                                </label>
                                <div className="file-drop-area" onClick={handleDropAreaClick}>
                                    <UploadCloud size={32} className="upload-icon" />
                                    <p className="upload-text">
                                        Drag and drop your resume or <span>browse</span>
                                    </p>
                                    <p className="upload-subtext">Maximum file size: 10MB</p>
                                    <input 
                                        type="file" 
                                        name="resume" 
                                        id="resume" 
                                        accept=".pdf" 
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    {resumeFile && <p className="file-selected">Selected: {resumeFile.name}</p>}
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="self-description">
                                    <MapPin size={16} className="label-icon" />
                                    Personal Introduction
                                </label>
                                <textarea 
                                    name="self-description" 
                                    id="self-description" 
                                    placeholder="Briefly describe your current role and goals..."
                                    className="small-textarea"
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="action-area">
                        <button 
                            className="btn-generate" 
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            style={{ opacity: isGenerating ? 0.7 : 1, cursor: isGenerating ? 'not-allowed' : 'pointer' }}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Interview'}
                            {!isGenerating && <Rocket size={18} />}
                        </button>
                        <div className="status-badges">
                            <span className="badge">
                                <span className="dot green-dot"></span>
                                AI Engine Ready
                            </span>
                            <span className="badge">
                                <span className="dot pink-dot"></span>
                                Premium Analysis
                            </span>
                        </div>
                    </div>
                </div>

                <button className="fab-button">
                    <Plus size={24} />
                </button>
            </main>
        </div>
    );
};

export default Home;