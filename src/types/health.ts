/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TriageLevel = 'EMERGENCY' | 'URGENT_CARE' | 'PRIMARY_CARE' | 'SELF_MONITOR';

export type BiomarkerStatus = 'NORMAL' | 'BORDERLINE' | 'ELEVATED' | 'LOW' | 'CRITICAL';

export type RiskLevel = 'Optimal' | 'Borderline' | 'Elevated' | 'High';

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  bloodType: string;
  heightCm: number;
  weightKg: number;
  occupation: string;
  allergies: string[];
  chronicConditions: string[];
  medications: { name: string; dosage: string; frequency: string }[];
  primaryCarePhysician: string;
  emergencyContact: { name: string; relation: string; phone: string };
  avatarUrl: string;
}

export interface VitalReading {
  id: string;
  timestamp: string;
  systolicBP: number;
  diastolicBP: number;
  heartRate: number;
  bloodGlucose: number; // mg/dL
  spO2: number; // %
  weightKg: number;
  temperatureC?: number;
  sleepHours?: number;
  stepsCount?: number;
  notes?: string;
}

export interface SymptomAssessmentInput {
  primaryComplaint: string;
  duration: string;
  severity: number; // 1 - 10
  bodyRegion: string;
  onset: 'sudden' | 'gradual';
  aggravatingFactors?: string;
  relievingFactors?: string;
  associatedSymptoms: string[];
  patientContext?: {
    age: number;
    gender: string;
    chronicConditions: string[];
    medications: string[];
    recentVitals?: {
      bp?: string;
      hr?: number;
      temp?: number;
    };
  };
}

export interface DifferentialCondition {
  condition: string;
  likelihood: 'High' | 'Moderate' | 'Low';
  description: string;
  keyFactors: string[];
}

export interface SymptomAssessmentResult {
  id: string;
  timestamp: string;
  isEmergency: boolean;
  emergencyAlert: string | null;
  triageLevel: TriageLevel;
  clinicalRationale: string;
  possibleDifferential: DifferentialCondition[];
  uncertaintyScore: {
    confidencePercentage: number;
    reason: string;
    missingDataPoints: string[];
  };
  immediateNextSteps: string[];
  doctorQuestions: string[];
  selfCareMeasures: string[];
  redFlagsToWatchFor: string[];
  disclaimer: string;
}

export interface HealthRiskInput {
  age: number;
  gender: string;
  systolicBP: number;
  diastolicBP: number;
  restingHeartRate: number;
  bmi: number;
  fastingGlucose?: number;
  hba1c?: number;
  totalCholesterol?: number;
  hdl?: number;
  ldl?: number;
  triglycerides?: number;
  isSmoker: boolean;
  physicalActivityMinutesPerWeek: number;
  sleepHoursPerNight: number;
  stressLevel: 'low' | 'moderate' | 'high';
  familyHistoryOfCVD: boolean;
  familyHistoryOfDiabetes: boolean;
}

export interface ModifiableFactor {
  factor: string;
  current: string;
  target: string;
  potentialRiskReduction: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface HealthRiskAnalysisResult {
  overallHealthScore: number; // 0 - 100
  cardiovascularRisk: {
    scorePercentage: number;
    category: RiskLevel;
    interpretation: string;
    keyDrivers: string[];
  };
  metabolicRisk: {
    scorePercentage: number;
    category: RiskLevel;
    interpretation: string;
    keyDrivers: string[];
  };
  lifestyleScore: {
    score: number;
    grade: string;
    sleepEvaluation: string;
    activityEvaluation: string;
  };
  modifiableFactors: ModifiableFactor[];
  aiClinicalSummary: string;
  preventiveActionItems: string[];
  screeningRecommendations: {
    test: string;
    frequency: string;
    justification: string;
    status: 'Due' | 'Up to date' | 'Recommended soon';
  }[];
}

export interface Biomarker {
  name: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  status: BiomarkerStatus;
  clinicalMeaning: string;
  category: 'Lipid' | 'Metabolic' | 'Hematology' | 'Renal' | 'Hepatic' | 'Cardiovascular' | 'Electrolyte' | 'Other';
}

export interface MedicalReportAnalysisResult {
  id: string;
  reportDate: string;
  reportTitle: string;
  facility: string;
  summary: string;
  biomarkers: Biomarker[];
  keyFindings: string[];
  potentialCauses: string[];
  suggestedDoctorQuestions: string[];
  recommendedFollowUpDays: number;
  vitalsExtracted?: {
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    glucose?: number;
    bmi?: number;
  };
}

export interface PreventionHabit {
  id: string;
  title: string;
  category: 'Nutrition' | 'Activity' | 'Sleep' | 'Cardio' | 'Screening';
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
  impactPoints: number;
  completed: boolean;
  evidenceNote: string;
}

export interface PreventionPlan {
  summary: string;
  nutritionRoadmap: {
    dietaryPattern: string;
    keyFoodsToPrioritize: string[];
    foodsToModerate: string[];
    hydrationTargetLiters: number;
    clinicalRationale: string;
  };
  exercisePrescription: {
    aerobicTargetMinutesPerWeek: number;
    intensityLevel: string;
    resistanceTrainingDaysPerWeek: number;
    recommendedActivities: string[];
    cardioSafetyNote: string;
  };
  sleepAndCircadianProtocol: {
    targetHours: string;
    windDownRoutine: string[];
    circadianTips: string[];
  };
  clinicalScreenings: {
    milestone: string;
    timeframe: string;
    guidelineSource: string;
    importance: string;
  }[];
  dailyHabits: PreventionHabit[];
}
