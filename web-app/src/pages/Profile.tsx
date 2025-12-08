import React, { useRef, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// constants
import { apiBaseUrl } from "@/constants";
// custom hook
import { useUserProfileInfo } from "@/hooks/useUserProfile";
// components
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

// FIXME: Profile component not displaying user profile information. The TOKEN expires very fast add way to refresh token
// TODO: add type to profile state
const Profile = () => {
  const { profile } = useUserProfileInfo();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpdate = () => {
    imageInputRef.current?.click();
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      profile: {
        role_display: "",
        // profile_image: null,
      },
    },
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

  // TODO: image upload not working issue  might be on the server or schema
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const TOKEN = localStorage.getItem("access_token");

    //     const formData = new FormData()
    //     formData.append('username', values.username)
    //     formData.append('email', values.email)
    //    // Ensure profile_image is a valid File object
    //    if (values.profile.profile_image instanceof File) {
    //     formData.append('profile_image', values.profile.profile_image);
    // } else {
    //     console.error('profile_image is not a valid File object:', values.profile.profile_image);
    // }

    // Log FormData entries
    //   for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    // }
    setLoading(true);
    try {
      await axios.patch(`${apiBaseUrl}/api/profile/`, values, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          // "Content-Type": "application/json"
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      console.log("Profile updated successfully");
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
        Update Profile
      </h1>
      <div className="w-full rounded-2xl bg-white dark:bg-blue-950 border border-slate-200 dark:border-blue-700 shadow-sm p-6">
        <Form {...form}>
          <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative flex flex-col items-center">
              <img
                // src={preview ? preview : ProfilePlaceholder }
                src={
                  preview
                    ? preview
                    : profile?.profile.profile_image
                    ? `${apiBaseUrl}${profile?.profile.profile_image}`
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...fieldProps}
                      accept="image/*"
                      type="file"
                      // value={undefined}
                      onChange={handleImageUpload}
                      // onChange={(event) => onChange(event.target.files && event.target.files[0])}
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
      </div>
    </div>
  );
};

export default Profile;
