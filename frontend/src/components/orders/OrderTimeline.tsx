import { ORDER_STATUSES } from '@/lib/utils';
import { Check } from 'lucide-react';

export function OrderTimeline({ currentStatus }: { currentStatus: string }) {
  const currentIndex = ORDER_STATUSES.indexOf(
    currentStatus as (typeof ORDER_STATUSES)[number]
  );

  return (
    <ol className="relative border-l border-slate-700 ml-3 space-y-8">
      {ORDER_STATUSES.map((status, index) => {
        const done = index <= currentIndex;
        const active = index === currentIndex;
        return (
          <li key={status} className="ml-6">
            <span
              className={`absolute -left-[13px] flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                done
                  ? 'gradient-brand border-transparent text-white'
                  : 'bg-slate-900 border-slate-600'
              }`}
            >
              {done && <Check className="w-3 h-3" />}
            </span>
            <p className={`font-medium ${active ? 'text-fuchsia-400' : done ? 'text-slate-200' : 'text-slate-500'}`}>
              {status}
            </p>
            {active && (
              <p className="text-xs text-slate-500 mt-0.5">Current status</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
