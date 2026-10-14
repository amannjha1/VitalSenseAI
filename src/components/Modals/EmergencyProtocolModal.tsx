/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, PhoneCall, AlertOctagon, HeartCrack, Brain, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface EmergencyProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyProtocolModal: React.FC<EmergencyProtocolModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-700 rounded-lg">
              <AlertOctagon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Emergency Medical Guidance & Red Flags</h2>
              <p className="text-xs text-rose-100">Critical warning signs requiring immediate 911 / ER evaluation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-rose-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-slate-800 text-xs">
          {/* Direct dial callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:911"
              className="p-3 bg-rose-50 border-2 border-rose-500 rounded-xl flex items-center gap-3 hover:bg-rose-100 transition cursor-pointer"
            >
              <div className="p-2 bg-rose-600 text-white rounded-lg">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-rose-700 block">Dial 911 (USA/Canada)</span>
                <span className="text-[11px] text-slate-600">Immediate emergency medical response</span>
              </div>
            </a>
            <a
              href="tel:18002221222"
              className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-3 hover:bg-amber-100 transition cursor-pointer"
            >
              <div className="p-2 bg-amber-600 text-white rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-amber-900 block">Poison Control Center</span>
                <span className="text-[11px] text-slate-600">1-800-222-1222 (24/7 hotline)</span>
              </div>
            </a>
          </div>

          {/* Red Flag Conditions Checklist */}
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <HeartCrack className="w-4 h-4 text-rose-600" />
              Cardiovascular & Respiratory Red Flags
            </h3>
            <ul className="space-y-1.5 text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Crushing, squeezing central chest pressure or tightness lasting &gt; 5 minutes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Chest discomfort radiating to jaw, left arm, neck, or back</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Severe difficulty breathing at rest or inability to complete a full sentence</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Sudden fainting (syncope) or profound dizziness accompanied by palpitations</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-600" />
              Neurological "FAST" Stroke Symptoms
            </h3>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-purple-700 block">F — Face Drooping</span>
                <span className="text-[11px] text-slate-600">One side of face numb or uneven smile</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-purple-700 block">A — Arm Weakness</span>
                <span className="text-[11px] text-slate-600">One arm drifting downwards when raised</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-purple-700 block">S — Speech Difficulty</span>
                <span className="text-[11px] text-slate-600">Slurred speech or trouble understanding words</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-bold text-purple-700 block">T — Time to Call 911</span>
                <span className="text-[11px] text-slate-600">Every second counts for tissue plasminogen (tPA)</span>
              </div>
            </div>
          </div>

          {/* Safety Rule */}
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 text-[11px] leading-relaxed">
            <strong>DO NOT DRIVE YOURSELF:</strong> If you suspect a heart attack or stroke, call 911 immediately. Emergency Medical Technicians (EMTs) begin lifesaving care in transit and notify the hospital cardiac/stroke team before arrival.
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
