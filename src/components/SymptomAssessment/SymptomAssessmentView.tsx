/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Stethoscope,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Activity,
  FileText,
  RotateCcw,
  Sparkles,
  PhoneCall,
} from 'lucide-react';
import {
  PatientProfile,
  VitalReading,
  SymptomAssessmentInput,
  SymptomAssessmentResult,
  TriageLevel,
} from '../../types/health';
import { submitSymptomAssessment } from '../../services/healthApi';

interface SymptomAssessmentViewProps {
  patient: PatientProfile;
  latestVital?: VitalReading;
  onAssessmentCompleted?: (result: SymptomAssessmentResult) => void;
  onOpenDoctorPrep: () => void;
  onOpenEmergencyModal: () => void;
}

export const SymptomAssessmentView: React.FC<SymptomAssessmentViewProps> = ({
  patient,
  latestVital,
  onAssessmentCompleted,
  onOpenDoctorPrep,
  onOpenEmergencyModal,
}) => {
  const [step, setStep] = useState<number>(1);
  const [primaryComplaint, setPrimaryComplaint] = useState<string>('');
  const [bodyRegion, setBodyRegion] = useState<string>('Chest / Cardiovascular');
  const [onset, setOnset] = useState<'sudden' | 'gradual'>('gradual');
  const [duration, setDuration] = useState<string>('Past 2 days');
  const [severity, setSeverity] = useState<number>(4);
  const [aggravatingFactors, setAggravatingFactors] = useState<string>('');
  const [relievingFactors, setRelievingFactors] = useState<string>('');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<SymptomAssessmentResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const COMMON_CHIEF_COMPLAINTS = [
    'Mild chest tightness after climbing stairs',
    'Throbbing bilateral headache and lightheadedness',
    'Shortness of breath on mild exertion',
    'Palpitations and irregular racing heartbeats',
    'Upper right quadrant abdominal ache post-meals',
    'Persistent fatigue and brain fog despite sleep',
    'Joint stiffness in fingers and morning ache',
  ];

  const BODY_REGIONS = [
    'Chest / Cardiovascular',
    'Head, Eyes, Neck',
    'Respiratory / Lungs',
    'Abdomen & Digestive',
    'Musculoskeletal & Back',
    'General / Systemic',
  ];

  const COMMON_ASSOCIATED_SYMPTOMS = [
    'Shortness of breath (Dyspnea)',
    'Cold sweats / Diaphoresis',
    'Nausea or vomiting',
    'Dizziness / Vertigo',
    'Palpitations / Fluttering',
    'Radiating tingling / Numbness',
    'Fatigue / Weakness',
    'Low-grade fever',
    'Visual aura or blurriness',
  ];

  const toggleAssociatedSymptom = (sym: string) => {
    if (associatedSymptoms.includes(sym)) {
      setAssociatedSymptoms(associatedSymptoms.filter((s) => s !== sym));
    } else {
      setAssociatedSymptoms([...associatedSymptoms, sym]);
    }
  };

  const handleRunAssessment = async () => {
    if (!primaryComplaint.trim()) {
      setErrorMsg('Please describe your chief symptom complaint.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    const payload: SymptomAssessmentInput = {
      primaryComplaint: primaryComplaint.trim(),
      bodyRegion,
      onset,
      duration,
      severity,
      aggravatingFactors: aggravatingFactors.trim() || undefined,
      relievingFactors: relievingFactors.trim() || undefined,
      associatedSymptoms,
      patientContext: {
        age: patient.age,
        gender: patient.gender,
        chronicConditions: patient.chronicConditions,
        medications: patient.medications.map((m) => `${m.name} ${m.dosage}`),
        recentVitals: latestVital
          ? {
              bp: `${latestVital.systolicBP}/${latestVital.diastolicBP}`,
              hr: latestVital.heartRate,
              temp: latestVital.temperatureC,
            }
          : undefined,
      },
    };

    try {
      const result = await submitSymptomAssessment(payload);
      setAssessmentResult(result);
      if (onAssessmentCompleted) {
        onAssessmentCompleted(result);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to complete triage assessment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAssessmentResult(null);
    setStep(1);
    setPrimaryComplaint('');
    setAssociatedSymptoms([]);
    setAggravatingFactors('');
    setRelievingFactors('');
    setSeverity(4);
    setErrorMsg(null);
  };

  const getTriageBadge = (level: TriageLevel) => {
    switch (level) {
      case 'EMERGENCY':
        return {
          title: 'Emergency Care Required (Call 911 / ER)',
          badgeColor: 'bg-rose-600 text-white border-rose-700',
          containerColor: 'bg-rose-50 border-rose-300 text-rose-950',
          icon: ShieldAlert,
        };
      case 'URGENT_CARE':
        return {
          title: 'Urgent Care Evaluation Advised (Within 12-24 Hours)',
          badgeColor: 'bg-amber-600 text-white border-amber-700',
          containerColor: 'bg-amber-50 border-amber-300 text-amber-950',
          icon: AlertTriangle,
        };
      case 'PRIMARY_CARE':
        return {
          title: 'Primary Care Appointment (Within 3-5 Days)',
          badgeColor: 'bg-teal-600 text-white border-teal-700',
          containerColor: 'bg-teal-50 border-teal-200 text-teal-950',
          icon: Stethoscope,
        };
      case 'SELF_MONITOR':
        return {
          title: 'Home Care & Symptom Monitoring',
          badgeColor: 'bg-emerald-600 text-white border-emerald-700',
          containerColor: 'bg-emerald-50 border-emerald-200 text-emerald-950',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* View Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-2xl">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  AI Clinical Symptom Triage
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  Safety Protocol Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Preliminary severity triage, care pathway routing, and clinical uncertainty evaluation
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500">
            <span>Evaluating for: </span>
            <span className="font-bold text-slate-800">{patient.name}</span>
            <span className="text-slate-400"> ({patient.age}y, {patient.gender})</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* If assessment already done, show Results View */}
      {assessmentResult ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Triage Level Banner */}
          {(() => {
            const config = getTriageBadge(assessmentResult.triageLevel);
            const Icon = config.icon;
            return (
              <div
                className={`p-6 rounded-2xl border-2 shadow-xs space-y-3 ${config.containerColor}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl text-white ${config.badgeColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-80">
                        Recommended Clinical Care Level
                      </span>
                      <h2 className="text-lg font-black tracking-tight">{config.title}</h2>
                    </div>
                  </div>

                  {assessmentResult.isEmergency && (
                    <button
                      onClick={onOpenEmergencyModal}
                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Emergency Protocol (911)</span>
                    </button>
                  )}
                </div>

                <p className="text-xs font-medium leading-relaxed opacity-90">
                  {assessmentResult.clinicalRationale}
                </p>

                {assessmentResult.emergencyAlert && (
                  <div className="p-3 bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-xs">
                    {assessmentResult.emergencyAlert}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Differential Considerations Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Preliminary Differential Considerations
                </h3>
                <p className="text-xs text-slate-500">
                  Potential clinical etiologies to explore with your healthcare provider
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                Non-Definitive
              </span>
            </div>

            <div className="space-y-3">
              {assessmentResult.possibleDifferential.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900">{diff.condition}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        diff.likelihood === 'High'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : diff.likelihood === 'Moderate'
                          ? 'bg-teal-50 text-teal-800 border-teal-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {diff.likelihood} Likelihood
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{diff.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {diff.keyFactors.map((factor, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md"
                      >
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Uncertainty Disclosure & Missing Diagnostics Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900">
              <HelpCircle className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-sm">Diagnostic Uncertainty & Limitations</h3>
                <p className="text-xs text-slate-500">
                  Why physical examination and clinical testing remain irreplaceable
                </p>
              </div>
            </div>

            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-teal-950">AI Diagnostic Confidence:</span>
                <span className="font-mono font-bold text-teal-800">
                  {assessmentResult.uncertaintyScore.confidencePercentage}%
                </span>
              </div>
              <p className="text-teal-900 leading-relaxed">
                {assessmentResult.uncertaintyScore.reason}
              </p>

              <div>
                <span className="font-semibold text-teal-950 block mb-1.5">
                  Missing In-Person Clinical Diagnostics:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-teal-900">
                  {assessmentResult.uncertaintyScore.missingDataPoints.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Actionable Next Steps & Doctor Discussion Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Immediate Next Steps */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Immediate Action Steps
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {assessmentResult.immediateNextSteps.map((step, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="font-bold text-teal-600 mt-0.5">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions to Ask Doctor */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                Physician Discussion Agenda
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {assessmentResult.doctorQuestions.map((q, qIdx) => (
                  <li key={qIdx} className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">{qIdx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Red Flag Warning Box */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>Red Flags Requiring Immediate Emergency Re-evaluation:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-rose-700">
              {assessmentResult.redFlagsToWatchFor.map((rf, rfIdx) => (
                <li key={rfIdx}>{rf}</li>
              ))}
            </ul>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Assess Another Symptom</span>
            </button>

            <button
              onClick={onOpenDoctorPrep}
              className="flex items-center gap-1.5 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Printable Doctor Prep Brief</span>
            </button>
          </div>
        </div>
      ) : (
        /* Guided Step-by-Step Intake Form */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px]">
                {step}
              </span>
              <span className="font-bold text-slate-800">
                {step === 1 && 'Step 1: Chief Complaint & Location'}
                {step === 2 && 'Step 2: Severity & Onset Timeline'}
                {step === 3 && 'Step 3: Associated Symptoms & Triggers'}
                {step === 4 && 'Step 4: Clinical History Confirmation'}
              </span>
            </div>
            <span className="text-slate-400 font-medium">Step {step} of 4</span>
          </div>

          {/* STEP 1: Chief Complaint */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  What is your primary symptom or concern?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Mild retrosternal chest tightness that worsens when climbing stairs, resolving after rest..."
                  value={primaryComplaint}
                  onChange={(e) => setPrimaryComplaint(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-normal"
                />
              </div>

              <div>
                <span className="text-xs text-slate-500 block mb-2 font-medium">
                  Or select a common clinical presentation to test:
                </span>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CHIEF_COMPLAINTS.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPrimaryComplaint(sample)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition text-left cursor-pointer ${
                        primaryComplaint === sample
                          ? 'bg-teal-50 text-teal-800 border-teal-400 font-semibold'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Anatomical Region
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BODY_REGIONS.map((region) => (
                    <button
                      key={region}
                      type="button"
                      onClick={() => setBodyRegion(region)}
                      className={`p-3 rounded-xl border text-xs font-semibold transition cursor-pointer text-left ${
                        bodyRegion === region
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={!primaryComplaint.trim()}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Continue to Severity & Duration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Severity & Onset */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Severity Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Discomfort / Pain Severity Scale (1 - 10)
                  </label>
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                      severity >= 8
                        ? 'bg-rose-100 text-rose-800'
                        : severity >= 5
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    Level {severity}/10 —{' '}
                    {severity >= 9
                      ? 'Severe / Critical'
                      : severity >= 7
                      ? 'Severe'
                      : severity >= 4
                      ? 'Moderate'
                      : 'Mild'}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />

                <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
                  <span>1 (Mild nuisance)</span>
                  <span>5 (Noticeable interference)</span>
                  <span>10 (Worst imaginable)</span>
                </div>
              </div>

              {/* Onset speed */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  How did the symptom begin?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOnset('sudden')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      onset === 'sudden'
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs block">Sudden Onset</span>
                    <span className="text-[11px] text-slate-500">Began abruptly within seconds or minutes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOnset('gradual')}
                    className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                      onset === 'gradual'
                        ? 'bg-teal-50 border-teal-500 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="font-bold text-xs block">Gradual Onset</span>
                    <span className="text-[11px] text-slate-500">Slowly progressed over hours or days</span>
                  </button>
                </div>
              </div>

              {/* Duration input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Duration / Timeframe
                </label>
                <input
                  type="text"
                  placeholder="e.g. Past 4 hours, past 3 days, on and off for 2 weeks..."
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Continue to Associated Symptoms</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Associated Symptoms & Triggers */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Are you experiencing any accompanying symptoms?
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_ASSOCIATED_SYMPTOMS.map((sym) => {
                    const isSelected = associatedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleAssociatedSymptom(sym)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                        }`}
                      >
                        {sym}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    What makes it worse? (Aggravating)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Climbing stairs, stress, heavy meals..."
                    value={aggravatingFactors}
                    onChange={(e) => setAggravatingFactors(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    What makes it better? (Relieving)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sitting down, drinking cold water, resting..."
                    value={relievingFactors}
                    onChange={(e) => setRelievingFactors(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <span>Review Clinical Context</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Clinical History Confirmation & Run */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Patient Baseline Profile</span>
                  <span className="text-teal-700 font-semibold">{patient.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block">Chronic Conditions:</span>
                    <span className="font-medium text-slate-800">
                      {patient.chronicConditions.join(', ') || 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current Medications:</span>
                    <span className="font-medium text-slate-800">
                      {patient.medications.map((m) => m.name).join(', ') || 'None'}
                    </span>
                  </div>
                </div>
                {latestVital && (
                  <div className="pt-1 text-slate-600">
                    <span className="text-slate-400 block">Recent Telemetry Vitals:</span>
                    <span className="font-bold text-slate-800">
                      BP: {latestVital.systolicBP}/{latestVital.diastolicBP} mmHg • HR: {latestVital.heartRate} BPM • Glucose: {latestVital.bloodGlucose} mg/dL
                    </span>
                  </div>
                )}
              </div>

              {/* Summary of Complaint */}
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1.5 text-xs text-teal-950">
                <span className="font-bold uppercase tracking-wider text-[10px] text-teal-700 block">
                  Symptom Summary to Evaluate
                </span>
                <p className="font-semibold text-sm">"{primaryComplaint}"</p>
                <div className="flex flex-wrap gap-2 text-xs text-teal-800 pt-1">
                  <span>Region: <strong>{bodyRegion}</strong></span>
                  <span>•</span>
                  <span>Onset: <strong>{onset}</strong></span>
                  <span>•</span>
                  <span>Severity: <strong>{severity}/10</strong></span>
                  <span>•</span>
                  <span>Duration: <strong>{duration}</strong></span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleRunAssessment}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Evaluating Clinical Triage with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-teal-200" />
                      <span>Generate Triage Guidance & Differential</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
