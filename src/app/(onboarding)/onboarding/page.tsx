'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeStep } from '@/components/onboarding/WelcomeStep';
import { WhatsappStep } from '@/components/onboarding/WhatsappStep';
import { LeadImportStep } from '@/components/onboarding/LeadImportStep';
import { TemplateStep } from '@/components/onboarding/TemplateStep';
import { CampaignStep } from '@/components/onboarding/CampaignStep';
import { CompletionStep } from '@/components/onboarding/CompletionStep';
import styles from './onboarding.module.css';

export type OnboardingData = {
  whatsapp: {
    accountName: string;
    phoneNumberId: string;
    businessAccountId: string;
    accessToken: string;
    displayPhoneNumber?: string;
  } | null;
  leads: {
    imported: number;
  };
  template: {
    id: string;
    name: string;
  } | null;
  campaign: {
    id: string;
    name: string;
  } | null;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    whatsapp: null,
    leads: { imported: 0 },
    template: null,
    campaign: null,
  });

  const updateData = (step: keyof OnboardingData, value: OnboardingData[keyof OnboardingData]) => {
    setData((prev) => ({ ...prev, [step]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} />,
    <WhatsappStep key="whatsapp" onNext={nextStep} onDataChange={(data) => updateData('whatsapp', data)} />,
    <LeadImportStep key="leads" onNext={nextStep} onDataChange={(data) => updateData('leads', data)} />,
    <TemplateStep key="template" onNext={nextStep} onDataChange={(data) => updateData('template', data)} />,
    <CampaignStep key="campaign" onNext={nextStep} onDataChange={(data) => updateData('campaign', data)} />,
    <CompletionStep key="complete" onFinish={() => router.push('/')} />,
  ];

  const stepLabels = ['Welcome', 'WhatsApp', 'Import Leads', 'Create Template', 'Launch Campaign', 'Complete'];

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ width: `${(currentStep / 5) * 100}%` }} />
      </div>

      <div className={styles.stepIndicator}>
        {stepLabels.map((label, index) => (
          <div
            key={label}
            className={`${styles.step} ${index === currentStep ? styles.active : ''} ${index < currentStep ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}>{index < currentStep ? '✓' : index + 1}</div>
            <span className={styles.stepLabel}>{label}</span>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        {steps[currentStep]}
      </div>

      <div className={styles.navigation}>
        {currentStep > 0 && currentStep < 5 && (
          <button className={styles.backButton} onClick={prevStep}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}
