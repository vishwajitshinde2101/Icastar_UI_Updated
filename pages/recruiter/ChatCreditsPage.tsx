
import React from 'react';
import { PricingPageLayout } from './PricingPageLayout';

const chatCreditPlans = [
  {
    planName: 'Starter',
    price: '$29',
    description: 'Perfect for getting started and occasional hiring.',
    features: ['50 chat credits', 'Engage with up to 50 artists', 'Standard support'],
    buttonText: 'Purchase Starter',
  },
  {
    planName: 'Pro',
    price: '$99',
    description: 'For growing teams with continuous hiring needs.',
    features: ['200 chat credits', 'Engage with up to 200 artists', 'Priority support', 'Read receipts'],
    buttonText: 'Purchase Pro',
    recommended: true,
  },
  {
    planName: 'Enterprise',
    price: 'Contact Us',
    description: 'For large organizations with high-volume needs.',
    features: ['Unlimited chat credits', 'Dedicated account manager', 'API access', 'Advanced analytics'],
    buttonText: 'Contact Sales',
  },
];

export const ChatCreditsPage= () => {
  return (
    <PricingPageLayout 
        title="Chat Credits"
        subtitle="Purchase credits to initiate conversations with talented artists from around the world."
        plans={chatCreditPlans}
    />
  );
};
