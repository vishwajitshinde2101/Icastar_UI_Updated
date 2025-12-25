
import React, { useState, useEffect } from 'react';
import { Job } from '../types';

const InputField: React.FC<{ label: string, id: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, required?: boolean, min?: number }> = ({ label, id, value, onChange, type = 'text', placeholder, required = false, min }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <input
                type={type}
                name={id}
                id={id}
                min={min}
                className="block w-full rounded-lg border-gray-300 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5"
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

const TextAreaField: React.FC<{ label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number, placeholder?: string }> = ({ label, id, value, onChange, rows = 4, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <textarea
                id={id}
                name={id}
                rows={rows}
                className="block w-full rounded-lg border-gray-300 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

const SelectField: React.FC<{
    label: string
    id: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    children: React.ReactNode
}> = ({ label, id, value, onChange, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <select
                id={id}
                name={id}
                className="block w-full rounded-lg border-gray-300 bg-white shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5 pr-10"
                value={value}
                onChange={onChange}
            >
                {children}
            </select>
        </div>
    </div>
);

const CheckboxField: React.FC<{
    label: string
    id: string
    checked: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    description?: string
}> = ({ label, id, checked, onChange, description }) => (
    <div className="relative flex items-start">
        <div className="flex h-5 items-center">
            <input
                id={id}
                name={id}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={checked}
                onChange={onChange}
            />
        </div>
        <div className="ml-3 text-sm">
            <label htmlFor={id} className="font-medium text-gray-700">{label}</label>
            {description && <p className="text-gray-500">{description}</p>}
        </div>
    </div>
);


interface PostJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (job: Job) => void;
    jobToEdit: Job | null;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onSave, jobToEdit }) => {
    const [formData, setFormData] = useState<Partial<Job>>({});

    useEffect(() => {
        if (jobToEdit) {
            setFormData(jobToEdit);
        } else {
            setFormData({
                title: '',
                type: 'Full-time',
                description: '',
                skills: '',
                experienceLevel: 'Entry Level',
                isRemote: false,
                currency: 'USD',
                isUrgent: false
            });
        }
    }, [jobToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            // keep as string for input, logic will handle conversion on submit if needed
            // but for types sake in Job interface it is number.
            // Let's store as number if value is present
            const numVal = value === '' ? undefined : parseFloat(value);
            setFormData(prev => ({ ...prev, [name]: numVal }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Job);
        onClose();
    };

    const isEditing = !!jobToEdit;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 id="modal-title" className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Job' : 'Add New Job'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form id="post-job-form" onSubmit={handleFormSubmit} className="overflow-y-auto">
                    <div className="p-8 space-y-8">
                        {/* Job Details Section */}
                        <div>
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4">Job Details</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                    <InputField label="Job Title" id="title" placeholder="e.g., Senior Product Designer" required value={formData.title || ''} onChange={handleChange} />
                                </div>
                                <div className="sm:col-span-1">
                                    <SelectField label="Job Type" id="type" value={formData.type || 'Full-time'} onChange={handleChange}>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Freelance</option>
                                    </SelectField>
                                </div>
                                <div className="sm:col-span-1">
                                    <SelectField label="Experience Level" id="experienceLevel" value={formData.experienceLevel || 'Entry Level'} onChange={handleChange}>
                                        <option value="Entry Level">Entry Level</option>
                                        <option value="Mid Level">Mid Level</option>
                                        <option value="Senior Level">Senior Level</option>
                                        <option value="Director">Director</option>
                                        <option value="Executive">Executive</option>
                                    </SelectField>
                                </div>

                                <div className="sm:col-span-2">
                                    <div className="flex items-center gap-6">
                                        <CheckboxField
                                            label="Remote Position"
                                            id="isRemote"
                                            checked={formData.isRemote || false}
                                            onChange={handleChange}
                                            description="This job can be performed remotely"
                                        />

                                        {!formData.isRemote && (
                                            <div className="flex-1">
                                                <InputField label="Location" id="location" placeholder="e.g., New York, NY" value={formData.location || ''} onChange={handleChange} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Job Description Section */}
                        <div>
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4">Description & Requirements</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                                <div>
                                    <TextAreaField label="Job Description" id="description" placeholder="Describe the role, responsibilities, and what you're looking for." value={formData.description || ''} onChange={handleChange} />
                                </div>
                                <div>
                                    <TextAreaField label="Requirements" id="requirements" placeholder="List specific requirements, qualifications, and nice-to-haves." value={formData.requirements || ''} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Skills & Compensation Section */}
                        <div>
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4">Skills & Compensation</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-6">
                                    <InputField label="Required Skills" id="skills" placeholder="e.g., Figma, UI Design, Prototyping (comma-separated)" value={formData.skills || ''} onChange={handleChange} />
                                </div>

                                <div className="sm:col-span-2">
                                    <SelectField label="Currency" id="currency" value={formData.currency || 'USD'} onChange={handleChange}>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                    </SelectField>
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField label="Budget Min" id="budgetMin" type="number" placeholder="Min" value={formData.budgetMin ?? ''} onChange={handleChange} min={0} />
                                </div>
                                <div className="sm:col-span-2">
                                    <InputField label="Budget Max" id="budgetMax" type="number" placeholder="Max" value={formData.budgetMax ?? ''} onChange={handleChange} min={0} />
                                </div>

                                <div className="sm:col-span-3">
                                    <InputField label="Contract Duration (Days)" id="durationDays" type="number" placeholder="e.g., 30" value={formData.durationDays ?? ''} onChange={handleChange} min={1} />
                                </div>
                            </div>
                        </div>

                        {/* Hiring Details Section */}
                        <div>
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 border-b pb-2 mb-4">Hiring Details</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
                                <div className="sm:col-span-2">
                                    <InputField label="Application Deadline" id="applicationDeadline" type="date" value={formData.applicationDeadline || ''} onChange={handleChange} />
                                </div>
                                <div className="sm:col-span-2">
                                    <CheckboxField
                                        label="Urgent Hiring"
                                        id="isUrgent"
                                        checked={formData.isUrgent || false}
                                        onChange={handleChange}
                                        description="Mark this job as urgent to attract more applicants"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="flex justify-end items-center p-6 border-t space-x-3 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="post-job-form"
                        className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        {isEditing ? 'Save Changes' : 'Add Job'}
                    </button>
                </div>
            </div>
        </div>
    );
};
