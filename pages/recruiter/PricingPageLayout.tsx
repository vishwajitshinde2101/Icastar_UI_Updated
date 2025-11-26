import React from 'react';
import { PricingCard, PricingCardProps } from '../../components/PricingCard';

interface PricingPageLayoutProps {
    title: string;
    subtitle: string;
    plans: Omit<PricingCardProps, 'onSelect'>[];
}

export const PricingPageLayout: React.FC<PricingPageLayoutProps> = ({ title, subtitle, plans }) => (
    <div>
        <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
            <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600">
                {subtitle}
            </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {plans.map(plan => (
                <PricingCard key={plan.planName} {...plan} />
            ))}
        </div>
    </div>
);