// Components
import Breadcrumb from "@/components/Breadcrumb";
import SystemSettings from "@/components/settings/tabs/system-settings";

const Settings = () => {
  return (
    <div className="px-4">
      <Breadcrumb
        title="Settings"
        description="Manage your account and preferences"
        homePath="/"
      />

      <div className="w-full md:w-3/4 rounded-xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-700 shadow-sm p-4 mx-auto">
        <SystemSettings />
      </div>
    </div>
  );
};

export default Settings;
