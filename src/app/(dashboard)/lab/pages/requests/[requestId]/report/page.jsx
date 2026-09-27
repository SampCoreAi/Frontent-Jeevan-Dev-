import LabReportComposer from "../../../../components/LabReportComposer";

export default async function LabReportComposerPage({ params }) {
  const { requestId } = await params;
  return <LabReportComposer requestId={requestId} />;
}
