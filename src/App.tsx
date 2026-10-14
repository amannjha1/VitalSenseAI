/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { DashboardView } from './components/Dashboard/DashboardView';
import { SymptomAssessmentView } from './components/SymptomAssessment/SymptomAssessmentView';
import { RiskAnalysisView } from './components/RiskAnalysis/RiskAnalysisView';
import { ReportAnalyzerView } from './components/ReportAnalyzer/ReportAnalyzerView';
import { PreventiveCareView } from './components/PreventiveCare/PreventiveCareView';
import { LogVitalModal } from './components/Modals/LogVitalModal';
import { DoctorPrepModal } from './components/Modals/DoctorPrepModal';
import { EmergencyProtocolModal } from './components/Modals/EmergencyProtocolModal';
import { DisclaimerModal } from './components/Modals/DisclaimerModal';
import { MOCK_PATIENTS, MOCK_VITALS_HISTORY } from './data/mockPatients';
import {
  PatientProfile,
  VitalReading,
  SymptomAssessmentResult,
  HealthRiskAnalysisResult,
} from './types/health';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [patients, setPatients] = useState<PatientProfile[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientProfile>(MOCK_PATIENTS[0]);
  const [vitalsMap, setVitalsMap] = useState<Record<string, VitalReading[]>>(MOCK_VITALS_HISTORY);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [isDoctorPrepOpen, setIsDoctorPrepOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  // Emergency banner trigger
  const [hasEmergencyAlert, setHasEmergencyAlert] = useState<boolean>(false);
  const [emergencyAlertText, setEmergencyAlertText] = useState<string>('');

  // Latest clinical analysis results
  const [latestAssessment, setLatestAssessment] = useState<SymptomAssessmentResult | null>(null);
  const [latestRiskData, setLatestRiskData] = useState<HealthRiskAnalysisResult | null>(null);

  const currentVitals = vitalsMap[selectedPatient.id] || [];
  const latestVital = currentVitals[0];

  const handleSaveVital = (newReading: VitalReading) => {
    setVitalsMap((prev) => ({
      ...prev,
      [selectedPatient.id]: [newReading, ...(prev[selectedPatient.id] || [])],
    }));
  };

  const handleApplyExtractedVitals = (extracted: Partial<VitalReading>) => {
    const baseline = latestVital || {
      id: 'v-new',
      timestamp: new Date().toISOString(),
      systolicBP: 120,
      diastolicBP: 80,
      heartRate: 70,
      bloodGlucose: 100,
      spO2: 98,
      weightKg: selectedPatient.weightKg,
    };

    const newReading: VitalReading = {
      ...baseline,
      id: 'vital-extracted-' + Date.now(),
      timestamp: new Date().toISOString(),
      systolicBP: extracted.systolicBP ?? baseline.systolicBP,
      diastolicBP: extracted.diastolicBP ?? baseline.diastolicBP,
      heartRate: extracted.heartRate ?? baseline.heartRate,
      bloodGlucose: extracted.bloodGlucose ?? baseline.bloodGlucose,
      notes: extracted.notes ?? 'Synced from clinical laboratory report',
    };

    handleSaveVital(newReading);
  };

  const handleAssessmentCompleted = (result: SymptomAssessmentResult) => {
    setLatestAssessment(result);
    if (result.isEmergency) {
      setHasEmergencyAlert(true);
      setEmergencyAlertText(
        result.emergencyAlert ||
          'Critical emergency indicators identified. Call 911 or visit the nearest Emergency Department immediately.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Clinical & Emergency Banner */}
      <EmergencyBanner
        showAlert={hasEmergencyAlert}
        alertMessage={emergencyAlertText}
        onDismiss={() => setHasEmergencyAlert(false)}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Primary Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patients={patients}
        selectedPatient={selectedPatient}
        onSelectPatient={(p) => {
          setSelectedPatient(p);
          setLatestAssessment(null);
        }}
        onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            patient={selectedPatient}
            vitals={currentVitals}
            riskData={latestRiskData}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomAssessmentView
            patient={selectedPatient}
            latestVital={latestVital}
            onAssessmentCompleted={handleAssessmentCompleted}
            onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {activeTab === 'risk' && (
          <RiskAnalysisView
            patient={selectedPatient}
            latestVital={latestVital}
            onRiskUpdated={setLatestRiskData}
            onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportAnalyzerView
            patient={selectedPatient}
            onApplyExtractedVitals={handleApplyExtractedVitals}
            onOpenDoctorPrep={() => setIsDoctorPrepOpen(true)}
          />
        )}

        {activeTab === 'prevention' && (
          <PreventiveCareView
            patient={selectedPatient}
            latestVital={latestVital}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">VitalSense AI</span>
            <span>•</span>
            <span>Clinical Health Assessment & Telemetry</span>
            <span>•</span>
            <span className="text-teal-700 font-medium">Firebase Firestore Connected</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDisclaimerOpen(true)}
              className="hover:text-slate-900 transition underline cursor-pointer"
            >
              Medical Safety & Privacy Disclaimers
            </button>
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold transition cursor-pointer"
            >
              Emergency 911 Guidelines
            </button>
          </div>
        </div>
      </footer>

      {/* Global Clinical Modals */}
      <LogVitalModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onSave={handleSaveVital}
        defaultWeight={selectedPatient.weightKg}
      />

      <DoctorPrepModal
        isOpen={isDoctorPrepOpen}
        onClose={() => setIsDoctorPrepOpen(false)}
        patient={selectedPatient}
        latestVitals={latestVital}
        vitalsHistory={currentVitals}
        recentAssessment={latestAssessment}
        riskData={latestRiskData}
      />

      <EmergencyProtocolModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
