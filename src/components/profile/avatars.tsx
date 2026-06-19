import { cn } from "@/lib/utils";

// Eight black-and-white illustrated profile avatars, drawn parametrically so we
// don't depend on external image assets. (Drop real artwork into
// /public/avatars and swap <ProfileAvatar> for <img> to match 1:1.)

interface AvatarConfig {
  hair: "crop" | "side" | "bob" | "bun" | "curly" | "fluffy";
  dark: boolean; // filled clothing
  beard?: boolean;
  earring?: boolean;
}

const CONFIGS: AvatarConfig[] = [
  { hair: "crop", dark: true },
  { hair: "bob", dark: false, earring: true },
  { hair: "bun", dark: true },
  { hair: "fluffy", dark: false },
  { hair: "side", dark: true },
  { hair: "bun", dark: true, earring: true },
  { hair: "curly", dark: false },
  { hair: "crop", dark: false, beard: true },
];

export const AVATAR_COUNT = CONFIGS.length;

const STROKE = "#0b0e14";

function Hair({ type }: { type: AvatarConfig["hair"] }) {
  switch (type) {
    case "crop":
      return (
        <path
          d="M36 46c0-16 10-26 24-26s24 10 24 26c0-6-6-10-10-11-3 4-9 6-14 6s-11-2-14-6c-4 1-10 5-10 11Z"
          fill={STROKE}
        />
      );
    case "side":
      return (
        <path
          d="M36 48c0-17 11-28 24-28s24 9 24 26c-4-6-9-8-9-8s-2 5-7 6c2-4 1-8 1-8-6 6-16 7-22 6-3 1-9 5-11 8Z"
          fill={STROKE}
        />
      );
    case "bob":
      return (
        <path
          d="M34 70c-3-10-2-22 4-32 5-9 13-12 22-12s17 3 22 12c6 10 7 22 4 32l-7-2c3-8 2-18-2-25-2 5-5 8-5 8H44s-3-3-5-8c-4 7-5 17-2 25l-3 2Z"
          fill={STROKE}
        />
      );
    case "bun":
      return (
        <>
          <circle cx="60" cy="16" r="7" fill={STROKE} />
          <path
            d="M36 46c0-16 10-26 24-26s24 10 24 26c0-6-6-10-10-11-3 4-9 6-14 6s-11-2-14-6c-4 1-10 5-10 11Z"
            fill={STROKE}
          />
        </>
      );
    case "curly":
      return (
        <path
          d="M34 44c-2-7 2-13 7-14-1-6 4-11 10-11 3-4 9-5 14-2 7-2 14 3 14 10 5 1 8 7 6 13-3-5-7-7-7-7-2 3-6 4-6 4 1-3 0-6 0-6-7 5-17 5-24 2-3 1-9 5-11 11l-3-3Z"
          fill={STROKE}
        />
      );
    case "fluffy":
      return (
        <path
          d="M34 50c-3-8 0-16 6-20-1-7 5-12 12-11 4-5 12-5 16 0 7-1 12 5 11 12 5 4 7 11 4 18-3-6-7-8-7-8-3 4-8 5-8 5 1-3 0-6 0-6-8 4-18 4-25 0-3 2-7 5-9 10Z"
          fill="none"
          stroke={STROKE}
          strokeWidth={2.4}
        />
      );
  }
}

export function ProfileAvatar({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const c = CONFIGS[index % CONFIGS.length];
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("size-full", className)}
      role="img"
      aria-label={`Avatar ${index + 1}`}
    >
      {/* clothing / shoulders */}
      <path
        d="M30 120c0-16 13-26 30-26s30 10 30 26Z"
        fill={c.dark ? STROKE : "#ffffff"}
        stroke={STROKE}
        strokeWidth={2.4}
      />
      {/* neck */}
      <path d="M52 86h16v10h-16z" fill="#ffffff" stroke={STROKE} strokeWidth={2.4} />
      {/* head */}
      <circle cx="60" cy="52" r="24" fill="#ffffff" stroke={STROKE} strokeWidth={2.4} />
      {/* face */}
      <path d="M51 50c1.5 0 2.5 1 2.5 2.5M66.5 50c1.5 0 2.5 1 2.5 2.5" stroke={STROKE} strokeWidth={2.4} strokeLinecap="round" fill="none" />
      <circle cx="52.5" cy="51" r="1.4" fill={STROKE} />
      <circle cx="67.5" cy="51" r="1.4" fill={STROKE} />
      <path d="M60 54v4" stroke={STROKE} strokeWidth={2} strokeLinecap="round" />
      <path d="M55 62c2 2.5 8 2.5 10 0" stroke={STROKE} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      {/* blush */}
      <circle cx="49" cy="58" r="2.2" fill={STROKE} opacity={0.18} />
      <circle cx="71" cy="58" r="2.2" fill={STROKE} opacity={0.18} />
      {c.beard && (
        <path
          d="M40 52c0 16 9 26 20 26s20-10 20-26c-3 6-10 10-20 10s-17-4-20-10Z"
          fill={STROKE}
        />
      )}
      {c.earring && <circle cx="37" cy="62" r="2.6" fill={STROKE} />}
      <Hair type={c.hair} />
    </svg>
  );
}
