import React, { ChangeEvent } from "react";
// components
import LucideIcon from "./LucideIcon";

type Props = {
  name?: string;
  type: string;
  icon?: string;
  placeholder?: string;
  value?: string | number;
  label?: string;
  disabled?: boolean;
  className?: string;
  accept?: string;
  ref?: React.RefObject<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onIconClick?: () => void;
};

const FormInput: React.FC<Props> = ({
  name,
  type,
  icon,
  placeholder,
  value,
  className,
  label,
  accept,
  disabled,
  onChange,
  onIconClick,
  ref,
}) => {
  return (
    <div className={`relative w-full ${disabled ? "opacity-70" : ""}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full border border-gray-300 rounded-md px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-blue-900 dark:text-white dark:border-slate-500 ${
            className ?? ""
          }`}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          accept={accept}
          onChange={onChange}
          autoComplete={name}
          id={name}
          disabled={disabled}
          ref={ref}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-600 dark:text-slate-300"
            aria-label="toggle input icon"
          >
            <LucideIcon name={icon} size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
