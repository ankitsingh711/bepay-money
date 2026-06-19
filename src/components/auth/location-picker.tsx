"use client";

import * as React from "react";
import { Crosshair, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mocked location picker. A real implementation would embed a maps SDK; here we
// simulate panning a map and reverse-geocoding to a small set of sample places.

interface Place {
  name: string;
  address: string;
}

const PLACES: Place[] = [
  { name: "Skytech Mattrot", address: "Sector 76, Noida, Uttar Pradesh, 201301, India" },
  { name: "JM Orchid", address: "Sector 76, Noida, Uttar Pradesh, 201301, India" },
  { name: "Cyber Hub", address: "DLF Phase 2, Gurugram, Haryana, 122002, India" },
  { name: "Connaught Place", address: "Block A, New Delhi, Delhi, 110001, India" },
  { name: "Brigade Road", address: "Ashok Nagar, Bengaluru, Karnataka, 560001, India" },
];

export function LocationPicker({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: (address: string) => void;
}) {
  const [placeIndex, setPlaceIndex] = React.useState(0);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const drag = React.useRef<{
    active: boolean;
    startX: number;
    startY: number;
    dist: number;
  }>({ active: false, startX: 0, startY: 0, dist: 0 });

  const place = PLACES[placeIndex];

  function onPointerDown(e: React.PointerEvent) {
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, dist: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    const dy = e.clientY - drag.current.startY;
    setPan({ x: dx % 60, y: dy % 60 });
    drag.current.dist += Math.abs(e.movementX) + Math.abs(e.movementY);
    if (drag.current.dist > 90) {
      drag.current.dist = 0;
      setPlaceIndex((i) => (i + 1) % PLACES.length);
    }
  }
  function onPointerUp() {
    drag.current.active = false;
    setPan({ x: 0, y: 0 });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl">Enter Address</DialogTitle>
        </DialogHeader>

        {/* faux map */}
        <div
          className="relative h-64 cursor-grab touch-none overflow-hidden rounded-2xl border border-border bg-[#eef1f4] active:cursor-grabbing"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* streets grid (pans slightly while dragging) */}
          <div
            className="absolute -inset-8"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              backgroundColor: "#e7ebf0",
              backgroundImage:
                "linear-gradient(#fff 3px, transparent 3px), linear-gradient(90deg, #fff 3px, transparent 3px), linear-gradient(#d7dde4 1px, transparent 1px), linear-gradient(90deg, #d7dde4 1px, transparent 1px)",
              backgroundSize: "120px 120px, 120px 120px, 40px 40px, 40px 40px",
            }}
          >
            {/* a couple of blocks + a diagonal road */}
            <div className="absolute left-10 top-10 size-24 rounded bg-[#dfe5ec]" />
            <div className="absolute right-16 top-16 h-28 w-36 rounded bg-[#dfe5ec]" />
            <div className="absolute bottom-8 left-1/3 h-20 w-44 rounded bg-[#e3f0e6]" />
            <div className="absolute left-0 top-1/3 h-2 w-[140%] -rotate-12 bg-white" />
          </div>

          {/* center pin */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <MapPin className="size-9 fill-foreground text-foreground drop-shadow" />
          </div>

          {/* hint */}
          <span className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 whitespace-nowrap rounded-lg bg-card px-2.5 py-1 text-xs font-medium shadow">
            Drag Map to move pin
          </span>

          {/* use current location */}
          <button
            type="button"
            onClick={() => setPlaceIndex(0)}
            className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-sm font-medium text-success-fg shadow-md transition-colors hover:bg-muted"
          >
            <Crosshair className="size-4" />
            Use Current Location
          </button>
        </div>

        {/* selected address */}
        <div className="flex items-center gap-3 rounded-2xl bg-muted/50 p-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card shadow-sm">
            <MapPin className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold">{place.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {place.address}
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            onConfirm(`${place.name}, ${place.address}`);
            onOpenChange(false);
          }}
        >
          Confirm Address
        </Button>
      </DialogContent>
    </Dialog>
  );
}
