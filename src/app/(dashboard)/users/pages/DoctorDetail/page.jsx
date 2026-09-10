import DoctorDetailPage from "../../../users/components/DetailDocter/DoctorDetailPage";

export default async function Page({ searchParams }) {
  const params = await searchParams;

  return <DoctorDetailPage doctorId={params.id} />;
}