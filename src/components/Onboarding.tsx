import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface OnboardingStep {
  id: string;
  title: string;
  content: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'dice',
    title: 'Roll for Turn Order',
    content: 'First, all players roll dice to determine who goes first. Higher rolls go earlier in the turn order.',
    target: '[data-tutorial="dice"]',
    position: 'bottom'
  },
  {
    id: 'personality',
    title: 'Draft Personalities',
    content: 'Choose a personality card that gives you special abilities throughout the game. Each has unique benefits and challenges.',
    target: '[data-tutorial="personality-draft"]',
    position: 'top'
  },
  {
    id: 'character',
    title: 'Draft Characters',
    content: 'Select your academic character. Each character starts with different amounts of funding, collaboration, and special tokens.',
    target: '[data-tutorial="character-draft"]',
    position: 'top'
  }
];

const Onboarding: React.FC = () => {
  const { 
    gameState, 
    showOnboarding, 
    setShowOnboarding,
    startDemoMode,
    isFirstTime 
  } = useGameStore();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showOnboarding && isFirstTime) {
      setIsVisible(true);
    }
  }, [showOnboarding, isFirstTime]);

  if (!isVisible || !showOnboarding) return null;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    setIsVisible(false);
  };

  const handleComplete = () => {
    setShowOnboarding(false);
    setIsVisible(false);
    setCurrentStep(0);
  };

  const handleDemo = () => {
    startDemoMode();
    handleComplete();
  };

  const step = onboardingSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
      >
        {/* Coach Mark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 
                id="onboarding-title"
                className="text-lg font-semibold text-gray-800"
              >
                {step.title}
              </h2>
              <button
                onClick={handleSkip}
                className="text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Skip tutorial"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-600 leading-relaxed">
                {step.content}
              </p>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-center gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep 
                        ? 'bg-blue-500' 
                        : index < currentStep 
                        ? 'bg-blue-300' 
                        : 'bg-gray-300'
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">
                Step {currentStep + 1} of {onboardingSteps.length}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-3 py-1 text-sm text-gray-600 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDemo}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500"
                >
                  Demo Mode
                </button>
                <button
                  onClick={handleSkip}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  Skip
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Spotlight Effect */}
        {step.target && (
          <div 
            className="absolute pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 0 2px #3B82F6, inset 0 0 0 4px rgba(59, 130, 246, 0.2)'
            }}
          />
        )}
      </div>
    </>
  );
};

export default Onboarding;
