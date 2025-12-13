"use client";

import { FC, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import type { KycApplication, KycDocument, KycDocumentType } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

const emptyApp = (): KycApplication => ({
  id: `KYC-${Date.now()}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "draft",
  personal: {
    firstName: "",
    lastName: "",
    dob: "",
    nationalIdType: "ID",
    nationalIdNumber: "",
    phone: "",
    email: "",
  },
  address: { line1: "", city: "", country: "" },
  documents: [],
});

const Onboarding: FC = () => {
  const [app, setApp] = useState<KycApplication>(() => {
    const raw = localStorage.getItem("kyc_app");
    return raw ? JSON.parse(raw) : emptyApp();
  });
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState<KycDocumentType>("id_front");

  const saveApp = (next: KycApplication) => {
    const updated = { ...next, updatedAt: new Date().toISOString() };
    setApp(updated);
    localStorage.setItem("kyc_app", JSON.stringify(updated));
    try {
      const raw = localStorage.getItem("kyc_apps");
      const list: KycApplication[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((a) => a.id === updated.id);
      if (idx >= 0) list[idx] = updated;
      else list.unshift(updated);
      localStorage.setItem("kyc_apps", JSON.stringify(list));
    } catch {
      // ignore
    }
  };

  // const setField = (path: (a: KycApplication) => any, value: any) => {
  //   const next = structuredClone(app);
  //   // naive path setter
  //   const ref: any = next;
  //   if (typeof path === "function") {
  //     // handled below by specific setters instead of dynamic eval
  //   }
  //   return next;
  // };

  const canSubmit = useMemo(() => {
    const p = app.personal;
    const a = app.address;
    const docsOk =
      app.documents.some((d) => d.type === "id_front") &&
      app.documents.some((d) => d.type === "selfie");
    return (
      p.firstName.trim().length > 1 &&
      p.lastName.trim().length > 1 &&
      p.nationalIdNumber.trim().length >= 5 &&
      p.phone.trim().length >= 8 &&
      p.email.includes("@") &&
      a.line1.trim().length > 2 &&
      a.city.trim().length > 1 &&
      a.country.trim().length > 1 &&
      docsOk
    );
  }, [app]);

  const addDocument = async (file: File) => {
    setUploading(true);
    try {
      const url = URL.createObjectURL(file);
      const doc: KycDocument = {
        id: `DOC-${Date.now()}`,
        type: docType,
        name: file.name,
        mimeType: file.type,
        size: file.size,
        url,
      };
      const next = { ...app, documents: [doc, ...app.documents] };
      saveApp(next);
    } finally {
      setUploading(false);
    }
  };

  const submit = () => {
    if (!canSubmit) return;
    const next: KycApplication = { ...app, status: "submitted" };
    saveApp(next);
  };

  const docsColumns = [
    { header: "Type", accessorKey: "type" },
    { header: "Name", accessorKey: "name" },
    { header: "Size", accessorKey: "size" },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumb
        title="KYC Onboarding"
        description="Complete your KYC application"
        homePath="/kyc/onboarding"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">KYC Onboarding</h1>
        <div className="text-xs">
          Status: <span className="font-medium">{app.status}</span>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Documents uploaded</div>
          <div className="text-lg font-semibold">{app.documents.length}</div>
        </div>
        <div className="rounded-lg border bg-white dark:bg-blue-900 p-3">
          <div className="text-xs text-slate-500">Required docs present</div>
          <div className="text-lg font-semibold">
            {app.documents.some((d) => d.type === "id_front") &&
            app.documents.some((d) => d.type === "selfie")
              ? "Yes"
              : "No"}
          </div>
        </div>
      </div>

      {/* Personal info */}
      <section className="rounded-lg border bg-white dark:bg-blue-900 p-4 space-y-3">
        <h2 className="font-semibold">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">First Name</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.firstName}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: { ...app.personal, firstName: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.lastName}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: { ...app.personal, lastName: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Date of Birth</label>
            <input
              type="date"
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.dob}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: { ...app.personal, dob: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">ID Type</label>
            <select
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.nationalIdType}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: { ...app.personal, nationalIdType: e.target.value },
                })
              }
            >
              <option value="ID">National ID</option>
              <option value="Passport">Passport</option>
            </select>
          </div>
          <div>
            <label className="text-sm">ID Number</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.nationalIdNumber}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: {
                    ...app.personal,
                    nationalIdNumber: e.target.value,
                  },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.phone}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: { ...app.personal, phone: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.personal.email}
              onChange={(e) =>
                saveApp({
                  ...app,
                  personal: { ...app.personal, email: e.target.value },
                })
              }
            />
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="rounded-lg border bg-white dark:bg-blue-900 p-4 space-y-3">
        <h2 className="font-semibold">Address</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Line 1</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.address.line1}
              onChange={(e) =>
                saveApp({
                  ...app,
                  address: { ...app.address, line1: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Line 2</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.address.line2 || ""}
              onChange={(e) =>
                saveApp({
                  ...app,
                  address: { ...app.address, line2: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">City</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.address.city}
              onChange={(e) =>
                saveApp({
                  ...app,
                  address: { ...app.address, city: e.target.value },
                })
              }
            />
          </div>
          <div>
            <label className="text-sm">Country</label>
            <input
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={app.address.country}
              onChange={(e) =>
                saveApp({
                  ...app,
                  address: { ...app.address, country: e.target.value },
                })
              }
            />
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="rounded-lg border bg-white dark:bg-blue-900 p-4 space-y-3">
        <h2 className="font-semibold">Documents</h2>
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <label className="text-sm">Document Type</label>
            <select
              className="mt-1 w-full border rounded px-2 py-1 dark:bg-blue-950"
              value={docType}
              onChange={(e) => setDocType(e.target.value as KycDocumentType)}
            >
              <option value="id_front">ID Front</option>
              <option value="id_back">ID Back</option>
              <option value="selfie">Selfie</option>
              <option value="proof_of_address">Proof of Address</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Upload</label>
            <input
              className="mt-1 block"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) addDocument(f);
                e.currentTarget.value = "";
              }}
            />
          </div>
          <Button disabled={uploading} variant="secondary" onClick={() => {}}>
            {uploading ? "Uploading..." : "Add"}
          </Button>
        </div>
        <DataTable
          columns={docsColumns as any}
          data={app.documents}
          title="Uploaded Documents"
          filters="type"
          reportHeading="KYC Documents"
        />
      </section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => saveApp(emptyApp())}>
          Reset
        </Button>
        <Button
          disabled={!canSubmit || app.status !== "draft"}
          onClick={submit}
        >
          Submit for Review
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
