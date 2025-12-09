"use client";

import { MessageClientPage } from "@/components/pages/MessageClientPage";

interface PageProps {
  params: {
    clientId: string;
  };
}

export default function Page({ params }: PageProps) {
  return <MessageClientPage clientId={params.clientId} />;
}
