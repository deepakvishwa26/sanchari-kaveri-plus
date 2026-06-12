import { ShieldCheck } from 'lucide-react';

export default function PriceComparison() {
  return (
    <div className="bg-slate-800 rounded-xl p-3 my-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={16} className="text-[#0A7A8F]" />
        <span className="text-slate-500 uppercase text-[9px] tracking-widest font-semibold">Surge Shield</span>
      </div>

      {/* BWSSB Rate */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400 text-sm">BWSSB rate</span>
        <span className="text-green-400 font-bold text-sm">₹1,290</span>
      </div>

      {/* Private Tanker */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-slate-400 text-sm">Private tanker</span>
        <span className="text-red-400 line-through font-bold text-sm">₹3,200</span>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-700 my-2"></div>

      {/* You Save */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-slate-400 text-sm">You save</span>
        <span className="text-amber-400 font-bold text-sm">₹1,910 today</span>
      </div>
    </div>
  );
}
