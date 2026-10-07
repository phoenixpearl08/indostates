import { redirect } from "next/navigation";

export default function DoctorSettingsRoute() {
  redirect("/doctor/dashboard?tab=settings");
}
