import { Metadata } from "next";
import { OfflineContent } from "./OfflineContent";

export const metadata: Metadata = {
  title: "Offline — Earth Echo",
};

export default function OfflinePage() {
  return <OfflineContent />;
}
