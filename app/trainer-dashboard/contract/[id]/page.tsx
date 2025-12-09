"use client";

import { TrainerContractDetailsPage } from "@/components/pages/TrainerContractDetailsPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <TrainerContractDetailsPage bookingId={params.id} />;
}
