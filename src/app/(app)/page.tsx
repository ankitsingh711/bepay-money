import { ArrowUpFromLine, Repeat } from "lucide-react";
import { PremiumCard } from "@/components/dashboard/premium-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { AccountInfo } from "@/components/dashboard/account-info";
import { PromoCards } from "@/components/dashboard/promo-cards";
import { TurnoverPanel } from "@/components/dashboard/turnover-panel";
import { MarketTable } from "@/components/dashboard/market-table";
import { TokensCard } from "@/components/dashboard/tokens-card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* left column */}
        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="col-span-2">
              <PremiumCard />
            </div>
            <StatCard
              icon={ArrowUpFromLine}
              title="Payouts"
              subtitle="Current Payouts"
              value="$ 3,877.10"
            />
            <StatCard
              icon={Repeat}
              title="Turnover"
              subtitle="Current Payouts"
              value="$ 3,877.10"
            />
          </div>

          <AccountInfo />
          <PromoCards />
        </div>

        {/* right column */}
        <div className="lg:col-span-5">
          <TurnoverPanel />
        </div>
      </div>

      {/* bottom row */}
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <MarketTable />
        </div>
        <div className="lg:col-span-5">
          <TokensCard />
        </div>
      </div>
    </div>
  );
}
