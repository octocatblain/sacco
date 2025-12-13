import * as React from "react";

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  // Provide context for trigger/content communication
  const context = React.useMemo(
    () => ({
      open,
      setOpen,
    }),
    [open]
  );

  return (
    <DropdownMenuContext.Provider value={context}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
};

type DropdownMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextType | null>(
  null
);

export const DropdownMenuTrigger = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) => {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    ctx.setOpen(!ctx.open);
  };

  // Close on outside click
  React.useEffect(() => {
    if (!ctx.open) return;
    const handle = () => ctx.setOpen(false);
    window.addEventListener("click", handle);
    return () => window.removeEventListener("click", handle);
  }, [ctx]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    });
  }

  return (
    <span onClick={handleClick} style={{ cursor: "pointer" }}>
      {children}
    </span>
  );
};

export const DropdownMenuContent = ({
  align,
  children,
}: {
  align?: "start" | "end";
  children: React.ReactNode;
}) => {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx || !ctx.open) return null;

  return (
    <div
      className={`absolute ${
        align === "end" ? "right-0" : "left-0"
      } mt-2 w-40 bg-white dark:bg-blue-900 border rounded shadow-lg z-10`}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  const ctx = React.useContext(DropdownMenuContext);

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
    ctx?.setOpen(false);
  };

  return (
    <button
      type="button"
      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-blue-800 flex items-center"
      onClick={handleItemClick}
    >
      {children}
    </button>
  );
};
