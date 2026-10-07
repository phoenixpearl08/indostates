import { redirect } from "next/navigation";

export default function DoctorNotificationsRoute() {
  redirect("/doctor/dashboard?tab=notifications");
}
