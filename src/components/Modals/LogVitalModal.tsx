/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Heart, Activity, Droplets, Wind, Scale, Check } from 'lucide-react';
import { VitalReading } from '../../types/health';

interface LogVitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reading: VitalReading) => void;
  defaultWeight?: number;
}

export const LogVitalModal: React.FC<LogVitalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultWeight = 68.5,
}) => {
  const [systolic, setSystolic] = useState<number>(128);
  const [diastolic, setDiastolic] = useState<number>(82);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [glucose, setGlucose] = useState<number>(104);
  const [spO2, setSpO2] = useState<number>(98);
  const [weight, setWeight] = useState<number>(defaultWeight);
  const [temperature, setTemperature] = useState<number>(36.7);
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReading: VitalReading = {
      id: 'vital-' + Date.now(),
      timestamp: new Date().toISOString(),
      systolicBP: Number(systolic),
      diastolicBP: Number(diastolic),
      heartRate: Number(heartRate),
      bloodGlucose: Number(glucose),
      spO2: Number(spO2),
      weightKg: Number(weight),
      temperatureC: Number(temperature),
      sleepHours: Number(sleepHours),
      notes: notes.trim() || undefined,
    };
    onSave(newReading);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base text-white">Record Vital Signs</h2>
              <p className="text-xs text-slate-300">New telemetry entry for active patient</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Blood Pressure */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Blood Pressure (mmHg)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-500 mb-1 block">Systolic (Top)</span>
                <input
                  type="number"
                  min="70"
                  max="260"
                  required
                  value={systolic}
                  onChange={(e) => setSystolic(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <span className="text-xs text-slate-500 mb-1 block">Diastolic (Bottom)</span>
                <input
                  type="number"
                  min="40"
                  max="160"
                  required
                  value={diastolic}
                  onChange={(e) => setDiastolic(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Heart Rate & Fasting Glucose */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="35"
                max="220"
                required
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Droplets className="w-3.5 h-3.5 text-amber-500" />
                Blood Glucose (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="500"
                required
                value={glucose}
                onChange={(e) => setGlucose(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* SpO2 & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                Oxygen SpO2 (%)
              </label>
              <input
                type="number"
                min="75"
                max="100"
                required
                value={spO2}
                onChange={(e) => setSpO2(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-500" />
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Context Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Taken post-exercise, fasting morning reading..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Reading
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
