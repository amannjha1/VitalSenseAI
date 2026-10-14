/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, Activity, Droplets, Wind, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { VitalReading } from '../../types/health';

interface VitalsOverviewProps {
  latestVital: VitalReading;
  previousVital?: VitalReading;
  onOpenLogModal: () => void;
}

export const VitalsOverview: React.FC<VitalsOverviewProps> = ({
  latestVital,
  previousVital,
  onOpenLogModal,
}) => {
  // Blood Pressure classification (AHA 2017 Guidelines)
  const getBPClassification = (sys: number, dia: number) => {
    if (sys > 180 || dia > 120) {
      return { label: 'Hypertensive Crisis', color: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
    if (sys >= 140 || dia >= 90) {
      return { label: 'Stage 2 HTN', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      return { label: 'Stage 1 HTN', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    if (sys >= 120 && sys <= 129 && dia < 80) {
      return { label: 'Elevated BP', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    }
    return { label: 'Optimal BP', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const bpStatus = getBPClassification(latestVital.systolicBP, latestVital.diastolicBP);

  // Glucose status
  const getGlucoseStatus = (val: number) => {
    if (val >= 126) return { label: 'Diabetic Range', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (val >= 100) return { label: 'Pre-diabetes Range', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Normal Fasting', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  };

  const glucoseStatus = getGlucoseStatus(latestVital.bloodGlucose);

  // Calculate BP delta if previous available
  const sysDelta = previousVital ? latestVital.systolicBP - previousVital.systolicBP : 0;
  const hrDelta = previousVital ? latestVital.heartRate - previousVital.heartRate : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Active Telemetry & Vital Signs</h2>
          <p className="text-xs text-slate-500">
            Last logged:{' '}
            <span className="font-medium text-slate-700">
              {new Date(latestVital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {' '}on {new Date(latestVital.timestamp).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={onOpenLogModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log New Vital</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Blood Pressure Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Blood Pressure
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bpStatus.color}`}>
              {bpStatus.label}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {latestVital.systolicBP}/{latestVital.diastolicBP}
            </span>
            <span className="text-xs font-medium text-slate-400">mmHg</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <span>Pulse Pressure: {latestVital.systolicBP - latestVital.diastolicBP} mmHg</span>
            {sysDelta !== 0 && (
              <span className={`flex items-center font-medium ${sysDelta > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {sysDelta > 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                {Math.abs(sysDelta)} mmHg
              </span>
            )}
          </div>
        </div>

        {/* 2. Heart Rate Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resting Heart Rate
            </span>
            <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Normal Sinus</span>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {latestVital.heartRate}
            </span>
            <span className="text-xs font-medium text-slate-400">BPM</span>
          </div>

          {/* Mini Animated ECG Pulse Wave */}
          <div className="h-6 flex items-center justify-between text-slate-400 overflow-hidden py-1">
            <svg className="w-full h-full text-rose-500" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path
                d="M0,10 L20,10 L25,4 L30,16 L35,2 L40,18 L45,10 L70,10 L75,4 L80,16 L85,2 L90,18 L95,10 L100,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <span>Target: 60 - 80 BPM</span>
            {hrDelta !== 0 && (
              <span className="text-[11px] text-slate-400">
                {hrDelta > 0 ? `+${hrDelta}` : hrDelta} vs prev
              </span>
            )}
          </div>
        </div>

        {/* 3. Fasting Glucose Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fasting Blood Sugar
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${glucoseStatus.color}`}>
              {glucoseStatus.label}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 my-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {latestVital.bloodGlucose}
            </span>
            <span className="text-xs font-medium text-slate-400">mg/dL</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 my-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                latestVital.bloodGlucose > 125
                  ? 'bg-rose-500'
                  : latestVital.bloodGlucose >= 100
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (latestVital.bloodGlucose / 160) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-500">
            <span>ADA Normal: 70 - 99</span>
            <span className="text-slate-400">Fasting</span>
          </div>
        </div>

        {/* 4. Oxygen SpO2 & Sleep Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-teal-400 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Blood Oxygen & Rest
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Optimal
            </span>
          </div>

          <div className="flex items-baseline justify-between my-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {latestVital.spO2}
              </span>
              <span className="text-xs font-medium text-slate-400">% SpO2</span>
            </div>
            {latestVital.sleepHours && (
              <div className="text-right">
                <span className="text-sm font-bold text-slate-700">{latestVital.sleepHours}h</span>
                <span className="text-[10px] text-slate-400 block">Sleep</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <span>Body Temp: {latestVital.temperatureC || 36.7}°C</span>
            <span>{latestVital.weightKg} kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
