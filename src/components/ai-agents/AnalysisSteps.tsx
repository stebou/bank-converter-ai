'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React from 'react';
import { type AnalysisStep } from '../../types/ai-agents';

interface AnalysisStepsProps {
  steps: AnalysisStep[];
}

export const AnalysisSteps: React.FC<AnalysisStepsProps> = ({ steps }) => {
  return (
    <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-2">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-start gap-3 rounded-lg p-3 transition-all duration-200 ${
            step.status === 'completed'
              ? 'bg-green-50'
              : step.status === 'running'
              ? 'bg-blue-50'
              : step.status === 'error'
              ? 'bg-red-50'
              : 'bg-gray-50'
          }`}
        >
          <div
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
              step.status === 'completed'
                ? 'bg-green-500'
                : step.status === 'running'
                ? 'bg-blue-500'
                : step.status === 'error'
                ? 'bg-red-500'
                : 'bg-gray-300'
            }`}
          >
            {step.status === 'completed' ? (
              <CheckCircle className="h-4 w-4 text-white" />
            ) : step.status === 'running' ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : step.status === 'error' ? (
              <XCircle className="h-4 w-4 text-white" />
            ) : (
              <span className="text-xs font-medium text-white">
                {index + 1}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-montserrat truncate text-sm font-medium text-[#2c3e50]">
              {step.title}
            </h3>
            <p className="font-open-sans line-clamp-1 text-xs text-[#34495e]">
              {step.description}
            </p>
            {step.startTime && step.status === 'running' && (
              <p className="font-open-sans text-xs text-[#3498db]">
                Durée:{' '}
                {Math.floor(
                  (Date.now() - step.startTime.getTime()) / 1000
                )}s
              </p>
            )}
            {step.endTime && step.status === 'completed' && (
              <p className="font-open-sans text-xs text-green-600">
                Terminé en{' '}
                {Math.floor(
                  (step.endTime.getTime() -
                    (step.startTime?.getTime() || 0)) /
                    1000
                )}s
              </p>
            )}
          </div>
          {step.status === 'running' && (
            <div className="h-6 w-1 flex-shrink-0 overflow-hidden rounded-full bg-blue-200">
              <motion.div
                className="w-full rounded-full bg-blue-500"
                initial={{ height: '0%' }}
                animate={{ height: `${step.progress}%` }}
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};
