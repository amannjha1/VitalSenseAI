/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Heart,
  TrendingDown,
  ShieldCheck,
  Activity,
  Sparkles,
  Sliders,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { PatientProfile, VitalReading, HealthRiskInput, HealthRiskAnalysisResult } from '../../types/health';
import { submitRiskAnalysis } from '../../services/healthApi';

interface RiskAnalysisViewProps {
  patient: PatientProfile;
  latestVital?: VitalReading;
  onRiskUpdated?: (result: HealthRiskAnalysisResult) => void;
  onOpenDoctorPrep: () => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  patient,
  latestVital,
  onRiskUpdated,
  onOpenDoctorPrep,
}) => {
  // Calculated initial BMI
  const initialBmi = Number((patient.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1));

  // Physiological Metrics State
  const [systolicBP, setSystolicBP] = useState<number>(latestVital?.systolicBP || 132);
  const [diastolicBP, setDiastolicBP] = useState<number>(latestVital?.diastolicBP || 84);
  const [restingHeartRate, setRestingHeartRate] = useState<number>(latestVital?.heartRate || 74);
  const [bmi, setBmi] = useState<number>(initialBmi || 25.2);
  const [fastingGlucose, setFastingGlucose] = useState<number>(latestVital?.bloodGlucose || 108);
  const [hba1c, setHba1c] = useState<number>(5.8);
  const [totalCholesterol, setTotalCholesterol] = useState<number>(210);
  const [hdl, setHdl] = useState<number>(48);
  const [ldl, setLdl] = useState<number>(134);
  const [triglycerides, setTriglycerides] = useState<number>(160);
  const [isSmoker, setIsSmoker] = useState<boolean>(false);
  const [physicalActivityMinutes, setPhysicalActivityMinutes] = useState<number>(80);
  const [sleepHours, setSleepHours] = useState<number>(6.5);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [familyHistoryCVD, setFamilyHistoryCVD] = useState<boolean>(
    patient.chronicConditions.some((c) => c.toLowerCase().includes('cad') || c.toLowerCase().includes('coronary'))
  );
  const [familyHistoryDiabetes, setFamilyHistoryDiabetes] = useState<boolean>(
    patient.chronicConditions.some((c) => c.toLowerCase().includes('diabetes'))
  );

  // Counterfactual Simulator toggles
  const [simBpOptimized, setSimBpOptimized] = useState<boolean>(false);
  const [simExerciseTarget, setSimExerciseTarget] = useState<boolean>(false);
  const [simGlucoseNormalized, setSimGlucoseNormalized] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [riskResult, setRiskResult] = useState<HealthRiskAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setIsLoading(true);
    const payload: HealthRiskInput = {
      age: patient.age,
      gender: patient.gender,
      systolicBP,
      diastolicBP,
      restingHeartRate,
      bmi,
      fastingGlucose,
      hba1c,
      totalCholesterol,
      hdl,
      ldl,
      triglycerides,
      isSmoker,
      physicalActivityMinutesPerWeek: physicalActivityMinutes,
      sleepHoursPerNight: sleepHours,
      stressLevel,
      familyHistoryOfCVD: familyHistoryCVD,
      familyHistoryOfDiabetes: familyHistoryDiabetes,
    };

    try {
      const res = await submitRiskAnalysis(payload);
      setRiskResult(res);
      if (onRiskUpdated) {
        onRiskUpdated(res);
      }
    } catch (err) {
      console.error('Failed to run risk analysis:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, []);

  // Compute simulated counterfactual reduction
  let simulatedCvdReduction = 0;
  if (simBpOptimized) simulatedCvdReduction += 22;
  if (simExerciseTarget) simulatedCvdReduction += 16;
  if (simGlucoseNormalized) simulatedCvdReduction += 12;

  const currentCvdScore = riskResult?.cardiovascularRisk.scorePercentage || 24;
  const simulatedCvdScore = Math.max(4, Math.round(currentCvdScore * (1 - simulatedCvdReduction / 100)));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Preliminary Health Risk & Prognostic Engine
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                  ACC/AHA & ADA Models
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-system cardiovascular, metabolic, and lifestyle risk stratification with counterfactual intervention simulator
              </p>
            </div>
          </div>

          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Recalculating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Re-run Risk Model</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Simulation & Scorecards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Score Cards Summary */}
          {riskResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Overall Health Score */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Resilience Index
                </span>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {riskResult.overallHealthScore}
                  <span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  {riskResult.overallHealthScore >= 75 ? 'Optimal Stability' : 'Moderate Resilience'}
                </span>
              </div>

              {/* Cardiovascular Risk */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    10-Yr ASCVD Risk
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      riskResult.cardiovascularRisk.category === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : riskResult.cardiovascularRisk.category === 'Elevated'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {riskResult.cardiovascularRisk.category}
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {riskResult.cardiovascularRisk.scorePercentage}%
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  Framingham/AHA benchmark
                </p>
              </div>

              {/* Metabolic Risk */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Metabolic / T2D
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      riskResult.metabolicRisk.category === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : riskResult.metabolicRisk.category === 'Elevated'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {riskResult.metabolicRisk.category}
                  </span>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {riskResult.metabolicRisk.scorePercentage}%
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  ADA impaired glucose score
                </p>
              </div>
            </div>
          )}

          {/* Counterfactual Simulator Panel */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white">Counterfactual Risk Reduction Simulator</h3>
                  <p className="text-[11px] text-slate-300">
                    Test how evidence-backed lifestyle & medication adjustments reduce projected risk
                  </p>
                </div>
              </div>
              {simulatedCvdReduction > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full text-xs font-bold">
                  <TrendingDown className="w-4 h-4" />
                  <span>-{simulatedCvdReduction}% Projected Risk</span>
                </div>
              )}
            </div>

            {/* Visual Risk Comparison Bars */}
            <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Current 10-Yr Cardiovascular Risk Benchmark:</span>
                  <span className="font-bold text-rose-300">{currentCvdScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${currentCvdScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Projected Post-Intervention Risk:</span>
                  <span className="font-bold text-emerald-300">{simulatedCvdScore}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${simulatedCvdScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Interactive Simulation Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setSimBpOptimized(!simBpOptimized)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  simBpOptimized
                    ? 'bg-teal-500/20 border-teal-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Lower BP &lt; 120/80</span>
                  <input
                    type="checkbox"
                    checked={simBpOptimized}
                    onChange={() => {}}
                    className="rounded accent-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Targeted DASH sodium reduction or medication optimization (~22% reduction)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSimExerciseTarget(!simExerciseTarget)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  simExerciseTarget
                    ? 'bg-teal-500/20 border-teal-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">150m Aerobic/Week</span>
                  <input
                    type="checkbox"
                    checked={simExerciseTarget}
                    onChange={() => {}}
                    className="rounded accent-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  30 mins brisk walking 5 days/week (~16% reduction)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSimGlucoseNormalized(!simGlucoseNormalized)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  simGlucoseNormalized
                    ? 'bg-teal-500/20 border-teal-400 text-white'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">Normalize Fasting Glucose</span>
                  <input
                    type="checkbox"
                    checked={simGlucoseNormalized}
                    onChange={() => {}}
                    className="rounded accent-teal-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Low glycemic fiber diet blunting spikes (~12% reduction)
                </p>
              </button>
            </div>
          </div>

          {/* Modifiable Risk Factors Table */}
          {riskResult && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Prioritized Modifiable Risk Factors
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Factor</th>
                      <th className="pb-2">Current</th>
                      <th className="pb-2">Target Goal</th>
                      <th className="pb-2">Quantifiable Impact</th>
                      <th className="pb-2">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {riskResult.modifiableFactors.map((f, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 font-bold text-slate-800">{f.factor}</td>
                        <td className="py-2.5 text-slate-600">{f.current}</td>
                        <td className="py-2.5 font-semibold text-teal-700">{f.target}</td>
                        <td className="py-2.5 text-slate-700">{f.potentialRiskReduction}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              f.priority === 'High'
                                ? 'bg-rose-100 text-rose-800'
                                : f.priority === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {f.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Clinical Screening Recommendations */}
          {riskResult && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>USPSTF & Multi-Society Recommended Screenings</span>
              </h3>
              <div className="space-y-2.5">
                {riskResult.screeningRecommendations.map((scr, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{scr.test}</span>
                      <span className="text-slate-500 text-[11px]">{scr.justification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {scr.frequency}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          scr.status === 'Due'
                            ? 'bg-rose-100 text-rose-800'
                            : scr.status === 'Recommended soon'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {scr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Interactive Physiological Sliders & Toggles */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-teal-600" />
                <span>Physiological Inputs</span>
              </h3>
              <span className="text-[10px] text-slate-400">Live Calibration</span>
            </div>

            {/* Blood Pressure Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Systolic Blood Pressure</span>
                <span className="font-bold text-slate-900">{systolicBP} mmHg</span>
              </div>
              <input
                type="range"
                min="90"
                max="190"
                value={systolicBP}
                onChange={(e) => setSystolicBP(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Diastolic Blood Pressure</span>
                <span className="font-bold text-slate-900">{diastolicBP} mmHg</span>
              </div>
              <input
                type="range"
                min="50"
                max="120"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Fasting Glucose */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Fasting Blood Sugar</span>
                <span className="font-bold text-slate-900">{fastingGlucose} mg/dL</span>
              </div>
              <input
                type="range"
                min="70"
                max="220"
                value={fastingGlucose}
                onChange={(e) => setFastingGlucose(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* HbA1c */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">HbA1c Level</span>
                <span className="font-bold text-slate-900">{hba1c}%</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="10.0"
                step="0.1"
                value={hba1c}
                onChange={(e) => setHba1c(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Total Cholesterol & LDL */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Total Chol</span>
                <input
                  type="number"
                  value={totalCholesterol}
                  onChange={(e) => setTotalCholesterol(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                />
              </div>
              <div>
                <span className="text-slate-500 block mb-1">LDL Chol</span>
                <input
                  type="number"
                  value={ldl}
                  onChange={(e) => setLdl(Number(e.target.value))}
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Activity & Sleep */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Exercise (Mins/Week)</span>
                <span className="font-bold text-slate-900">{physicalActivityMinutes}m</span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={physicalActivityMinutes}
                onChange={(e) => setPhysicalActivityMinutes(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Lifestyle Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Current Tobacco Smoker</span>
                <input
                  type="checkbox"
                  checked={isSmoker}
                  onChange={(e) => setIsSmoker(e.target.checked)}
                  className="rounded accent-rose-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">First-degree CVD Family History</span>
                <input
                  type="checkbox"
                  checked={familyHistoryCVD}
                  onChange={(e) => setFamilyHistoryCVD(e.target.checked)}
                  className="rounded accent-teal-600 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700">Family History of Diabetes</span>
                <input
                  type="checkbox"
                  checked={familyHistoryDiabetes}
                  onChange={(e) => setFamilyHistoryDiabetes(e.target.checked)}
                  className="rounded accent-teal-600 w-4 h-4"
                />
              </label>
            </div>

            <button
              onClick={runAnalysis}
              disabled={isLoading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Update Risk Projections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
