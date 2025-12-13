import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb";
import { Button } from "@/components/ui/button";

const ROLES = [
  { value: "FI", label: "Finance Officer" },
  { value: "AD", label: "Admin" },
  { value: "MA", label: "Manager" },
  { value: "LO", label: "Loan Officer" },
  { value: "OP", label: "Operation Manager" },
  { value: "AC", label: "Accountant" },
];

const CreateUser = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    profile_image: "",
    role: "AC",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "profile_image" && files && files[0]) {
      setForm((f) => ({ ...f, profile_image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send the form data to your backend
    alert("User created!\n\n" + JSON.stringify(form, null, 2));
    navigate("/users");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Breadcrumb
        title="Create User"
        description="Add a new system user"
        homePath="/users"
      />
      <form
        className="space-y-4 bg-white dark:bg-blue-900 rounded-lg border p-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block text-xs mb-1">Username</label>
          <input
            name="username"
            className="border rounded px-2 py-1 w-full"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="border rounded px-2 py-1 w-full"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Password</label>
          <input
            name="password"
            type="password"
            className="border rounded px-2 py-1 w-full"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Role</label>
          <select
            name="role"
            className="border rounded px-2 py-1 w-full"
            value={form.role}
            onChange={handleChange}
            required
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs mb-1">Profile Image</label>
          <input
            name="profile_image"
            type="file"
            accept="image/*"
            className="border rounded px-2 py-1 w-full"
            onChange={handleChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-16 h-16 rounded-full object-cover"
            />
          )}
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/users")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="default">
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
