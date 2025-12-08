const Spinner = () => {
  return (
    <div
      className="flex items-center gap-2"
      aria-live="polite"
      aria-busy="true"
    >
      <span
        aria-hidden="true"
        className="inline-block w-5 h-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin"
      />
      <span className="text-sm font-medium tracking-wide text-slate-700 dark:text-slate-200">
        SLMS Loading...
      </span>
    </div>
  );
};

export default Spinner;
