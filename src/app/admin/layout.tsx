import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospital Admin Portal | Indo States Health",
  description: "Enterprise healthcare management system, department administration, and governance console.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-dashboard-layout w-full min-h-screen bg-slate-900 flex flex-col">
      {children}
    </div>
  );
}
