import { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient = 'from-violet-500 to-purple-600',
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  gradient?: string;
  trend?: { value: string; up: boolean };
}) {
  return (
    <div className="stat-card group relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#ec4899)' }}
      />

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold tracking-widest uppercase text-white/35 mb-3">{label}</p>
          <p
            className="text-2xl font-bold text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            {value}
          </p>
          {sub && <p className="text-xs text-white/30 mt-1.5">{sub}</p>}
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${trend.up ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
