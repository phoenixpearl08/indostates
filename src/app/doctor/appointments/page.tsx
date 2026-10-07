import { redirect } from "next/navigation";

export default function DoctorAppointmentsRoute() {
  redirect("/doctor/dashboard?tab=appointments");
}
