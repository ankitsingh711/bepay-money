import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col md:flex-row">
      <SettingsNav />
      <div className="flex-1 bg-card px-5 py-7 sm:px-8 lg:px-10">{children}</div>
    </div>
  );
}
