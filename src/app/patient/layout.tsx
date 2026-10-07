import type { Metadata } from "next";
import { PatientNav } from "@/components/patient/PatientNav";

export const metadata: Metadata = {
  title: "Patient Health Portal | Indo States Health",
  description: "Secure patient health records, appointment passes, e-prescriptions, and lab investigation reports.",
};

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientNav>{children}</PatientNav>;
}
