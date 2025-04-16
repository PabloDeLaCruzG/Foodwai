"use client";
import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className="px-4">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCurrentStep = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <li
              key={step}
              className={`relative ${index !== steps.length - 1 ? "flex-1" : ""}`}
            >
              {index !== steps.length - 1 && (
                <div
                  className={`absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 transition-colors ${
                    isCompleted ? "bg-orange-500" : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                  style={{ left: "50%", width: "100%" }}
                />
              )}

              <div
                className="group relative flex items-center justify-center"
                aria-current={isCurrentStep ? "step" : undefined}
              >
                <span className="absolute flex h-5 w-5 p-px" aria-hidden="true">
                  <span
                    className={`h-full w-full rounded-full ${
                      isCompleted
                        ? "bg-orange-500"
                        : isCurrentStep
                          ? "bg-orange-500"
                          : "bg-gray-200"
                    } transition-colors duration-300`}
                  />
                </span>
                <span
                  className={`relative flex h-5 w-5 items-center justify-center rounded-full ${
                    isCompleted || isCurrentStep
                      ? "bg-orange-500"
                      : "bg-gray-200"
                  } transition-colors duration-300`}
                >
                  {isCompleted ? (
                    <CheckIcon
                      className="h-3 w-3 text-white"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className={`text-xs font-semibold ${
                        isCurrentStep ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </span>
                <span
                  className={`absolute -bottom-7 whitespace-nowrap text-sm font-medium transition-colors ${
                    isCompleted || isCurrentStep
                      ? "text-orange-500"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                  <span className="sr-only">
                    {isCompleted
                      ? " completado"
                      : isCurrentStep
                        ? " actual"
                        : ""}
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
