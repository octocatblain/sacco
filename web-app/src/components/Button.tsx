import { FC } from "react";

interface ButtonProps {
  text: string | React.ReactNode;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
}

const Button: FC<ButtonProps> = ({
  text,
  onClick,
  className,
  disabled,
  variant,
  type,
}) => {
  const base =
    "inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
      : "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400 dark:bg-blue-900 dark:text-white dark:border-blue-700 dark:hover:bg-blue-800";
  return (
    <button
      type={type || "button"}
      className={`${base} ${styles} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;
