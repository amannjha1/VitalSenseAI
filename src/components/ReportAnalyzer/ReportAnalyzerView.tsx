/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  Database,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SAMPLE_REPORTS, SampleReport } from '../../data/sampleReports';
import { MedicalReportAnalysisResult, Biomarker, PatientProfile, VitalReading } from '../../types/health';
import { submitReportAnalysis } from '../../services/healthApi';

interface ReportAnalyzerViewProps {
  patient: PatientProfile;
  onApplyExtractedVitals: (vitals: Partial<VitalReading>) => void;
  onOpenDoctorPrep: () => void;
}

export const ReportAnalyzerView: React.FC<ReportAnalyzerViewProps> = ({
  patient,
  onApplyExtractedVitals,
  onOpenDoctorPrep,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleReport>(SAMPLE_REPORTS[0]);
  const [reportText, setReportText] = useState<string>(SAMPLE_REPORTS[0].rawText);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileMimeType, setFileMimeType] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [reportResult, setReportResult] = useState<MedicalReportAnalysisResult | null>(null);
  const [expandedBiomarker, setExpandedBiomarker] = useState<string | null>(null);
  const [vitalsSynced, setVitalsSynced] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectSample = (sample: SampleReport) => {
    setSelectedSample(sample);
    setReportText(sample.rawText);
    setFileBase64('');
    setFileMimeType('');
    setFileName('');
    setVitalsSynced(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileMimeType(file.type);
    setVitalsSynced(false);

    const reader = new FileReader();
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      reader.onload = (event) => {
        setReportText((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const resultStr = event.target?.result as string;
        const base64Data = resultStr.split(',')[1];
        setFileBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!reportText.trim() && !fileBase64) {
      setErrorMsg('Please select a sample report, upload a file, or paste laboratory text.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await submitReportAnalysis({
        reportText: reportText.trim() || undefined,
        fileBase64: fileBase64 || undefined,
        fileMimeType: fileMimeType || undefined,
      });
      setReportResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to extract laboratory report.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncVitals = () => {
    if (!reportResult?.vitalsExtracted) return;
    const extracted = reportResult.vitalsExtracted;
    onApplyExtractedVitals({
      bloodGlucose: extracted.glucose,
      systolicBP: extracted.systolicBP,
      diastolicBP: extracted.diastolicBP,
      heartRate: extracted.heartRate,
      notes: `Extracted from lab report: ${reportResult.reportTitle}`,
    });
    setVitalsSynced(true);
  };

  const getStatusBadge = (status: Biomarker['status']) => {
    switch (status) {
      case 'CRITICAL':
        return 'bg-rose-600 text-white border-rose-700';
      case 'ELEVATED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'BORDERLINE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'NORMAL':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Medical Report OCR & Biomarker Extraction
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Clinical Parser
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI extraction of lab analytes, reference ranges, abnormal flags, and plain-English clinical interpretations
              </p>
            </div>
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

      {/* If Report Extracted, Show Results Table */}
      {reportResult ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  Extracted Clinical Document
                </span>
                <h2 className="text-base font-extrabold text-slate-900">{reportResult.reportTitle}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Facility: <span className="font-semibold text-slate-700">{reportResult.facility}</span> • Date: {reportResult.reportDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {reportResult.vitalsExtracted?.glucose && (
                  <button
                    onClick={handleSyncVitals}
                    disabled={vitalsSynced}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                      vitalsSynced
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{vitalsSynced ? 'Vitals Synced to Dashboard' : 'Apply Glucose to Dashboard'}</span>
                  </button>
                )}

                <button
                  onClick={() => setReportResult(null)}
                  className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Analyze Another</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {reportResult.summary}
            </p>
          </div>

          {/* Structured Biomarkers Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Structured Biomarkers & Analytes</h3>
                <p className="text-xs text-slate-500">
                  Extracted values compared against standard laboratory reference intervals
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {reportResult.biomarkers.length} Analytes Identified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="pb-2.5">Test Name</th>
                    <th className="pb-2.5">Category</th>
                    <th className="pb-2.5">Measured Value</th>
                    <th className="pb-2.5">Reference Range</th>
                    <th className="pb-2.5">Flag Status</th>
                    <th className="pb-2.5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportResult.biomarkers.map((bm, idx) => {
                    const isExpanded = expandedBiomarker === bm.name;
                    return (
                      <React.Fragment key={idx}>
                        <tr
                          onClick={() => setExpandedBiomarker(isExpanded ? null : bm.name)}
                          className="hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <td className="py-3 font-bold text-slate-900">{bm.name}</td>
                          <td className="py-3 text-slate-500">{bm.category}</td>
                          <td className="py-3 font-extrabold text-slate-900">
                            {bm.value}{' '}
                            <span className="text-[11px] font-normal text-slate-400">{bm.unit}</span>
                          </td>
                          <td className="py-3 text-slate-500 font-mono text-[11px]">
                            {bm.referenceRange} {bm.unit}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                                bm.status
                              )}`}
                            >
                              {bm.status}
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-400">
                            {isExpanded ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-slate-50/90">
                            <td colSpan={6} className="px-4 py-3 text-slate-700">
                              <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-xs text-slate-900 block mb-0.5">
                                    Clinical Meaning & Interpretation:
                                  </span>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {bm.clinicalMeaning}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Findings & Doctor Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Key Clinical Findings
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {reportResult.keyFindings.map((finding, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-500">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                Questions for Your Next Lab Review
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {reportResult.suggestedDoctorQuestions.map((q, qIdx) => (
                  <li key={qIdx} className="flex items-start gap-2">
                    <span className="font-bold text-purple-600">{qIdx + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Upload & Sample Selector View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sample Reports 1-Click Picker */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                Quick Test Sample Reports
              </h3>
              <p className="text-xs text-slate-500">
                Test structured extraction with realistic pre-loaded clinical panels:
              </p>

              <div className="space-y-2">
                {SAMPLE_REPORTS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`w-full p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedSample.id === sample.id
                        ? 'bg-blue-50/80 border-blue-400 text-blue-950 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-blue-700 uppercase block mb-0.5">
                      {sample.category}
                    </span>
                    <span className="font-bold text-xs block">{sample.title}</span>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {sample.facility}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom File Upload Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-teal-600" />
                Upload Lab File (PDF/Image/Text)
              </h3>
              <label className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-teal-50/30">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Choose file or drag here</span>
                <span className="text-[10px] text-slate-400 mt-0.5">PDF, PNG, JPG, or TXT</span>
                <input
                  type="file"
                  accept=".pdf,image/*,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {fileName && (
                <div className="p-2 bg-slate-100 rounded-lg text-xs text-slate-700 truncate font-mono">
                  {fileName}
                </div>
              )}
            </div>
          </div>

          {/* Raw Text Reviewer & Trigger */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Clinical Laboratory Text</h3>
                <p className="text-xs text-slate-500">
                  Review or edit the raw pathology text before running AI extraction
                </p>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {reportText.length} characters
              </span>
            </div>

            <textarea
              rows={15}
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="w-full p-4 bg-slate-50 font-mono text-xs text-slate-800 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed"
              placeholder="Paste laboratory results, EHR clinical notes, or pathology text..."
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                AI extracts biomarkers into numerical, standardized rows.
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-xs transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Analytes & Reference Ranges...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-blue-200" />
                    <span>Run Structured Biomarker Extraction</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
