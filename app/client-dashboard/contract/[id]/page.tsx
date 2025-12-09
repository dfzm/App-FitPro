"use client";

import { ContractDetailsPage } from "@/components/pages/ContractDetailsPage";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ContractDetailsPage bookingId={params.id} />;
}
