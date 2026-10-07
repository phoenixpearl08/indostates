import { redirect } from "next/navigation";

export default function DoctorConsultationsRoute() {
  redirect("/doctor/dashboard?tab=consultation-history");
}
