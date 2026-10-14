/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Pill, AlertTriangle, ShieldCheck, Phone, Stethoscope } from 'lucide-react';
import { PatientProfile } from '../../types/health';

interface PatientSummaryCardProps {
  patient: PatientProfile;
  onOpenDoctorPrep: () => void;
}

export const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  patient,
  onOpenDoctorPrep,
}) => {
  const bmi = (patient.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-3">
        <div className="flex items-center gap-3">
          <img
            src={patient.avatarUrl}
            alt={patient.name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900">{patient.name}</h3>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                {patient.bloodType}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {patient.age} years old • {patient.gender} • {patient.occupation}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDoctorPrep}
          className="text-xs text-teal-700 hover:text-teal-800 font-semibold bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          Export Brief
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">
            Physical Biometrics
          </span>
          <div className="text-slate-800 font-medium">
            Height: <span className="font-bold">{patient.heightCm} cm</span>
          </div>
          <div className="text-slate-800 font-medium">
            Weight: <span className="font-bold">{patient.weightKg} kg</span>
          </div>
          <div className="text-slate-800 font-medium">
            BMI: <span className="font-bold">{bmi} kg/m²</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 sm:col-span-2">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">
            <Pill className="w-3 h-3 text-teal-600" />
            <span>Active Prescription Regimen</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patient.medications.map((m, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-md text-[11px] font-medium shadow-2xs"
                title={`${m.dosage} - ${m.frequency}`}
              >
                {m.name} <span className="text-slate-400">({m.dosage})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-1 border-t border-slate-100 text-xs">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Chronic Medical Conditions
          </span>
          <div className="flex flex-wrap gap-1.5">
            {patient.chronicConditions.map((cond, i) => (
              <span
                key={i}
                className="bg-amber-50/80 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] font-medium"
              >
                {cond}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 gap-2">
          <div className="flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            <span>{patient.primaryCarePhysician}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Emergency: {patient.emergencyContact.name} ({patient.emergencyContact.relation})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
