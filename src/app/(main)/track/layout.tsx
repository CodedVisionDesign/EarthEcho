import { TrackCategorySwitcher } from "@/components/navigation/TrackCategorySwitcher";

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TrackCategorySwitcher />
      {children}
    </>
  );
}
