import { Check } from 'lucide-react';

const STEPS = [
  {
    id: 1,
    label: 'Booking received',
    state: 'done',
    time: '10:14 AM',
    sub: null,
  },
  {
    id: 2,
    label: 'Tanker dispatched',
    state: 'active',
    time: null,
    sub: '● T-02 · Suresh Babu · Now en route',
    subColor: 'text-green-400',
  },
  {
    id: 3,
    label: 'In transit',
    state: 'pending',
    time: null,
    sub: 'Waiting',
    subColor: 'text-slate-500',
  },
  {
    id: 4,
    label: 'Delivered',
    state: 'pending',
    time: null,
    sub: 'Pending OTP',
    subColor: 'text-slate-500',
  },
];

function StepCircle({ step }) {
  if (step.state === 'done' || step.state === 'active') {
    return (
      <div className={`relative flex items-center justify-center`}>
        {/* Glow ring for active state */}
        {step.state === 'active' && (
          <div className="absolute w-10 h-10 rounded-full bg-[#0A7A8F]/25 animate-pulse"></div>
        )}
        <div className="w-7 h-7 bg-[#0A7A8F] rounded-full flex items-center justify-center z-10">
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      </div>
    );
  }

  // Pending state
  return (
    <div className="w-7 h-7 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center">
      <span className="text-slate-500 text-xs font-bold">{step.id}</span>
    </div>
  );
}

export default function StatusTimeline() {
  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const isLast = index === STEPS.length - 1;
        const lineColor = step.state === 'done' || step.state === 'active' ? 'bg-[#0A7A8F]' : 'bg-slate-700';

        return (
          <div key={step.id} className="flex gap-3 items-start mb-3">
            {/* Left column: circle + line */}
            <div className="flex flex-col items-center">
              <StepCircle step={step} />
              {!isLast && (
                <div className={`w-0.5 h-8 mt-1 ${lineColor}`}></div>
              )}
            </div>

            {/* Right column: label + sub */}
            <div className="pt-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold ${
                  step.state === 'pending' ? 'text-slate-500' : 'text-white'
                }`}>
                  {step.label}
                </p>
                {step.time && (
                  <span className="text-slate-500 text-xs">{step.time}</span>
                )}
              </div>
              {step.sub && (
                <p className={`text-xs mt-0.5 ${step.subColor}`}>
                  {step.sub}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
