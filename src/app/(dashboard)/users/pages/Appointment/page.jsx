import AppointmentClient from "../../components/Appointment/AppointmentClient";

export default async function AppointmentPage({ searchParams }) {
  const doctorId = (await searchParams)?.id;

  return <AppointmentClient doctorId={doctorId} />;
}