import React, { useRef, useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { Camera, User, Lock, Mail, Shield, Save, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Breadcrumb from "@/components/Breadcrumb";
import ChangePassword from "@/components/settings/tabs/change-password";
import ProfilePlaceholder from "@/assets/profile-placeholder.png";
import { useUserProfileInfo } from "@/hooks/useUserProfile";
import { apiBaseUrl } from "@/constants";

const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  profile: z.object({
    role_display: z.string().optional(),
    profile_image: z.any().optional(),
  }),
});

const Profile = () => {
  const { profile: userProfile } = useUserProfileInfo();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
         username: "",
         email: "",
         profile: { role_display: "", profile_image: "" }
    },
  });

  useEffect(() => {
    if (userProfile) {
        form.reset({
            username: userProfile.username || "",
            email: userProfile.email || "",
            profile: {
                role_display: userProfile.profile?.role_display || "",
                profile_image: userProfile.profile?.profile_image || "",
            }
        });
    }
  }, [userProfile, form]);

  const handleImageUpdate = () => {
    imageInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (file.size > 7000000) {
          toast.error("Image size must be less than 7MB");
          return;
      }
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      form.setValue('profile.profile_image', file, { shouldDirty: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    // Simulation for now
    setTimeout(() => {
      setLoading(false);
      toast.success("Profile updated successfully");
      console.log(values);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl animate-fade-in">
      <Breadcrumb
        title="Settings"
        description="Manage your account settings and preferences."
        homePath="/dashboard"
      />
      
      <div className="mt-8">
          <Tabs defaultValue="profile-info" className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-64 flex-shrink-0">
                <TabsList className="flex flex-col h-auto w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 shadow-sm">
                    <TabsTrigger 
                        value="profile-info"
                        className="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                    >
                        <User className="w-4 h-4 mr-3" />
                        Profile Information
                    </TabsTrigger>
                     <TabsTrigger 
                        value="change-password"
                        className="w-full justify-start px-3 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400 transition-all duration-200"
                    >
                        <Lock className="w-4 h-4 mr-3" />
                        Security
                    </TabsTrigger>
                </TabsList>
            </aside>

            <div className="flex-1">
                 <TabsContent value="profile-info" className="mt-0">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Details</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Update your photo and personal details here.</p>
                        </div>
                        
                        <div className="p-6">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    
                                    {/* Profile Image Section */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full p-1 ring-2 ring-slate-100 dark:ring-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800">
                                                 <img
                                                    src={
                                                        preview
                                                          ? preview
                                                          : userProfile?.profile?.profile_image
                                                          ? `${apiBaseUrl}${userProfile?.profile?.profile_image}`
                                                          : ProfilePlaceholder
                                                      }
                                                    alt="Profile"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            </div>
                                            <div 
                                                onClick={handleImageUpdate}
                                                className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Camera className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="font-medium text-slate-900 dark:text-white">Profile Photo</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">
                                                This will be displayed on your profile.
                                            </p>
                                             <div className="hidden">
                                                 <FormField
                                                  control={form.control}
                                                  name="profile.profile_image"
                                                  render={({ field: { value, onChange, ...fieldProps } }) => (
                                                    <FormItem>
                                                      <FormControl>
                                                        <Input
                                                          {...fieldProps}
                                                          accept="image/*"
                                                          type="file"
                                                          onChange={handleImageUpload}
                                                          ref={imageInputRef}
                                                        />
                                                      </FormControl>
                                                    </FormItem>
                                                  )}
                                                />
                                             </div>
                                            <button 
                                                type="button"
                                                onClick={handleImageUpdate}
                                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline"
                                            >
                                                Change photo
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid gap-6 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 dark:text-slate-300">Username</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                             <Input {...field} className="pl-10" placeholder="johndoe" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 dark:text-slate-300">Email Address</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                             <Input {...field} className="pl-10" placeholder="john@example.com" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                         <FormField
                                            control={form.control}
                                            name="profile.role_display"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-slate-700 dark:text-slate-300">Role</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                             <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                             <Input {...field} disabled className="pl-10 bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            type="submit"
                                            disabled={loading || !form.formState.isDirty}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all
                                              ${loading || !form.formState.isDirty
                                                 ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed" 
                                                 : "bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                                              }`}
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </div>

                                </form>
                            </Form>
                        </div>
                    </div>
                 </TabsContent>

                 <TabsContent value="change-password" className="mt-0">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                         <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your password and security preferences.</p>
                        </div>
                        <div className="p-6">
                             <ChangePassword />
                        </div>
                    </div>
                 </TabsContent>
            </div>
          </Tabs>
      </div>
    </div>
  );
};

export default Profile;
