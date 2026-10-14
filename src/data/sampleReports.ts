/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SampleReport {
  id: string;
  title: string;
  category: string;
  date: string;
  facility: string;
  rawText: string;
}

export const SAMPLE_REPORTS: SampleReport[] = [
  {
    id: 'sample-cmp-lipid',
    title: 'Comprehensive Metabolic Panel (CMP) & Advanced Lipid Panel',
    category: 'Metabolic & Cardiovascular',
    date: '2026-09-28',
    facility: 'Quest Diagnostics — Metropolitan Medical Plaza',
    rawText: `QUEST DIAGNOSTICS - CLINICAL LABORATORY REPORT
Specimen ID: QD-99214-B
Patient: Sarah Chen | DOB: 1984-06-18 | Sex: Female
Ordering Physician: Rebecca Martinez, MD
Collection Date/Time: 2026-09-28 07:45 AM EDT
Fasting Status: FASTING (12 hours)

================================================================
TEST NAME                     RESULT     REFERENCE RANGE   UNITS    FLAG
================================================================
-- COMPREHENSIVE METABOLIC PANEL --
Glucose, Fasting              112        65 - 99          mg/dL    HIGH [H]
Urea Nitrogen (BUN)           16         7 - 20           mg/dL
Creatinine, Serum             0.84       0.55 - 1.02      mg/dL
eGFR (CKD-EPI)                98         > 60             mL/min/1.73m2
Sodium                        140        135 - 145        mmol/L
Potassium                     4.3        3.5 - 5.1        mmol/L
Chloride                      102        98 - 107         mmol/L
Carbon Dioxide (CO2)          25         22 - 29          mmol/L
Calcium                       9.4        8.6 - 10.3       mg/dL
Protein, Total                7.1        6.1 - 8.1        g/dL
Albumin                       4.4        3.6 - 5.1        g/dL
Bilirubin, Total              0.6        0.2 - 1.2        mg/dL
Alkaline Phosphatase (ALP)    68         35 - 104         U/L
AST (SGOT)                    24         10 - 35          U/L
ALT (SGPT)                    38         7 - 35           U/L      BORDERLINE [H]

-- LIPID PANEL WITH TOTAL/HDL RATIO --
Cholesterol, Total            218        125 - 200        mg/dL    HIGH [H]
Triglycerides                 165        < 150            mg/dL    BORDERLINE [H]
HDL Cholesterol               49         > 50             mg/dL    LOW [L]
LDL Cholesterol (Calc)        136        < 100            mg/dL    HIGH [H]
Non-HDL Cholesterol           169        < 130            mg/dL    HIGH [H]
Chol / HDL Ratio              4.45       < 4.0

-- GLYCEMIC MARKER --
Hemoglobin A1c (HbA1c)        5.9        4.0 - 5.6        %        HIGH [H]
Estimated Average Glucose     123        70 - 114         mg/dL    HIGH [H]

NOTES:
1. Fasting Glucose 112 mg/dL and HbA1c 5.9% are consistent with impaired glucose tolerance (Pre-diabetes).
2. Elevated LDL-C and low HDL indicate mild dyslipidemia. Recommend lifestyle modification and 3-month re-check.`,
  },
  {
    id: 'sample-cbc-diff',
    title: 'Complete Blood Count (CBC) with Automated Differential',
    category: 'Hematology',
    date: '2026-08-14',
    facility: 'Labcorp Regional Center',
    rawText: `LABCORP CLINICAL PATHOLOGY REPORT
Patient: Sarah Chen | Age: 42 | Gender: F
Ordering Provider: Rebecca Martinez, MD
Collection Date: 2026-08-14 08:30 AM

TEST NAME                     RESULT     REFERENCE RANGE   UNITS    FLAG
-------------------------------------------------------------------------
White Blood Cell (WBC)        6.8        4.0 - 11.0       x10E3/uL
Red Blood Cell (RBC)          4.12       3.90 - 5.20      x10E6/uL
Hemoglobin                    12.1       12.0 - 16.0      g/dL     BORDERLINE
Hematocrit                    36.2       35.0 - 47.0      %
MCV                           82.0       80.0 - 100.0     fL
MCH                           27.1       27.0 - 33.0      pg
MCHC                          33.4       31.5 - 35.7      g/dL
RDW                           13.2       11.5 - 15.0      %
Platelets                     242        150 - 450        x10E3/uL

DIFFERENTIAL:
Neutrophils (Absolute)        4.1        1.8 - 7.7        x10E3/uL
Lymphocytes (Absolute)        2.0        1.0 - 4.8        x10E3/uL
Monocytes (Absolute)          0.5        0.2 - 0.8        x10E3/uL
Eosinophils (Absolute)        0.1        0.0 - 0.4        x10E3/uL
Basophils (Absolute)          0.04       0.0 - 0.2        x10E3/uL

FERRITIN & IRON PANEL:
Ferritin, Serum               22         15 - 150         ng/mL    LOW NORMAL
Iron, Total                   62         50 - 170         ug/dL
Total Iron Binding Capacity   385        250 - 425        ug/dL
Transferrin Saturation        16.1       15.0 - 50.0      %

INTERPRETATION:
CBC parameters are within normal limits with borderline-low iron storage (ferritin 22 ng/mL). Suggest dietary iron intake review.`,
  },
  {
    id: 'sample-cardiac-risk',
    title: 'Advanced Cardiometabolic Biomarkers & Inflammation Panel',
    category: 'Cardiovascular Risk',
    date: '2026-07-19',
    facility: 'CardioVascular Health Institute Labs',
    rawText: `CARDIOVASCULAR HEALTH SPECIALTY LABORATORY
Patient: Marcus Vance | Age: 58 | Sex: Male
Referring Cardiologist: Dr. Arthur Sterling, MD, FACC
Status: Post-Percutaneous Coronary Intervention (PCI) Monitoring

BIOMARKER                     RESULT     TARGET / REF     UNITS    STATUS
-------------------------------------------------------------------------
Apolipoprotein B (ApoB)       82         < 80             mg/dL    BORDERLINE
High-Sens. CRP (hs-CRP)       2.1        < 1.0 (Low Risk) mg/L     MODERATE RISK
Lipoprotein(a) [Lp(a)]        48         < 75             nmol/L   OPTIMAL
Fasting Insulin               14.2       2.0 - 19.6       uIU/mL   NORMAL
HOMA-IR Score                 2.8        < 2.0            index    ELEVATED
NT-proBNP                     92         < 125            pg/mL    NORMAL (No HF)
eGFR                          84         > 60             mL/min   NORMAL
Troponin I (High Sens)        < 4.0      < 14.0           ng/L     NORMAL

CLINICAL IMPRESSION:
Patient is on high-intensity Statin therapy. ApoB is near goal (82 mg/dL vs target < 80 mg/dL).
hs-CRP of 2.1 mg/L demonstrates residual systemic inflammatory activity.
HOMA-IR suggests mild insulin resistance. Continue cardiac rehab aerobic regimen and Mediterranean nutritional protocol.`,
  },
];
