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
    <div className="relative">
      {/* Línea de progreso */}
      <div
        className="absolute top-5 left-0 h-0.5 bg-gray-200"
        style={{ width: "100%" }}
      >
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div
              key={step}
              className={`flex flex-col items-center ${
                index === steps.length - 1 ? "items-end" : ""
              }`}
            >
              {/* Círculo indicador */}
              <div
                className={`
                  w-4 h-4 sm:w-5 sm:h-5
                  rounded-full
                  border-2
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-500
                  ${
                    isCompleted || isCurrent
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300 bg-white"
                  }
                `}
              >
                <div
                  className={`
                    w-2 h-2 sm:w-2.5 sm:h-2.5
                    rounded-full
                    ${
                      isCompleted
                        ? "bg-white"
                        : isCurrent
                          ? "bg-white"
                          : "bg-transparent"
                    }
                  `}
                />
              </div>

              {/* Label */}
              <span
                className={`
                  mt-2
                  text-xs sm:text-sm
                  font-medium
                  ${
                    isCompleted || isCurrent
                      ? "text-orange-500"
                      : "text-gray-500"
                  }
                `}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
