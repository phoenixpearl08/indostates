import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Clinical Console | Indo States Health",
  description: "Secure login and clinical management console for medical staff and hospital administration.",
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="staff-portal-layout w-full min-h-screen bg-slate-900 flex flex-col">
      {children}
    </div>
  );
}
