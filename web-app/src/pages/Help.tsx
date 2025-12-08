const Help = () => {
  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-700 shadow-sm p-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Help & Support
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Welcome to SLMS — Savings and Loan Management System. Find quick
            tips, common issues, and how to get in touch.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Getting Started */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                <li>Sign in with your username and password.</li>
                <li>Use the sidebar to navigate between sections.</li>
                <li>Update your profile and password under Settings.</li>
              </ul>
            </div>

            {/* Troubleshooting */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Troubleshooting</h2>
              <ul className="list-disc ml-5 space-y-1 text-sm">
                <li>
                  Forgot password? Use the “Forgot Password” link on Sign In.
                </li>
                <li>Session expired? Sign in again to refresh your token.</li>
                <li>
                  Profile image not updating? Try a smaller file under 7MB.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-primary/15 border border-primary/30 p-4">
            <h3 className="text-base font-semibold mb-1">Contact Support</h3>
            <p className="text-sm">
              Email: support@slms.example.com • Phone: +1 (555) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
