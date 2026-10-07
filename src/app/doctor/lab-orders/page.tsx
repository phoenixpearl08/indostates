import { redirect } from "next/navigation";

export default function DoctorLabOrdersRoute() {
  redirect("/doctor/dashboard?tab=lab-orders");
}
