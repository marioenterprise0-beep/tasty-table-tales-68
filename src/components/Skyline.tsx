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

/** Thin gold line-art arch bridge (Rochester style) for the hero. */
export function BridgeArch({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 300"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      {/* deck */}
      <path d="M10 214h580" strokeWidth="3.5" />
      {/* main arch */}
      <path d="M60 214c50-140 430-140 480 0" />
      {/* secondary arch */}
      <path d="M120 214c40-104 320-104 360 0" strokeWidth="1.6" />
      {/* hangers */}
      <path d="M120 214v-52M180 214v-78M240 214v-92M300 214v-98M360 214v-92M420 214v-78M480 214v-52" strokeWidth="1.2" />
      {/* towers */}
      <path d="M60 250V150M540 250V150" strokeWidth="3" />
      {/* water lines */}
      <path d="M40 246h520M90 268h420" strokeWidth="1.2" opacity="0.6" />
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
    [96, 44, 3], [104, 118, 2], [92, 176, 4], [108, 232, 1.8], [98, 288, 3],
    [110, 340, 2.2], [90, 396, 3.6], [106, 448, 2], [100, 486, 2.6],
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
        d="M0 0h84l-8 26 10 18-12 24 9 20-11 22 12 18-9 24 11 20-13 22 10 20-8 22 11 18-12 24 9 20-11 22 12 20-9 22 10 18-8 20 9 20H0z"
      />
      {dots.map(([cx, cy, r], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={r * 0.6} ry={r} fill="currentColor" />
      ))}
    </svg>
  );
}
