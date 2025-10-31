import { TrainerProfilePage } from "@/components/pages/TrainerProfilePage";

export default function TrainerProfile({
  params,
}: {
  params: { trainerId: string };
}) {
  return <TrainerProfilePage trainerId={params.trainerId} />;
}
