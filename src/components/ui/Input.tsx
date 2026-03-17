"use client";

import { useState, type InputHTMLAttributes } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faEye, faEyeSlash } from "@/lib/fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  label: string;
  icon?: IconDefinition;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  icon,
  error,
  helperText,
  id,
  type,
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-charcoal"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon
              icon={icon}
              className={`h-4 w-4 ${error ? "text-coral" : "text-slate"}`}
              aria-hidden
            />
          </div>
        )}
        <input
          id={inputId}
          type={isPassword && showPassword ? "text" : type}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-all duration-200 ${
            icon ? "pl-10" : ""
          } ${
            isPassword || error ? "pr-10" : ""
          } ${
            error
              ? "border-coral text-coral focus:border-coral focus:ring-1 focus:ring-coral"
              : "border-gray-300 text-charcoal focus:border-forest focus:ring-1 focus:ring-forest focus:shadow-[0_0_0_3px_rgba(45,106,79,0.1)]"
          }`}
          aria-invalid={!!error}
          aria-describedby={errorId || helperId}
          {...props}
        />
        {isPassword && !error && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate hover:text-charcoal transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="h-4 w-4"
              aria-hidden
            />
          </button>
        )}
        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="h-4 w-4 text-coral"
              aria-hidden
            />
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-coral" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-xs text-slate">
          {helperText}
        </p>
      )}
    </div>
  );
}
