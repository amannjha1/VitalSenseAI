/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VitalsOverview } from './VitalsOverview';
import { VitalsChart } from './VitalsChart';
import { RiskScorecard } from './RiskScorecard';
import { PatientSummaryCard } from './PatientSummaryCard';
import { PatientProfile, VitalReading, HealthRiskAnalysisResult } from '../../types/health';
import { Stethoscope, Heart, FileSpreadsheet, CalendarCheck, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  patient: PatientProfile;
  vitals: VitalReading[];
  riskData: HealthRiskAnalysisResult | null;
  onOpenLogModal: () => void;
  onOpenDoctorPrep: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patient,
  vitals,
  riskData,
  onOpenLogModal,
  onOpenDoctorPrep,
  onNavigateTab,
}) => {
  const latestVital = vitals[0] || {
    id: 'v-fallback',
    timestamp: new Date().toISOString(),
    systolicBP: 128,
    diastolicBP: 82,
    heartRate: 72,
    bloodGlucose: 104,
    spO2: 98,
    weightKg: patient.weightKg,
  };
  const previousVital = vitals[1];

  return (
    <div className="space-y-6">
      {/* Top Quick-Action Healthcare Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigateTab('symptoms')}
          className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-left shadow-xs transition group cursor-pointer"
        >
          <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">AI Symptom Triage</span>
            <span className="text-[10px] text-slate-500">Care guidance & differential</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('risk')}
          className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-left shadow-xs transition group cursor-pointer"
        >
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">Health Risk Engine</span>
            <span className="text-[10px] text-slate-500">ASCVD & metabolic simulator</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-left shadow-xs transition group cursor-pointer"
        >
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">Lab Report Parser</span>
            <span className="text-[10px] text-slate-500">Structured data extraction</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('prevention')}
          className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-left shadow-xs transition group cursor-pointer"
        >
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 block">Preventive Roadmap</span>
            <span className="text-[10px] text-slate-500">DASH habits & screenings</span>
          </div>
        </button>
      </div>

      {/* Main Telemetry Stats Overview */}
      <VitalsOverview
        latestVital={latestVital}
        previousVital={previousVital}
        onOpenLogModal={onOpenLogModal}
      />

      {/* Charts & Prognostic Risk Scorecard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <VitalsChart vitals={vitals} />
          <RiskScorecard
            riskData={riskData}
            onNavigateToRiskEngine={() => onNavigateTab('risk')}
          />
        </div>

        <div className="space-y-6">
          <PatientSummaryCard
            patient={patient}
            onOpenDoctorPrep={onOpenDoctorPrep}
          />
        </div>
      </div>
    </div>
  );
};
