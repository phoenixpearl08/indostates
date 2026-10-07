import { redirect } from "next/navigation";

export default function DoctorScheduleRoute() {
  redirect("/doctor/dashboard?tab=schedule");
}
