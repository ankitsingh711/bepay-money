const PROMOS = [
  { img: "/dashboard/promo-1.jpg", position: "75% center" },
  { img: "/dashboard/promo-2.jpg", position: "center" },
  { img: "/dashboard/promo-3.jpg", position: "78% center" },
];

export function PromoCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {PROMOS.map((p, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[1.5/1] overflow-hidden rounded-2xl bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.img}
              alt="Loyalty program coming soon"
              loading="lazy"
              className="size-full object-cover"
              style={{ objectPosition: p.position }}
            />
          </div>
          <p className="text-sm font-semibold leading-snug">
            Loyalty program coming soon for the merchants
          </p>
          <p className="text-xs text-muted-foreground">
            Soon launching the loyalty program
          </p>
        </div>
      ))}
    </div>
  );
}
