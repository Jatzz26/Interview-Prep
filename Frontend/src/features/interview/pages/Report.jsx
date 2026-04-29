import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    LogOut, 
    Moon, 
    Sun,
    AlertTriangle,
    CheckCircle,
    Calendar,
    Code,
    Users,
    ChevronDown,
    ChevronUp,
    Download
} from 'lucide-react';
import useAuth from '../../auth/hooks/useAuth';
import { generateTailoredResume } from '../services/interview.api';
import './report.scss';

const QuestionCard = ({ question, answer, intention, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="question-card">
            <div className="question-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="q-title">
                    <span className="q-number">Q{index + 1}</span>
                    <h4>{question}</h4>
                </div>
                <button className="toggle-btn">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>
            
            {isOpen && (
                <div className="question-body">
                    <div className="intention-box">
                        <h5><Users size={16} /> Interviewer's Intention:</h5>
                        <p>{intention}</p>
                    </div>
                    <div className="answer-box">
                        <h5><CheckCircle size={16} /> Suggested Answer Approach:</h5>
                        <p>{answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const Report = () => {
    const { handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [theme, setTheme] = useState('dark');
    const [activeTab, setActiveTab] = useState('overview');
    const [isDownloading, setIsDownloading] = useState(false);

    const report = location.state?.report;

    const handleDownloadResume = async () => {
        setIsDownloading(true);
        try {
            const formData = new FormData();
            formData.append('resumeText', report.resume);
            formData.append('jobDescription', report.jobDescription);
            formData.append('selfDescription', report.selfDescription);

            const pdfBlob = await generateTailoredResume(formData);
            const url = window.URL.createObjectURL(new Blob([pdfBlob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'tailored_resume.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Failed to download resume:', error);
            alert('Failed to generate tailored resume. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    // If no report data, redirect back
    if (!report) {
        return (
            <div className={`report-wrapper ${theme}`}>
                <div className="error-state">
                    <h2>No Report Found</h2>
                    <p>Please generate an interview report first.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">Go Back</button>
                </div>
            </div>
        );
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className={`report-wrapper ${theme}`}>
            <nav className="navbar">
                <div className="nav-left">
                    <span className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Interview Prep</span>
                </div>
                <div className="nav-center">
                    <a href="#" className="nav-link active">REPORT DASHBOARD</a>
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

            <main className="report-main">
                <header className="report-hero">
                    <div className="hero-content-wrapper">
                        <div className="hero-text">
                            <h1>{report.title || "Interview Analysis"}</h1>
                            <p>We've analyzed your profile against the job description. Here is your tailored preparation plan and practice questions.</p>
                            
                            <button 
                                className="btn-primary btn-download" 
                                onClick={handleDownloadResume}
                                disabled={isDownloading}
                                style={{ opacity: isDownloading ? 0.7 : 1 }}
                            >
                                <Download size={18} />
                                {isDownloading ? 'Generating ATS Resume...' : 'Download Tailored Resume'}
                            </button>
                        </div>
                        
                        {report.matchScore !== undefined && (
                            <div className="match-score-circle">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path className="circle-bg"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path className="circle"
                                        strokeDasharray={`${report.matchScore}, 100`}
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="percentage">{report.matchScore}%</text>
                                </svg>
                                <span className="score-label">ATS Match</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="tab-navigation">
                        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview & Gaps</button>
                        <button className={`tab-btn ${activeTab === 'technical' ? 'active' : ''}`} onClick={() => setActiveTab('technical')}>Technical Prep</button>
                        <button className={`tab-btn ${activeTab === 'behavioural' ? 'active' : ''}`} onClick={() => setActiveTab('behavioural')}>Behavioural</button>
                        <button className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>Preparation Plan</button>
                    </div>
                </header>

                <div className="content-container">
                    {activeTab === 'overview' && (
                        <div className="overview-section fade-in">
                            <h2><AlertTriangle size={24} className="icon-yellow" /> Skill Gaps Identified</h2>
                            <p className="section-desc">Areas you need to brush up on before the interview based on the job description.</p>
                            
                            {report.skillGaps && report.skillGaps.length > 0 ? (
                                <div className="gaps-grid">
                                    {report.skillGaps.map((gap, index) => (
                                        <div key={index} className={`gap-card severity-${gap.severity}`}>
                                            <div className="gap-indicator"></div>
                                            <div className="gap-info">
                                                <h4>{gap.skill}</h4>
                                                <span className="severity-badge">{gap.severity} Priority</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="success-box">
                                    <CheckCircle size={24} />
                                    <p>Great news! No major skill gaps identified based on your resume.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'technical' && (
                        <div className="questions-section fade-in">
                            <h2><Code size={24} className="icon-blue" /> Technical Questions</h2>
                            <p className="section-desc">Practice these technical questions tailored to your resume and target role. Click to reveal the intention and suggested answer.</p>
                            
                            <div className="questions-list">
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} index={i} question={q.question} answer={q.answer} intention={q.intention} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'behavioural' && (
                        <div className="questions-section fade-in">
                            <h2><Users size={24} className="icon-pink" /> Behavioural Questions</h2>
                            <p className="section-desc">Leadership and behavioral questions to test your cultural fit and soft skills.</p>
                            
                            <div className="questions-list">
                                {report.behaviouralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} index={i} question={q.question} answer={q.answer} intention={q.intention} />
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'plan' && (
                        <div className="plan-section fade-in">
                            <h2><Calendar size={24} className="icon-green" /> Day-by-Day Preparation Plan</h2>
                            <p className="section-desc">Your structured roadmap to master the interview.</p>
                            
                            <div className="timeline">
                                {report.preparationPlan?.map((plan, index) => (
                                    <div key={index} className="timeline-item">
                                        <div className="timeline-marker">
                                            <span>Day {plan.day}</span>
                                        </div>
                                        <div className="timeline-content">
                                            <h3>{plan.focus}</h3>
                                            <ul>
                                                {plan.tasks?.map((task, i) => (
                                                    <li key={i}>{task}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Report;
