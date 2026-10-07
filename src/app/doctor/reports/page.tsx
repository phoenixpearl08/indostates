import { redirect } from "next/navigation";

export default function DoctorReportsRoute() {
  redirect("/doctor/dashboard?tab=reports");
}
