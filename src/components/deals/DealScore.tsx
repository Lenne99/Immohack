import { cn, getDealScoreBg, getDealScoreLabel } from "@/lib/utils";

interface DealScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function DealScore({ score, size = "md", showLabel = false }: DealScoreProps) {
  const radius = size === "lg" ? 36 : size === "md" ? 28 : 20;
  const stroke = size === "lg" ? 4 : 3;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const svgSize = (radius + stroke + 2) * 2;

  const color =
    score >= 80 ? "#4ade80" : score >= 70 ? "#fbbf24" : "#f87171";

  const textSize =
    size === "lg" ? "text-2xl" : size === "md" ? "text-base" : "text-xs";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="#1f2937"
            strokeWidth={stroke}
          />
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
        </svg>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center font-bold",
            textSize
          )}
          style={{ color }}
        >
          {score}
        </span>
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", getDealScoreBg(score).split(" ")[2])}>
          {getDealScoreLabel(score)}
        </span>
      )}
    </div>
  );
}

export function DealScoreBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border",
        getDealScoreBg(score)
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      Score {score}
    </span>
  );
}
