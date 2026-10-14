/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, Lock, AlertCircle, FileCheck } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-teal-500/20 text-teal-400 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-base">Clinical Safety, Privacy & Disclaimers</h2>
              <p className="text-xs text-slate-300">VitalSense AI operating principles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-900 block font-semibold">Not a Definitive Medical Diagnosis</strong>
              <p className="text-amber-800 mt-0.5">
                VitalSense AI provides algorithmic and AI-guided health triage, risk stratification, and educational insights. It does NOT establish a physician-patient relationship, prescribe medications, or replace the clinical judgment of a licensed healthcare provider.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl">
            <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-teal-900 block font-semibold">Health Data Protection & Privacy</strong>
              <p className="text-teal-800 mt-0.5">
                Your medical telemetry, vital entries, and uploaded lab summaries are processed securely. Server-side AI calls are scoped strictly to the evaluation session. Your health data is never sold or used for commercial advertising profiling.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <FileCheck className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Evidence-Based Clinical Guidelines</strong>
              <p className="text-slate-600 mt-0.5">
                Cardiovascular risk scoring conforms to the ACC/AHA Multi-Society guidelines. Metabolic recommendations adhere to the American Diabetes Association (ADA) Standards of Medical Care. Preventive screenings reference the U.S. Preventive Services Task Force (USPSTF).
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
