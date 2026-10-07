import { redirect } from "next/navigation";

export default function DoctorPatientsRoute() {
  redirect("/doctor/dashboard?tab=queue");
}
