
import React, { useState, useEffect } from 'react';
import { Job } from '../types';

const InputField: React.FC<{label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, required?: boolean}> = ({ label, id, value, onChange, type = 'text', placeholder, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">
            <input
                type={type}
                name={id}
                id={id}
                className="block w-full rounded-lg border-gray-300 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5"
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
            />
        </div>
    </div>
);

const TextAreaField: React.FC<{label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows?: number, placeholder?: string}> = ({ label, id, value, onChange, rows = 4, placeholder }) => (
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
                skills: ''
            });
        }
    }, [jobToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Job);
        onClose();
    };

    const isEditing = !!jobToEdit;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
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
                        <div>
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Job Information</h3>
                            <p className="mt-1 text-sm text-gray-500">Details about the role and position.</p>
                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <InputField label="Job Title" id="title" placeholder="e.g., Senior Product Designer" required value={formData.title || ''} onChange={handleChange} />
                                </div>
                                <div className="sm:col-span-2">
                                     <label htmlFor="type" className="block text-sm font-medium text-gray-700">Job Type</label>
                                    <select id="type" name="type" className="mt-1 block w-full rounded-lg border-gray-300 bg-white shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm px-3 py-2.5 pr-10" value={formData.type || 'Full-time'} onChange={handleChange}>
                                        <option>Full-time</option>
                                        <option>Part-time</option>
                                        <option>Contract</option>
                                        <option>Freelance</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-6">
                                    <TextAreaField label="Job Description" id="description" placeholder="Describe the role, responsibilities, and what you're looking for." value={formData.description || ''} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                         <div>
                            <h3 className="text-lg font-semibold leading-6 text-gray-900">Skills & Requirements</h3>
                            <p className="mt-1 text-sm text-gray-500">Specify the qualifications and skills needed.</p>
                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                               <div className="sm:col-span-6">
                                    <InputField label="Required Skills" id="skills" placeholder="e.g., Figma, UI Design, Prototyping (comma-separated)" value={formData.skills || ''} onChange={handleChange} />
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
