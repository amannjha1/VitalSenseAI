/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, X } from 'lucide-react';

interface EmergencyBannerProps {
  showAlert?: boolean;
  alertMessage?: string;
  onDismiss?: () => void;
  onOpenEmergencyModal: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  showAlert = false,
  alertMessage,
  onDismiss,
  onOpenEmergencyModal,
}) => {
  if (!showAlert) {
    return (
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 px-4 py-2 text-xs flex items-center justify-between no-print">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-slate-200">VitalSense AI Clinical Decision Support Engine</span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">AHA/ACC & ADA Guideline Aligned</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden md:inline">For educational & preliminary triage only</span>
            <button
              onClick={onOpenEmergencyModal}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Emergency Warning Signs</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-rose-600 text-white px-4 py-3 shadow-lg border-b border-rose-700 animate-pulse-subtle no-print">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-700/80 rounded-lg shrink-0">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wide uppercase text-xs bg-rose-800 px-2 py-0.5 rounded">
                High Clinical Urgency
              </span>
              <span className="text-xs text-rose-100 font-medium">Immediate Action Recommended</span>
            </div>
            <p className="text-sm font-medium mt-0.5 text-white">
              {alertMessage ||
                'Symptoms suggest potential acute cardiorespiratory or neurovascular distress. Call 911 or visit the nearest Emergency Room.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="tel:911"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-rose-700 font-bold text-xs rounded-lg hover:bg-rose-50 transition shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 911</span>
          </a>
          <button
            onClick={onOpenEmergencyModal}
            className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-medium text-xs rounded-lg transition cursor-pointer"
          >
            Protocol Details
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-rose-700 rounded text-rose-200 hover:text-white transition cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
