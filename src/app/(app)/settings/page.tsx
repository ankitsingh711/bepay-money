import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/states";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <Card>
        <EmptyState
          icon={<Settings className="size-6" />}
          title="Settings"
          description="Merchant settings, API keys and team management would live here. Out of scope for this assignment."
        />
      </Card>
    </div>
  );
}
