/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, HeartPulse, Sparkles, ArrowRight, Zap, TrendingDown } from 'lucide-react';
import { HealthRiskAnalysisResult } from '../../types/health';

interface RiskScorecardProps {
  riskData: HealthRiskAnalysisResult | null;
  onNavigateToRiskEngine: () => void;
}

export const RiskScorecard: React.FC<RiskScorecardProps> = ({
  riskData,
  onNavigateToRiskEngine,
}) => {
  // Default values if analysis hasn't been fetched yet
  const healthScore = riskData?.overallHealthScore ?? 78;
  const cvdRisk = riskData?.cardiovascularRisk ?? {
    scorePercentage: 18,
    category: 'Borderline',
    interpretation: 'Moderate cardiovascular risk influenced by systolic BP and lipid profile.',
    keyDrivers: ['Systolic BP 132 mmHg', 'Atherogenic LDL-C'],
  };
  const metabolicRisk = riskData?.metabolicRisk ?? {
    scorePercentage: 32,
    category: 'Elevated',
    interpretation: 'Impaired fasting glucose indicates proactive insulin sensitivity training required.',
    keyDrivers: ['Fasting Glucose 106 mg/dL', 'Sedentary desk hours'],
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 stroke-emerald-500';
    if (score >= 60) return 'text-teal-600 stroke-teal-500';
    if (score >= 40) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'High':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Elevated':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Borderline':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">Health Risk Stratification</h3>
            <p className="text-[11px] text-slate-500">Multi-factor prognostic benchmarks</p>
          </div>
        </div>
        <button
          onClick={onNavigateToRiskEngine}
          className="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <span>Deep Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Health Resilience Index Circle */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-center">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - healthScore / 100)}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${getScoreColor(healthScore)}`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                {healthScore}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">/ 100</span>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-800 mt-2">Health Resilience Index</span>
          <span className="text-[10px] text-slate-500">Multisystem stability</span>
        </div>

        {/* Cardiovascular 10-Yr Risk */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Cardiovascular (ASCVD)</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(cvdRisk.category)}`}>
              {cvdRisk.category} ({cvdRisk.scorePercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                cvdRisk.scorePercentage > 40
                  ? 'bg-rose-500'
                  : cvdRisk.scorePercentage > 20
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, cvdRisk.scorePercentage)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {cvdRisk.interpretation}
          </p>
        </div>

        {/* Metabolic / Pre-diabetes Risk */}
        <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Metabolic (T2D Risk)</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadge(metabolicRisk.category)}`}>
              {metabolicRisk.category} ({metabolicRisk.scorePercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                metabolicRisk.scorePercentage > 45
                  ? 'bg-rose-500'
                  : metabolicRisk.scorePercentage > 25
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, metabolicRisk.scorePercentage)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {metabolicRisk.interpretation}
          </p>
        </div>
      </div>

      {/* Counterfactual Impact Banner */}
      <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-teal-900">
          <TrendingDown className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>Opportunity:</strong> Reducing systolic blood pressure to &lt; 120 mmHg and walking 30m/day lowers 10-year stroke and MI probability by <strong>~24%</strong>.
          </span>
        </div>
        <button
          onClick={onNavigateToRiskEngine}
          className="shrink-0 text-teal-800 hover:text-teal-950 font-bold text-xs underline cursor-pointer"
        >
          Simulate
        </button>
      </div>
    </div>
  );
};
