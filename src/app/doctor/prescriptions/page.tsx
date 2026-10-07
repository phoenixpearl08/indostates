import { redirect } from "next/navigation";

export default function DoctorPrescriptionsRoute() {
  redirect("/doctor/dashboard?tab=prescriptions");
}
