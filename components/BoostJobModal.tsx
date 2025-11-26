import React from 'react';
import { Job } from '../types';
import { PricingCard, PricingCardProps } from './PricingCard';

const boostJobPlans: Omit<PricingCardProps, 'onSelect'>[] = [
  {
    planName: 'Single Boost',
    price: '$49',
    description: 'Give one job post extra visibility for 7 days.',
    features: ['Top of search results', 'Featured on homepage', 'Emailed to relevant artists'],
    buttonText: 'Boost for 7 Days',
  },
  {
    planName: 'Power Boost',
    price: '$129',
    description: 'Maximize visibility for a crucial role for 30 days.',
    features: ['Everything in Single Boost', 'Social media promotion', 'Featured company badge'],
    buttonText: 'Boost for 30 Days',
    recommended: true,
  },
  {
    planName: 'Recruiter Pack',
    price: '$299',
    description: 'A bundle of 10 job boosts to use anytime.',
    features: ['10 boost credits', 'Use on any job post', 'Credits never expire'],
    buttonText: 'Purchase Pack',
  },
];

interface BoostJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBoost: (jobId: number) => void;
    jobToBoost: Job | null;
}

export const BoostJobModal: React.FC<BoostJobModalProps> = ({ isOpen, onClose, onBoost, jobToBoost }) => {
    if (!isOpen || !jobToBoost) return null;

    const handleSelectPlan = () => {
        onBoost(jobToBoost.id);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 id="modal-title" className="text-2xl font-bold text-gray-900">Boost Job: "{jobToBoost.title}"</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-8 overflow-y-auto">
                    <p className="text-lg text-gray-600 text-center max-w-2xl mx-auto">Select a boost plan to increase visibility and attract more qualified candidates for this role.</p>
                    <div className="mt-8 max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
                       {boostJobPlans.map(plan => (
                            <PricingCard
                                key={plan.planName}
                                {...plan}
                                onSelect={handleSelectPlan}
                            />
                        ))}
                    </div>
                </div>
                 <div className="flex justify-end items-center p-6 border-t space-x-3 bg-gray-50 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};