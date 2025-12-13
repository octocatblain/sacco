import * as React from "react";

export const Dialog = ({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) =>
  open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-blue-900 rounded-lg shadow-lg p-4 min-w-[320px] relative">
        <button
          type="button"
          aria-label="Close"
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
          onClick={() => onOpenChange(false)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 6L14 14M14 6L6 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  ) : null;

export const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

export const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2">{children}</div>
);

export const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);

export const DialogDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => <p className="text-sm text-gray-500">{children}</p>;

export const DialogFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="mt-4 flex justify-end gap-2">{children}</div>
);

export const DialogClose = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) => {
  // Just render children, actual close logic handled by parent
  return <span>{children}</span>;
};
