export function Skyline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 120V78h18V60h10v18h14V48h12v30h16V64h10v14h18V38h12v40h14V58h10v20h16V44h14v34h12V66h10v12h20V52h12v26h14V70h10v8h18V34h12v44h16V60h10v18h14V50h12v28h18V68h10v10h16V40h12v38h14V62h10v16h18V54h12v24h14V72h10v6h18V44h12v34h16V66h10v12h14V56h12v22h18V70h10v8h16V46h12v32h14V64h10v14h18V58h12v20h14V74h10v4h18V50h12v28h16V68h10v10h14V60h12v18h18V72h10v6h16V52h12v26h14V70h10v8h18V62h12v16h14V74h10v4h18V56h12v22h16V70h10v8h14V64h12v14h18V76h10v2h16V58h12v20h14V72h10v6h18V66h12v12h14V74h10v4h18V60h12v18h16V72h10v6h14V68h12v10h18V76h10v2h16V62h12v16h14V74h10v4h8v42z"
      />
      {/* bridge silhouette */}
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        d="M300 78c60-46 140-46 200 0M320 78V46M480 78V46M300 60h200"
      />
    </svg>
  );
}

export function BridgeWatermark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
    >
      <path d="M40 320c110-190 410-190 520 0" />
      <path d="M40 320V150M560 320V150M140 320V196M240 320V152M360 320V152M460 320V196" />
      <path d="M20 322h560" strokeWidth="8" />
      <path d="M140 150v-40M460 150v-40" />
      <path d="M40 250h520M40 285h520" strokeWidth="2" />
    </svg>
  );
}

/**
 * Ragged, paint-spatter style vertical edge used where the black hero panel
 * meets the gold panel. Rendered in `currentColor` (set it to the ink color).
 */
export function SpatterEdge({ className = "" }: { className?: string }) {
  const dots: Array<[number, number, number]> = [
    [72, 40, 5], [86, 96, 3], [60, 150, 7], [92, 190, 2.5], [70, 236, 4],
    [96, 280, 3.5], [58, 322, 6], [88, 366, 2.5], [74, 410, 4.5], [64, 452, 3],
    [100, 120, 2], [104, 300, 2], [82, 470, 2.5], [110, 220, 1.8], [50, 60, 3],
  ];
  return (
    <svg
      viewBox="0 0 120 500"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <path
        fill="currentColor"
        d="M0 0h58l-6 18 12 14-9 22 14 10-4 26 10 12-12 20 8 16-14 18 12 14-6 22 10 16-13 18 9 16-11 20 12 14-7 22 10 16-12 18 8 16-10 20 11 14-6 18 8 14-10 16H0z"
      />
      {dots.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" />
      ))}
    </svg>
  );
}
