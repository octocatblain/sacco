import Breadcrumb from "@/components/Breadcrumb";
import UserSettings from "@/components/settings/tabs/user-settings";

const UserSettingsPage = () => {
  return (
    <div className="px-4">
      <Breadcrumb
        title="User Settings"
        description="Manage your personal account settings"
        homePath="/"
      />
      <div className="w-full md:w-3/4 rounded-xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-700 shadow-sm p-4 mx-auto">
        <UserSettings />
      </div>
    </div>
  );
};

export default UserSettingsPage;
