import { FC, useEffect, useMemo, useState } from "react";
import KycDataView from "@/components/kyc/KycDataView";
import type { KycApplication } from "@/types";
import Breadcrumb from "@/components/Breadcrumb";

const loadApps = (): KycApplication[] => {
  const arrRaw = localStorage.getItem("kyc_apps");
  const oneRaw = localStorage.getItem("kyc_app");
  let apps: KycApplication[] = [];
  try {
    apps = arrRaw ? JSON.parse(arrRaw) : [];
  } catch {
    apps = [];
  }
  if (oneRaw) {
    try {
      const single: KycApplication = JSON.parse(oneRaw);
      if (!apps.find((a) => a.id === single.id)) {
        apps.unshift(single);
      }
    } catch {}
  }
  return apps;
};

const Applications: FC = () => {
  const [apps, setApps] = useState<KycApplication[]>(() => loadApps());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "kyc_apps" || e.key === "kyc_app") {
        setApps(loadApps());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const subtitle = useMemo(
    () =>
      apps.length ? `${apps.length} application(s)` : "No applications yet",
    [apps]
  );

  return (
    <div className="space-y-4">
      <Breadcrumb
        title="KYC Applications"
        description="View all KYC applications"
        homePath="/kyc/applications"
      />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">KYC Applications</h1>
        <div className="text-xs text-slate-500">{subtitle}</div>
      </div>
      <KycDataView apps={apps} />
    </div>
  );
};

export default Applications;
