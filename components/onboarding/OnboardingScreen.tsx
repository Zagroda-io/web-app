'use client';

import React, { useState } from 'react';
import { CreateFarmStep } from './CreateFarmStep';
import { AddCowsStep } from './AddCowsStep';
import { useUser } from '@/context/UserContext';
import { motion, AnimatePresence } from 'framer-motion';

export const OnboardingScreen = () => {
  const [step, setStep] = useState<'farm' | 'cows'>('farm');
  const [newFarmId, setNewFarmId] = useState<string | null>(null);
  const { refreshUser } = useUser();

  const handleFarmSuccess = (id: string) => {
    setNewFarmId(id);
    setStep('cows');
  };

  const handleComplete = async () => {
    await refreshUser();
    // DashboardLayout zareaguje na zmianę w UserContext i przestanie renderować OnboardingScreen
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {step === 'farm' ? (
            <motion.div
              key="farm-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CreateFarmStep onSuccess={handleFarmSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="cows-step"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AddCowsStep farmId={newFarmId!} onComplete={handleComplete} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
