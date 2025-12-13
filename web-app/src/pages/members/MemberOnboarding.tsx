"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb";

const steps = [
  "Personal Details",
  "Contact Information",
  "KYC Documents",
  "Review & Submit",
];

const MemberOnboarding = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    idType: "",
    idNumber: "",
    kycFile: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, kycFile: e.target.files[0] });
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <Card className="w-full mt-10">
      <Breadcrumb
        title="Member Onboarding"
        homePath="/"
        description="Step-by-step process to onboard a new member"
      />
      <CardHeader>
        <CardTitle>Member Onboarding Progress</CardTitle>
        <div className="flex gap-2 mt-2">
          {steps.map((label, i) => (
            <div
              key={label}
              className={`flex-1 h-2 rounded-full ${
                i <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <div className="mt-2 text-lg font-medium">{steps[step]}</div>
      </CardHeader>
      <CardContent>
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
            <Input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              value={form.dob}
              onChange={handleChange}
            />
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={form.idType}
              onValueChange={(v) => handleSelect("idType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="ID Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="National ID">National ID</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
                <SelectItem value="Driver's License">
                  Driver's License
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="idNumber"
              placeholder="ID Number"
              value={form.idNumber}
              onChange={handleChange}
            />
            <Input name="kycFile" type="file" onChange={handleFile} />
          </div>
        )}
        {step === 3 && (
          <div className="space-y-2">
            <div>
              <b>First Name:</b> {form.firstName}
            </div>
            <div>
              <b>Last Name:</b> {form.lastName}
            </div>
            <div>
              <b>Date of Birth:</b> {form.dob}
            </div>
            <div>
              <b>Email:</b> {form.email}
            </div>
            <div>
              <b>Phone:</b> {form.phone}
            </div>
            <div>
              <b>Address:</b> {form.address}
            </div>
            <div>
              <b>ID Type:</b> {form.idType}
            </div>
            <div>
              <b>ID Number:</b> {form.idNumber}
            </div>
            <div>
              <b>KYC File:</b> {form.kycFile ? form.kycFile.name : "None"}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-8">
          <Button onClick={prev} disabled={step === 0} variant="secondary">
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberOnboarding;
