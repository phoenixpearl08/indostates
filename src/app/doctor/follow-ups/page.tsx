import { redirect } from "next/navigation";

export default function DoctorFollowUpsRoute() {
  redirect("/doctor/dashboard?tab=follow-ups");
}
