import { useEffect, useState } from 'react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

// ============ Donut Chart ============
interface DonutChartProps {
  data: ChartData[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 200, thickness = 30, centerLabel, centerValue }: DonutChartProps) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(1), 100);
    return () => clearTimeout(timer);
  }, []);

  let offset = 0;
  const colors = data.map((d, i) => d.color || ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6'][i % 5]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          className="text-neutral-100 dark:text-neutral-800"
        />
        {data.map((d, i) => {
          const dash = (d.value / total) * circumference * animated;
          const gap = circumference - dash;
          const segOffset = (offset / total) * circumference;
          offset += d.value;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[i]}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-segOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s ease-out, stroke-dashoffset 1s ease-out' }}
            />
          );
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-2xl font-bold font-display text-neutral-900 dark:text-white">
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ============ Bar Chart ============
interface BarChartProps {
  data: ChartData[];
  height?: number;
  showLabels?: boolean;
  horizontal?: boolean;
}

export function BarChart({ data, height = 250, showLabels = true, horizontal = false }: BarChartProps) {
  const [animated, setAnimated] = useState(false);
  const max = Math.max(...data.map((d) => d.value), 1);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  if (horizontal) {
    return (
      <div className="flex flex-col gap-3">
        {data.map((d, i) => {
          const colors = d.color || ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#a855f7'][i % 10];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className="w-32 flex-shrink-0 text-sm text-neutral-600 dark:text-neutral-400 truncate">
                {d.label}
              </div>
              <div className="flex-1 h-7 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden relative">
                <div
                  className="h-full rounded-lg transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                  style={{
                    width: animated ? `${(d.value / max) * 100}%` : '0%',
                    backgroundColor: colors,
                  }}
                >
                  <span className="text-xs font-semibold text-white">
                    {(d.value * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-around gap-2" style={{ height }}>
      {data.map((d, i) => {
        const colors = d.color || ['#3b82f6', '#ef4444', '#f59e0b', '#22c55e', '#8b5cf6', '#06b6d4', '#ec4899'][i % 7];
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <div className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              {typeof d.value === 'number' && d.value % 1 !== 0 ? d.value.toFixed(1) : d.value}
            </div>
            <div
              className="w-full max-w-[50px] rounded-t-lg transition-all duration-1000 ease-out"
              style={{
                height: animated ? `${(d.value / max) * (height - 40)}px` : '0%',
                backgroundColor: colors,
                minHeight: animated ? '4px' : '0px',
              }}
            />
            {showLabels && (
              <div className="text-[10px] text-neutral-500 dark:text-neutral-400 text-center truncate w-full">
                {d.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============ Line / Area Chart ============
interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 250, color = '#3b82f6' }: LineChartProps) {
  const [animated, setAnimated] = useState(false);
  const width = 600;
  const padding = 40;
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [data]);

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <svg width={width} height={height} className="min-w-full">
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding + t * (height - padding * 2);
          return (
            <line
              key={t}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="currentColor"
              strokeWidth="1"
              className="text-neutral-100 dark:text-neutral-800"
            />
          );
        })}
        {/* Area */}
        <path
          d={areaPath}
          fill={`url(#gradient-${color.replace('#', '')})`}
          style={{ opacity: animated ? 1 : 0, transition: 'opacity 1s ease-out' }}
        />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 2000,
            strokeDashoffset: animated ? 0 : 2000,
            transition: 'stroke-dashoffset 1.5s ease-out',
          }}
        />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill={color}
              style={{ opacity: animated ? 1 : 0, transition: `opacity 0.3s ease-out ${i * 0.1}s` }}
            />
            <text x={p.x} y={height - 12} textAnchor="middle" className="text-[10px] fill-neutral-500 dark:fill-neutral-400">
              {p.label}
            </text>
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] fill-neutral-700 dark:fill-neutral-300 font-semibold">
              {p.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ============ Stat Card ============
interface StatCardProps {
  label: string;
  value: string | number;
  icon: typeof import('lucide-react').TrendingUp;
  color?: string;
  trend?: string;
}

export function StatCard({ label, value, icon: Icon, color = 'primary', trend }: StatCardProps) {
  const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
    primary: { bg: 'bg-primary-50 dark:bg-primary-900/30', text: 'text-primary-600 dark:text-primary-400', ring: 'ring-primary-500/20' },
    accent: { bg: 'bg-accent-50 dark:bg-accent-900/30', text: 'text-accent-600 dark:text-accent-400', ring: 'ring-accent-500/20' },
    warning: { bg: 'bg-warning-50 dark:bg-warning-900/30', text: 'text-warning-600 dark:text-warning-400', ring: 'ring-warning-500/20' },
    danger: { bg: 'bg-danger-50 dark:bg-danger-900/30', text: 'text-danger-600 dark:text-danger-400', ring: 'ring-danger-500/20' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="glass-card p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.bg} ${c.text} ring-1 ${c.ring}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-lg ${c.bg} ${c.text}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-display text-neutral-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        {label}
      </div>
    </div>
  );
}
