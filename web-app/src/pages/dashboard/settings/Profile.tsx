import React, { useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import LucideIcon from "@/components/LucideIcon";
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
const formSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Username must be at least 2 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  profile: z.object({
    role_display: z.string(),
    profile_image: z.instanceof(File).refine((file) => file.size < 7000000, {
      message: "Your resume must be less than 7MB.",
    }),
  }),
});

// Fake profile data for demonstration
const fakeProfile = {
  username: "johndoe",
  email: "johndoe@example.com",
  profile: {
    role_display: "Member",
    profile_image: "",
  },
};

const Profile = () => {
  const [profile, setProfile] = useState(fakeProfile);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpdate = () => {
    imageInputRef.current?.click();
  };

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: fakeProfile,
    values: profile,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      // form.setValue('profile.profile_image', file)
    }
  };

  // Simulate profile update
  const onSubmit = async (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setProfile(values);
      setLoading(false);
      alert("Profile updated (fake)");
    }, 1000);
  };

  return (
    <div className="max-w-full mx-auto mt-6 px-4">
      <Breadcrumb
        title="Profile"
        description="Your account information and preferences"
        homePath="/"
      />
      <Tabs
        defaultValue="profile-info"
        className="w-full mt-4 flex flex-col md:flex-row gap-6"
      >
        <TabsList className="w-full md:w-1/4 h-full flex flex-col !justify-start !items-start p-3 bg-white dark:bg-blue-950 rounded-xl border border-slate-200 dark:border-blue-700">
          <TabsTrigger
            value="profile-info"
            className="mb-2 w-full justify-start"
          >
            Profile Info
          </TabsTrigger>
          <TabsTrigger
            value="change-password"
            className="mb-2 w-full justify-start"
          >
            Change Password
          </TabsTrigger>
        </TabsList>
        <div className="w-full md:w-3/4 rounded-xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-700 shadow-sm p-4">
          <TabsContent value="profile-info">
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <div className="relative flex flex-col items-center">
                  <img
                    src={
                      preview
                        ? preview
                        : profile?.profile.profile_image
                        ? profile?.profile.profile_image
                        : ProfilePlaceholder
                    }
                    alt="profile image"
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border border-slate-200 dark:border-blue-700"
                  />
                  <LucideIcon
                    name="Camera"
                    className="absolute bottom-2 right-10 cursor-pointer bg-white dark:bg-blue-900 rounded-full p-2 shadow ring-1 ring-black/5"
                    onClick={handleImageUpdate}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="profile.profile_image"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...fieldProps}
                          accept="image/*"
                          type="file"
                          onChange={handleImageUpload}
                          ref={imageInputRef}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="!focus-visible:ring-0 !focus-visible:ring-offset-0"
                        />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="!focus-visible:ring-0 !focus-visible:ring-offset-0"
                        />
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
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          disabled
                          className="!focus-visible:ring-0 !focus-visible:ring-offset-0 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  text={loading ? <Spinner /> : "Update Profile"}
                  className="w-full"
                  variant="primary"
                />
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="change-password">
            <ChangePassword />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Profile;
