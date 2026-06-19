"use client";

import {
  AtSign,
  Camera,
  ExternalLink,
  Globe,
  LifeBuoy,
  MessageCircle,
  PlayCircle,
  Send,
  type LucideIcon,
} from "lucide-react";

interface Channel {
  name: string;
  handle: string;
  icon: LucideIcon;
  tint: string;
}

const CHANNELS: Channel[] = [
  { name: "Website", handle: "bepay.app", icon: Globe, tint: "bg-neutral-bg text-neutral-fg" },
  { name: "X (Twitter)", handle: "@bepay", icon: AtSign, tint: "bg-neutral-bg text-foreground" },
  { name: "Telegram", handle: "t.me/bepay", icon: Send, tint: "bg-[#e6f3fb] text-[#229ED9]" },
  { name: "Discord", handle: "discord.gg/bepay", icon: MessageCircle, tint: "bg-[#ecedfb] text-[#5865F2]" },
  { name: "Instagram", handle: "@bepay.app", icon: Camera, tint: "bg-[#fdeaf3] text-[#E1306C]" },
  { name: "YouTube", handle: "@bepay", icon: PlayCircle, tint: "bg-danger-bg text-danger-fg" },
  { name: "Support", handle: "support@bepay.app", icon: LifeBuoy, tint: "bg-success-bg text-success-fg" },
];

export default function BepayChannelsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h3 className="text-2xl font-bold tracking-tight">
        Bepay Official Channels
      </h3>
      <p className="mt-1 text-muted-foreground">
        Stay updated and reach us only through these verified channels.
      </p>

      <ul className="mt-6 space-y-3">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          return (
            <li key={c.name}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${c.tint}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.handle}</p>
                  </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
