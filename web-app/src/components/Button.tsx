import { FC, ReactNode } from "react";

interface ButtonProps {
  text: string | ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

const Button: FC<ButtonProps> = ({
  text,
  onClick,
  className,
  disabled,
  variant = "primary",
  type,
  size = "md",
  fullWidth = false,
  loading = false,
  leadingIcon,
  trailingIcon,
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none" +
    (fullWidth ? " w-full" : "");

  const sizeClasses =
    size === "sm"
      ? "text-sm px-3 py-1.5 gap-1.5"
      : size === "lg"
      ? "text-base px-5 py-3 gap-2.5"
      : "text-sm px-4 py-2 gap-2"; // md

  const styles =
    variant === "primary"
      ? [
          // Subtle gradient primary background with better hover/active
          "text-white",
          "bg-gradient-to-b from-blue-600 to-blue-700",
          "hover:from-blue-600 hover:to-blue-800",
          "active:from-blue-700 active:to-blue-900",
          // Borders/shadows for depth
          "border border-blue-700/30 shadow-sm shadow-blue-700/20",
          // Focus ring and dark mode tuning
          "focus-visible:ring-blue-500",
          "dark:from-blue-500 dark:to-blue-600",
          "dark:hover:from-blue-500 dark:hover:to-blue-700",
          "dark:active:from-blue-600 dark:active:to-blue-800",
          "dark:border-blue-800/40 dark:shadow-blue-900/20",
        ].join(" ")
      : [
          // Subtle gradient neutral background
          "text-slate-800",
          "bg-gradient-to-b from-white to-slate-50",
          "hover:from-white hover:to-slate-100",
          "active:from-slate-100 active:to-slate-200",
          // Border/shadow and focus ring
          "border border-slate-300 shadow-sm focus-visible:ring-slate-400",
          // Dark mode gradient neutral
          "dark:text-white",
          "dark:from-blue-900 dark:to-blue-800",
          "dark:hover:to-blue-700",
          "dark:active:to-blue-900",
          "dark:border-blue-700",
        ].join(" ");

  const contentColor =
    variant === "primary" ? "text-white" : "text-slate-700 dark:text-slate-100";

  const spinner = (
    <svg
      className={`animate-spin h-4 w-4 ${contentColor}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
  return (
    <button
      type={type || "button"}
      className={`${base} ${sizeClasses} ${styles} ${className || ""}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {leadingIcon && !loading ? (
        <span className={`${contentColor}`}>{leadingIcon}</span>
      ) : null}
      {loading ? (
        <span className="inline-flex items-center gap-2">
          {spinner}
          <span>Processing…</span>
        </span>
      ) : (
        <span>{text}</span>
      )}
      {trailingIcon && !loading ? (
        <span className={`${contentColor}`}>{trailingIcon}</span>
      ) : null}
    </button>
  );
};

export default Button;
