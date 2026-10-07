import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor OPD Console | Indo States Health",
  description: "Secure clinical outpatient consultation, electronic prescriptions, and diagnostic review.",
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="doctor-dashboard-layout w-full min-h-screen bg-slate-50 flex flex-col">
      {children}
    </div>
  );
}
