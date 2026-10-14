/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  SymptomAssessmentInput,
  SymptomAssessmentResult,
  HealthRiskInput,
  HealthRiskAnalysisResult,
  MedicalReportAnalysisResult,
  PreventionPlan,
  PatientProfile,
} from '../types/health';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

export async function submitSymptomAssessment(
  input: SymptomAssessmentInput
): Promise<SymptomAssessmentResult> {
  const res = await fetch('/api/assess-symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Symptom assessment failed: ${res.statusText}`);
  }

  const result: SymptomAssessmentResult = await res.json();

  // Try optional persistence to Firebase Firestore
  try {
    const assessmentsCol = collection(db, 'symptom_assessments');
    await addDoc(assessmentsCol, {
      ...result,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore optional sync not available (non-fatal):', err);
  }

  return result;
}

export async function submitRiskAnalysis(
  input: HealthRiskInput
): Promise<HealthRiskAnalysisResult> {
  const res = await fetch('/api/analyze-risk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(`Risk analysis failed: ${res.statusText}`);
  }

  const result: HealthRiskAnalysisResult = await res.json();

  try {
    const riskCol = collection(db, 'health_risk_analyses');
    await addDoc(riskCol, {
      ...result,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore optional sync not available (non-fatal):', err);
  }

  return result;
}

export async function submitReportAnalysis(payload: {
  reportText?: string;
  fileBase64?: string;
  fileMimeType?: string;
}): Promise<MedicalReportAnalysisResult> {
  const res = await fetch('/api/analyze-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Report analysis failed: ${res.statusText}`);
  }

  const result: MedicalReportAnalysisResult = await res.json();

  try {
    const reportsCol = collection(db, 'medical_reports');
    await addDoc(reportsCol, {
      ...result,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Firestore optional sync not available (non-fatal):', err);
  }

  return result;
}

export async function fetchPreventionPlan(payload: {
  patientProfile: PatientProfile;
  vitals: any;
  riskData?: any;
}): Promise<PreventionPlan> {
  const res = await fetch('/api/generate-prevention-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Prevention plan generation failed: ${res.statusText}`);
  }

  return res.json();
}
