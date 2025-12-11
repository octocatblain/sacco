import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
// components
import { DataTable } from "@/components/data-table";
import Spinner from "@/components/Spinner";
import Breadcrumb from "@/components/Breadcrumb";
// types
import { UserProps } from "@/types";

import ProfilePlaceholder from "@/assets/profile-placeholder.png";

// table columns
const columns: ColumnDef<UserProps>[] = [
  {
    header: "Image",
    accessorKey: "profile.profile_image",
    cell: ({ row }) => {
      return (
        <img
          src={
            row.original.profile.profile_image
              ? row.original.profile.profile_image.toString()
              : ProfilePlaceholder
          }
          alt={row.original.username}
          className="w-10 h-10 rounded-full"
        />
      );
    },
  },
  {
    header: "User Name",
    accessorKey: "username",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "profile.role_display",
  },
];

// Fake data for users
const FAKE_USERS: UserProps[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    profile: {
      profile_image: "",
      role_display: "Administrator",
    },
  },
  {
    id: 2,
    username: "jane",
    email: "jane@example.com",
    profile: {
      profile_image: "",
      role_display: "User",
    },
  },
];

const Users = () => {
  const [data] = useState<UserProps[]>(FAKE_USERS);
  // No loading or error states with fakedata
  return (
    <>
      <Breadcrumb
        title="Users"
        description="Manage system user accounts"
        homePath="/"
      />
      <DataTable
        title="Users"
        route="/users/edit"
        btnTitle="Create User"
        data={data}
        columns={columns}
        filters="username"
      />
    </>
  );
};

export default Users;
