import { ContactPage } from "@/components/pages/ContactPage";

export default function Contact({ params }: { params: { trainerId: string } }) {
  return <ContactPage trainerId={params.trainerId} />;
}
