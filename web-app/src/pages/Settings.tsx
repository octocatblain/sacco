// Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "./Profile";
import ChangePassword from "@/components/settings/tabs/change-password";
import LucideIcon from "@/components/LucideIcon";

const Settings = () => {
  return (
    <div className="px-4">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
        Settings
      </h1>

      <Tabs
        defaultValue="update-profile"
        className="flex flex-col md:flex-row gap-6"
      >
        <TabsList className="w-full md:w-1/4 h-full flex flex-col !justify-start !items-start p-3 bg-white dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-700">
          <TabsTrigger
            value="update-profile"
            className="mb-2 w-full justify-start"
          >
            <LucideIcon name="UserCog" className="mr-2" size={20} /> Update
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="change-password"
            className="mb-2 w-full justify-start"
          >
            <LucideIcon name="Lock" size={18} className="mr-2" /> Change
            Password
          </TabsTrigger>
        </TabsList>
        <div className="w-full md:w-3/4 rounded-xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-700 shadow-sm p-4">
          <TabsContent value="update-profile">
            <Profile />
          </TabsContent>
          <TabsContent value="change-password">
            <ChangePassword />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;
