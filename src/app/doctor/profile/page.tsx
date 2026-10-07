import { redirect } from "next/navigation";

export default function DoctorProfileRoute() {
  redirect("/doctor/dashboard?tab=profile");
}
