"use client";

import {
  forwardRef,
  memo,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface BaseInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

// ============================================================================
// INPUT
// ============================================================================

export interface InputProps
  extends BaseInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  wrapperClassName?: string;
  inputClassName?: string;
}

export const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(
    (
      {
        label,
        error,
        helperText,
        icon: Icon,
        iconPosition = "left",
        wrapperClassName,
        inputClassName,
        id,
        ...props
      },
      ref
    ) => {
      const inputId = id || props.name;

      return (
        <div className={cn("space-y-2", wrapperClassName)}>
          {label && (
            <label
              htmlFor={inputId}
              className="block text-sm font-semibold text-dark-green"
            >
              {label}
              {props.required && (
                <span className="text-tomato-red ml-1">*</span>
              )}
            </label>
          )}
          <div className="relative">
            {Icon && iconPosition === "left" && (
              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
            )}
            <input
              ref={ref}
              id={inputId}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
                "bg-white text-dark-green placeholder:text-dark-green/40",
                "focus:outline-none focus:ring-2 focus:ring-dark-green/20",
                error
                  ? "border-tomato-red focus:border-tomato-red"
                  : "border-dark-green/20 focus:border-dark-green",
                Icon && iconPosition === "left" && "pl-12",
                Icon && iconPosition === "right" && "pr-12",
                inputClassName
              )}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : undefined}
              {...props}
            />
            {Icon && iconPosition === "right" && (
              <Icon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40" />
            )}
          </div>
          {error && (
            <p id={`${inputId}-error`} className="text-sm text-tomato-red">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-dark-green/60">{helperText}</p>
          )}
        </div>
      );
    }
  )
);

Input.displayName = "Input";

// ============================================================================
// TEXTAREA
// ============================================================================

export interface TextareaProps
  extends BaseInputProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  wrapperClassName?: string;
  textareaClassName?: string;
}

export const Textarea = memo(
  forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
      {
        label,
        error,
        helperText,
        wrapperClassName,
        textareaClassName,
        id,
        ...props
      },
      ref
    ) => {
      const textareaId = id || props.name;

      return (
        <div className={cn("space-y-2", wrapperClassName)}>
          {label && (
            <label
              htmlFor={textareaId}
              className="block text-sm font-semibold text-dark-green"
            >
              {label}
              {props.required && (
                <span className="text-tomato-red ml-1">*</span>
              )}
            </label>
          )}
          <textarea
            ref={ref}
            id={textareaId}
            className={cn(
              "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
              "bg-white text-dark-green placeholder:text-dark-green/40",
              "focus:outline-none focus:ring-2 focus:ring-dark-green/20",
              "resize-none min-h-[120px]",
              error
                ? "border-tomato-red focus:border-tomato-red"
                : "border-dark-green/20 focus:border-dark-green",
              textareaClassName
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${textareaId}-error` : undefined}
            {...props}
          />
          {error && (
            <p id={`${textareaId}-error`} className="text-sm text-tomato-red">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-dark-green/60">{helperText}</p>
          )}
        </div>
      );
    }
  )
);

Textarea.displayName = "Textarea";

// ============================================================================
// SELECT
// ============================================================================

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends BaseInputProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> {
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
  selectClassName?: string;
}

export const Select = memo(
  forwardRef<HTMLSelectElement, SelectProps>(
    (
      {
        label,
        error,
        helperText,
        options,
        placeholder,
        icon: Icon,
        wrapperClassName,
        selectClassName,
        id,
        ...props
      },
      ref
    ) => {
      const selectId = id || props.name;

      return (
        <div className={cn("space-y-2", wrapperClassName)}>
          {label && (
            <label
              htmlFor={selectId}
              className="block text-sm font-semibold text-dark-green"
            >
              {label}
              {props.required && (
                <span className="text-tomato-red ml-1">*</span>
              )}
            </label>
          )}
          <div className="relative">
            {Icon && (
              <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-green/40 pointer-events-none" />
            )}
            <select
              ref={ref}
              id={selectId}
              className={cn(
                "w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
                "bg-white text-dark-green appearance-none cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-dark-green/20",
                error
                  ? "border-tomato-red focus:border-tomato-red"
                  : "border-dark-green/20 focus:border-dark-green",
                Icon && "pl-12",
                selectClassName
              )}
              aria-invalid={!!error}
              aria-describedby={error ? `${selectId}-error` : undefined}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-dark-green/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {error && (
            <p id={`${selectId}-error`} className="text-sm text-tomato-red">
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-dark-green/60">{helperText}</p>
          )}
        </div>
      );
    }
  )
);

Select.displayName = "Select";

// ============================================================================
// CHECKBOX
// ============================================================================

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label: string;
  error?: string;
  wrapperClassName?: string;
}

export const Checkbox = memo(
  forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, wrapperClassName, id, ...props }, ref) => {
      const checkboxId = id || props.name;

      return (
        <div className={cn("space-y-1", wrapperClassName)}>
          <label
            htmlFor={checkboxId}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <input
                ref={ref}
                type="checkbox"
                id={checkboxId}
                className="peer sr-only"
                {...props}
              />
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 transition-all duration-200",
                  "peer-checked:bg-dark-green peer-checked:border-dark-green",
                  "peer-focus:ring-2 peer-focus:ring-dark-green/20",
                  error ? "border-tomato-red" : "border-dark-green/30"
                )}
              />
              <svg
                className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-sm text-dark-green group-hover:text-dark-green/80 transition-colors">
              {label}
            </span>
          </label>
          {error && <p className="text-sm text-tomato-red pl-8">{error}</p>}
        </div>
      );
    }
  )
);

Checkbox.displayName = "Checkbox";

// ============================================================================
// TOGGLE SWITCH
// ============================================================================

export interface ToggleSwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className"> {
  label: string;
  description?: string;
  wrapperClassName?: string;
}

export const ToggleSwitch = memo(
  forwardRef<HTMLInputElement, ToggleSwitchProps>(
    ({ label, description, wrapperClassName, id, ...props }, ref) => {
      const toggleId = id || props.name;

      return (
        <label
          htmlFor={toggleId}
          className={cn(
            "flex items-center justify-between cursor-pointer group",
            wrapperClassName
          )}
        >
          <div>
            <span className="text-sm font-medium text-dark-green">{label}</span>
            {description && (
              <p className="text-xs text-dark-green/60">{description}</p>
            )}
          </div>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={toggleId}
              className="peer sr-only"
              {...props}
            />
            <div
              className={cn(
                "w-11 h-6 rounded-full transition-colors duration-200",
                "peer-checked:bg-dark-green bg-dark-green/20",
                "peer-focus:ring-2 peer-focus:ring-dark-green/20"
              )}
            />
            <div
              className={cn(
                "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md",
                "transition-transform duration-200",
                "peer-checked:translate-x-5"
              )}
            />
          </div>
        </label>
      );
    }
  )
);

ToggleSwitch.displayName = "ToggleSwitch";

// ============================================================================
// FORM GROUP
// ============================================================================

export interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const FormGroup = memo(function FormGroup({
  children,
  title,
  description,
  className,
}: FormGroupProps) {
  return (
    <fieldset className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <legend className="text-lg font-bold text-dark-green">
              {title}
            </legend>
          )}
          {description && (
            <p className="text-sm text-dark-green/60 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </fieldset>
  );
});

// ============================================================================
// FORM ROW (for side-by-side inputs)
// ============================================================================

export interface FormRowProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const FormRow = memo(function FormRow({
  children,
  columns = 2,
  className,
}: FormRowProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
});
