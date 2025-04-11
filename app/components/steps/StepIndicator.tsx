"use client";
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  return (
    <div className="relative px-4">
      <div className="overflow-hidden">
        {/* Líneas base y de progreso */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-orange-500 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Círculos y etiquetas */}
        <div className="relative flex justify-between">
          {steps.map((label, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                  idx + 1 === currentStep
                    ? "border-orange-500 bg-orange-50 text-orange-500"
                    : idx + 1 < currentStep
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-gray-300 bg-white text-gray-300"
                }`}
              >
                {idx + 1 < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm">{idx + 1}</span>
                )}
              </div>
              <span
                className={`absolute -bottom-6 text-xs transform -translate-x-1/2 whitespace-nowrap transition-all duration-500 ${
                  idx + 1 === currentStep
                    ? "text-orange-500 font-medium scale-110"
                    : idx + 1 < currentStep
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
