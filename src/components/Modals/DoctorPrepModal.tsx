/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Printer, Download, FileText, CheckCircle2, User, Heart, Shield } from 'lucide-react';
import { PatientProfile, VitalReading, SymptomAssessmentResult, HealthRiskAnalysisResult } from '../../types/health';

interface DoctorPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  latestVitals?: VitalReading;
  vitalsHistory: VitalReading[];
  recentAssessment?: SymptomAssessmentResult | null;
  riskData?: HealthRiskAnalysisResult | null;
}

export const DoctorPrepModal: React.FC<DoctorPrepModalProps> = ({
  isOpen,
  onClose,
  patient,
  latestVitals,
  vitalsHistory,
  recentAssessment,
  riskData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Physician Consultation Summary (SBAR Format)</h2>
              <p className="text-xs text-slate-300">Formatted clinical brief for upcoming appointment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800 bg-white">
          {/* Document Header */}
          <div className="border-b border-slate-200 pb-5 flex flex-wrap justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">VitalSense AI</span>
                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                  CLINICAL SUMMARY BRIEF
                </span>
              </div>
              <p className="text-xs text-slate-500">Prepared for primary care or specialist consultation</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Date Generated: {new Date().toLocaleDateString()}</p>
              <p>Primary Provider: {patient.primaryCarePhysician}</p>
            </div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Patient Name</span>
              <span className="font-bold text-slate-900">{patient.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Age / Biological Sex</span>
              <span className="font-bold text-slate-900">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Height / Weight / BMI</span>
              <span className="font-bold text-slate-900">
                {patient.heightCm}cm • {patient.weightKg}kg •{' '}
                {(patient.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Known Allergies</span>
              <span className="font-bold text-rose-600">
                {patient.allergies.length ? patient.allergies.join(', ') : 'NKDA'}
              </span>
            </div>
          </div>

          {/* S - Situation */}
          <div className="border-l-4 border-teal-600 pl-4 py-1">
            <h3 className="font-bold text-xs uppercase tracking-wider text-teal-800">
              S — Situation (Reason for Review)
            </h3>
            {recentAssessment ? (
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                Patient presenting for clinical discussion following triage assessment of:{' '}
                <strong>{recentAssessment.clinicalRationale}</strong>. Triage classified as{' '}
                <span className="font-semibold text-slate-900 underline">{recentAssessment.triageLevel}</span>.
              </p>
            ) : (
              <p className="text-xs text-slate-700 mt-1">
                Routine preventive wellness follow-up and cardiometabolic monitoring review.
              </p>
            )}
          </div>

          {/* B - Background */}
          <div className="border-l-4 border-blue-600 pl-4 py-1 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-blue-800">
              B — Background (Past Medical History & Regimen)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700 block mb-1">Active Chronic Diagnoses:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {patient.chronicConditions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700 block mb-1">Current Prescribed Regimen:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                  {patient.medications.map((m, i) => (
                    <li key={i}>
                      {m.name} ({m.dosage}) — {m.frequency}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* A - Assessment (Recent Hemodynamics & Trends) */}
          <div className="border-l-4 border-amber-600 pl-4 py-1 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800">
              A — Assessment (Home Telemetry & Risk Indicators)
            </h3>
            {latestVitals && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg">
                  <span className="text-slate-500 block">Resting Blood Pressure</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {latestVitals.systolicBP}/{latestVitals.diastolicBP} mmHg
                  </span>
                  <span className="text-[10px] text-amber-700 block">
                    {latestVitals.systolicBP >= 130 ? 'Stage 1 Hypertension' : 'Normotensive'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block">Resting Heart Rate</span>
                  <span className="font-bold text-slate-900 text-sm">{latestVitals.heartRate} bpm</span>
                  <span className="text-[10px] text-slate-500 block">Regular sinus rhythm</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block">Fasting Blood Glucose</span>
                  <span className="font-bold text-slate-900 text-sm">{latestVitals.bloodGlucose} mg/dL</span>
                  <span className="text-[10px] text-amber-700 block">
                    {latestVitals.bloodGlucose >= 100 ? 'Impaired Fasting Glucose' : 'Normal'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-500 block">Oxygen Saturation</span>
                  <span className="font-bold text-slate-900 text-sm">{latestVitals.spO2}% SpO2</span>
                  <span className="text-[10px] text-emerald-700 block">Adequate room air</span>
                </div>
              </div>
            )}

            {riskData && (
              <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
                <p className="font-medium text-slate-800">
                  Calculated Risk Stratification: Cardiovascular (ASCVD 10-Yr):{' '}
                  <span className="font-bold">{riskData.cardiovascularRisk.category}</span> ({riskData.cardiovascularRisk.scorePercentage}%) •
                  Metabolic T2D Risk: <span className="font-bold">{riskData.metabolicRisk.category}</span> ({riskData.metabolicRisk.scorePercentage}%)
                </p>
                <p className="text-slate-600 italic">"{riskData.aiClinicalSummary}"</p>
              </div>
            )}
          </div>

          {/* R - Recommendation & Discussion Agenda */}
          <div className="border-l-4 border-purple-600 pl-4 py-1 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-800">
              R — Recommendation (Suggested Physician Questions)
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {recentAssessment?.doctorQuestions ? (
                recentAssessment.doctorQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-purple-700">{idx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-700">1.</span>
                    <span>Should we consider medication titration or ambulatory 24-hr BP monitoring?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-700">2.</span>
                    <span>Would a repeat HbA1c and lipid panel (ApoB / hs-CRP) be indicated this quarter?</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-purple-700">3.</span>
                    <span>What target aerobic heart rate zone do you recommend for exercise clearance?</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Legal / Medical Disclaimer Box */}
          <div className="p-3 bg-slate-100 rounded-lg text-[10px] text-slate-500 leading-tight">
            <strong>NOTICE FOR MEDICAL PROVIDER & PATIENT:</strong> VitalSense AI generates preliminary clinical support summaries from user-entered telemetry. It does not constitute a formal diagnostic evaluation or medical order. Clinical decision-making remains solely the responsibility of the attending physician.
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Print Consultation Brief
          </button>
        </div>
      </div>
    </div>
  );
};
