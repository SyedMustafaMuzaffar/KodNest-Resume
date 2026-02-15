import React, { useState } from 'react';
import { useResume, resumeColors } from '../context/ResumeContext';
import Preview from './Preview';

// --- Components ---

const TagInput = ({ tags, onAdd, onRemove, placeholder }) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) {
                onAdd(input.trim());
                setInput('');
            }
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {tag}
                        <button
                            type="button"
                            onClick={() => onRemove(i)}
                            className="ml-1.5 inline-flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                            &times;
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:ring-1 focus:ring-primary"
            />
            <p className="text-[10px] text-muted-foreground">Press Enter to add.</p>
        </div>
    );
};

const AccordionItem = ({ title, isOpen, onToggle, onDelete, children }) => (
    <div className="border rounded-md bg-white shadow-sm overflow-hidden transition-all duration-200">
        <div
            className="flex items-center justify-between p-3 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50"
            onClick={onToggle}
        >
            <h4 className="text-sm font-semibold text-gray-800">{title || "New Item"}</h4>
            <div className="flex items-center gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                    Delete
                </button>
                <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </div>
        </div>
        {isOpen && <div className="p-4 border-t border-gray-100 space-y-4">{children}</div>}
    </div>
);

// --- Main Builder ---

const Builder = () => {
    const {
        resumeData,
        updateSection,
        updateNested,
        loadSampleData,
        atsScore,
        improvements,
        selectedTemplate,
        setSelectedTemplate,
        selectedColor,
        setSelectedColor
    } = useResume();

    const { personal, summary, education, experience, projects, skills, links } = resumeData;

    // Local state for UI
    const [expandedProject, setExpandedProject] = useState(0); // Index of expanded project
    const [isSkillsLoading, setIsSkillsLoading] = useState(false);

    // Helpers
    const getBulletGuidance = (text) => {
        if (!text) return null;
        const actionVerbs = ['Built', 'Developed', 'Designed', 'Implemented', 'Led', 'Improved', 'Created', 'Optimized', 'Automated', 'Managed', 'Engineered', 'Launched'];
        const hasActionVerb = actionVerbs.some(verb => text.trim().startsWith(verb));
        const hasNumber = /[0-9]%|\$[0-9]|[0-9]x|[0-9]k/i.test(text);

        if (!hasActionVerb) return "Start with a strong action verb (e.g., Built, Led).";
        if (!hasNumber) return "Add measurable impact (numbers, %, $).";
        return null;
    };

    const updateArrayItem = (section, index, key, value) => {
        const newArray = [...resumeData[section]];
        newArray[index] = { ...newArray[index], [key]: value };
        updateSection(section, newArray);
    };

    // Generic add/remove for arrays
    const addArrayItem = (section, emptyItem) => {
        const newArray = [...resumeData[section], emptyItem];
        updateSection(section, newArray);
        if (section === 'projects') setExpandedProject(newArray.length - 1);
    };

    const removeArrayItem = (section, index) => {
        const newArray = [...resumeData[section]];
        newArray.splice(index, 1);
        updateSection(section, newArray);
    };

    // Skills Logic
    const handleAddSkill = (category, skill) => {
        const currentSkills = skills[category] || [];
        if (!currentSkills.includes(skill)) {
            updateNested('skills', category, [...currentSkills, skill]);
        }
    };

    const handleRemoveSkill = (category, index) => {
        const currentSkills = skills[category] || [];
        const newSkills = currentSkills.filter((_, i) => i !== index);
        updateNested('skills', category, newSkills);
    };

    const handleSuggestSkills = () => {
        setIsSkillsLoading(true);
        setTimeout(() => {
            const suggestions = {
                technical: ["TypeScript", "React", "Node.js", "PostgreSQL", "GraphQL"],
                soft: ["Team Leadership", "Problem Solving"],
                tools: ["Git", "Docker", "AWS"]
            };

            // Merge unique
            const newSkills = { ...skills };
            Object.keys(suggestions).forEach(cat => {
                const existing = new Set(newSkills[cat]);
                suggestions[cat].forEach(s => existing.add(s));
                newSkills[cat] = Array.from(existing);
            });

            updateSection('skills', newSkills);
            setIsSkillsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-theme(spacing.24))] gap-6">
            {/* Left Column: Editor */}
            <div className="w-1/2 overflow-y-auto pr-2 pb-10 space-y-8 scrollbar-hide">

                {/* Header */}
                <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-4 border-b">
                    <h2 className="text-2xl font-bold font-serif text-gray-900">Editor</h2>
                    <button onClick={loadSampleData} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                        Load Sample Data
                    </button>
                </div>

                {/* Score Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-end mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">ATS Readiness</h3>
                        <span className={`text-2xl font-extrabold ${atsScore >= 80 ? 'text-emerald-600' : atsScore >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {atsScore}
                        </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 ease-out ${atsScore >= 80 ? 'bg-emerald-500' : atsScore >= 50 ? 'bg-amber-400' : 'bg-rose-500'}`}
                            style={{ width: `${atsScore}%` }}
                        />
                    </div>
                    {improvements.length > 0 && (
                        <div className="space-y-2 mt-4 pt-4 border-t border-slate-200/60">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Top Improvements</h4>
                            {improvements.map((imp, i) => (
                                <div key={i} className="flex gap-2 text-xs text-slate-700">
                                    <span className="text-primary">•</span> {imp}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 1. Personal Info */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Personal Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">Full Name</label>
                            <input value={personal.name} onChange={(e) => updateNested('personal', 'name', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">Email</label>
                            <input value={personal.email} onChange={(e) => updateNested('personal', 'email', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="jane@example.com" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">Phone</label>
                            <input value={personal.phone} onChange={(e) => updateNested('personal', 'phone', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="+1 (555) 000-0000" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">Location</label>
                            <input value={personal.location} onChange={(e) => updateNested('personal', 'location', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="New York, NY" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">LinkedIn URL</label>
                            <input value={links.linkedin} onChange={(e) => updateNested('links', 'linkedin', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="linkedin.com/in/..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700">GitHub URL</label>
                            <input value={links.github} onChange={(e) => updateNested('links', 'github', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="github.com/..." />
                        </div>
                    </div>
                </section>

                {/* 2. Professional Summary */}
                <section className="space-y-4">
                    <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Professional Summary</h3>
                    <div className="relative">
                        <textarea
                            value={summary}
                            onChange={(e) => updateSection('summary', e.target.value)}
                            className="w-full min-h-[100px] p-3 rounded-md border text-sm leading-relaxed"
                            placeholder="A concise summary of your background, years of experience, and key achievements..."
                        />
                        <div className={`absolute bottom-2 right-2 text-xs ${summary.length < 40 ? 'text-amber-500' : 'text-slate-400'}`}>
                            {summary.split(/\s+/).filter(Boolean).length} words
                        </div>
                    </div>
                </section>

                {/* 3. Skills */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Skills</h3>
                        <button
                            onClick={handleSuggestSkills}
                            disabled={isSkillsLoading}
                            className="text-xs flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isSkillsLoading ? 'Suggesting...' : '✨ Suggest AI Skills'}
                        </button>
                    </div>

                    <div className="space-y-5 bg-white p-4 rounded-lg border shadow-sm">
                        {/* Technical */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-700">Technical Skills</label>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{skills.technical?.length || 0}</span>
                            </div>
                            <TagInput
                                tags={skills.technical || []}
                                onAdd={(val) => handleAddSkill('technical', val)}
                                onRemove={(idx) => handleRemoveSkill('technical', idx)}
                                placeholder="e.g. React, Python..."
                            />
                        </div>
                        {/* Tools */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-700">Tools & Technologies</label>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{skills.tools?.length || 0}</span>
                            </div>
                            <TagInput
                                tags={skills.tools || []}
                                onAdd={(val) => handleAddSkill('tools', val)}
                                onRemove={(idx) => handleRemoveSkill('tools', idx)}
                                placeholder="e.g. Docker, AWS, Git..."
                            />
                        </div>
                        {/* Soft Skills */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-700">Soft Skills</label>
                                <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{skills.soft?.length || 0}</span>
                            </div>
                            <TagInput
                                tags={skills.soft || []}
                                onAdd={(val) => handleAddSkill('soft', val)}
                                onRemove={(idx) => handleRemoveSkill('soft', idx)}
                                placeholder="e.g. Leadership, Communication..."
                            />
                        </div>
                    </div>
                </section>

                {/* 4. Projects */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Projects</h3>
                        <button onClick={() => addArrayItem('projects', { title: '', description: '', techStack: [] })} className="text-xs font-bold text-primary hover:underline">+ Add Project</button>
                    </div>

                    <div className="space-y-3">
                        {projects.map((proj, idx) => (
                            <AccordionItem
                                key={idx}
                                title={proj.title}
                                isOpen={expandedProject === idx}
                                onToggle={() => setExpandedProject(expandedProject === idx ? -1 : idx)}
                                onDelete={() => removeArrayItem('projects', idx)}
                            >
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Project Title</label>
                                        <input
                                            value={proj.title || ''}
                                            onChange={(e) => updateArrayItem('projects', idx, 'title', e.target.value)}
                                            className="w-full h-9 px-3 rounded border text-sm"
                                            placeholder="e.g. E-Commerce Dashboard"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-700">Live URL</label>
                                            <input
                                                value={proj.liveUrl || ''}
                                                onChange={(e) => updateArrayItem('projects', idx, 'liveUrl', e.target.value)}
                                                className="w-full h-9 px-3 rounded border text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-700">GitHub URL</label>
                                            <input
                                                value={proj.githubUrl || ''}
                                                onChange={(e) => updateArrayItem('projects', idx, 'githubUrl', e.target.value)}
                                                className="w-full h-9 px-3 rounded border text-sm"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-700">Tech Stack</label>
                                        <TagInput
                                            tags={proj.techStack || []}
                                            onAdd={(tag) => {
                                                const newStack = [...(proj.techStack || []), tag];
                                                updateArrayItem('projects', idx, 'techStack', newStack);
                                            }}
                                            onRemove={(tIdx) => {
                                                const newStack = [...(proj.techStack || [])];
                                                newStack.splice(tIdx, 1);
                                                updateArrayItem('projects', idx, 'techStack', newStack);
                                            }}
                                            placeholder="Type technology & press Enter"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-medium text-slate-700">Description</label>
                                            <span className={`text-[10px] ${(proj.description?.length || 0) > 200 ? 'text-red-500' : 'text-slate-400'}`}>
                                                {proj.description?.length || 0}/200
                                            </span>
                                        </div>
                                        <textarea
                                            value={proj.description || ''}
                                            onChange={(e) => updateArrayItem('projects', idx, 'description', e.target.value)}
                                            className="w-full min-h-[80px] p-3 rounded border text-sm"
                                            placeholder="Describe the project..."
                                        />
                                        {proj.description && getBulletGuidance(proj.description) && (
                                            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1">
                                                <span>💡</span> {getBulletGuidance(proj.description)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionItem>
                        ))}
                        {projects.length === 0 && <div className="text-sm text-slate-400 italic text-center py-4 border rounded-md border-dashed">No projects added yet.</div>}
                    </div>
                </section>

                {/* 5. Experience (Kept simple for now as per minimal changes request, but structure preserved) */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Experience</h3>
                        <button onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', description: '' })} className="text-xs font-bold text-primary hover:underline">+ Add Experience</button>
                    </div>
                    <div className="space-y-3">
                        {experience.map((exp, idx) => (
                            <div key={idx} className="p-4 border rounded-md bg-gray-50/50 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase text-slate-400">Job #{idx + 1}</span>
                                    <button onClick={() => removeArrayItem('experience', idx)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input value={exp.company} onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} className="h-9 px-3 rounded border text-sm" placeholder="Company" />
                                    <input value={exp.role} onChange={(e) => updateArrayItem('experience', idx, 'role', e.target.value)} className="h-9 px-3 rounded border text-sm" placeholder="Role" />
                                </div>
                                <input value={exp.duration} onChange={(e) => updateArrayItem('experience', idx, 'duration', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="Duration" />
                                <div className="space-y-1">
                                    <textarea value={exp.description} onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} className="w-full min-h-[80px] p-3 rounded border text-sm" placeholder="Description..." />
                                    {exp.description && getBulletGuidance(exp.description) && (
                                        <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 flex items-center gap-1">
                                            <span>💡</span> {getBulletGuidance(exp.description)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. Education */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Education</h3>
                        <button onClick={() => addArrayItem('education', { institution: '', degree: '', year: '' })} className="text-xs font-bold text-primary hover:underline">+ Add Education</button>
                    </div>
                    <div className="space-y-3">
                        {education.map((edu, idx) => (
                            <div key={idx} className="p-4 border rounded-md bg-gray-50/50 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-xs font-bold uppercase text-slate-400">School #{idx + 1}</span>
                                    <button onClick={() => removeArrayItem('education', idx)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                                </div>
                                <input value={edu.institution} onChange={(e) => updateArrayItem('education', idx, 'institution', e.target.value)} className="w-full h-9 px-3 rounded border text-sm" placeholder="Institution" />
                                <div className="grid grid-cols-2 gap-3">
                                    <input value={edu.degree} onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} className="h-9 px-3 rounded border text-sm" placeholder="Degree" />
                                    <input value={edu.year} onChange={(e) => updateArrayItem('education', idx, 'year', e.target.value)} className="h-9 px-3 rounded border text-sm" placeholder="Year" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* Right Column: Preview */}
            <div className="w-1/2 bg-gray-100/50 rounded-xl border p-4 overflow-hidden flex flex-col">
                <div className="mb-6 space-y-6">

                    {/* Template Selection */}
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Template</h2>
                        <div className="grid grid-cols-3 gap-3">
                            {/* Classic */}
                            <button
                                onClick={() => setSelectedTemplate('classic')}
                                className={`relative group p-2 rounded-lg border-2 transition-all duration-200 overflow-hidden ${selectedTemplate === 'classic' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                                <div className="h-24 bg-white rounded border border-slate-100 shadow-sm flex flex-col p-1.5 gap-1">
                                    <div className="h-2 w-1/2 bg-slate-800 rounded-sm mb-1" />
                                    <div className="space-y-1">
                                        <div className="h-1 w-full bg-slate-200 rounded-sm" />
                                        <div className="h-1 w-full bg-slate-200 rounded-sm" />
                                        <div className="h-1 w-3/4 bg-slate-200 rounded-sm" />
                                    </div>
                                    <div className="mt-auto flex gap-1">
                                        <div className="h-8 w-1/3 bg-slate-100 rounded-sm" />
                                        <div className="h-8 w-2/3 bg-slate-100 rounded-sm" />
                                    </div>
                                </div>
                                <span className={`text-[10px] font-medium mt-2 block ${selectedTemplate === 'classic' ? 'text-primary' : 'text-slate-500'}`}>Classic</span>
                                {selectedTemplate === 'classic' && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px]">✓</div>
                                )}
                            </button>

                            {/* Modern */}
                            <button
                                onClick={() => setSelectedTemplate('modern')}
                                className={`relative group p-2 rounded-lg border-2 transition-all duration-200 overflow-hidden ${selectedTemplate === 'modern' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                                <div className="h-24 bg-white rounded border border-slate-100 shadow-sm flex flex-row overflow-hidden">
                                    <div className="w-1/3 h-full bg-slate-800 p-1">
                                        <div className="w-6 h-6 rounded-full bg-white/20 mb-2" />
                                        <div className="space-y-1">
                                            <div className="h-0.5 w-full bg-white/20 rounded-sm" />
                                            <div className="h-0.5 w-2/3 bg-white/20 rounded-sm" />
                                        </div>
                                    </div>
                                    <div className="w-2/3 p-1.5 space-y-1.5">
                                        <div className="h-2 w-3/4 bg-slate-800 rounded-sm" />
                                        <div className="space-y-0.5">
                                            <div className="h-1 w-full bg-slate-200 rounded-sm" />
                                            <div className="h-1 w-full bg-slate-200 rounded-sm" />
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-medium mt-2 block ${selectedTemplate === 'modern' ? 'text-primary' : 'text-slate-500'}`}>Modern</span>
                                {selectedTemplate === 'modern' && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px]">✓</div>
                                )}
                            </button>

                            {/* Minimal */}
                            <button
                                onClick={() => setSelectedTemplate('minimal')}
                                className={`relative group p-2 rounded-lg border-2 transition-all duration-200 overflow-hidden ${selectedTemplate === 'minimal' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                            >
                                <div className="h-24 bg-white rounded border border-slate-100 shadow-sm flex flex-col p-2 gap-2">
                                    <div className="h-3 w-1/2 bg-slate-800 rounded-sm" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="h-12 bg-slate-50 rounded-sm p-1">
                                            <div className="h-1 w-full bg-slate-200 rounded-sm mb-1" />
                                            <div className="h-1 w-2/3 bg-slate-200 rounded-sm" />
                                        </div>
                                        <div className="h-12 bg-slate-50 rounded-sm p-1">
                                            <div className="h-1 w-full bg-slate-200 rounded-sm mb-1" />
                                            <div className="h-1 w-2/3 bg-slate-200 rounded-sm" />
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-medium mt-2 block ${selectedTemplate === 'minimal' ? 'text-primary' : 'text-slate-500'}`}>Minimal</span>
                                {selectedTemplate === 'minimal' && (
                                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[8px]">✓</div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Color Theme</h2>
                        <div className="flex items-center gap-3">
                            {Object.entries(resumeColors).map(([name, color]) => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedColor(color)}
                                    className={`relative w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none ring-offset-2 ${selectedColor === color ? 'ring-2 ring-primary scale-110' : ''}`}
                                    style={{ backgroundColor: color }}
                                    title={name.charAt(0).toUpperCase() + name.slice(1)}
                                >
                                    {selectedColor === color && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto rounded shadow-sm custom-scrollbar bg-white/50 border border-slate-200/50">
                    <div className="scale-[0.65] origin-top h-full w-full p-4">
                        <Preview />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Builder;
