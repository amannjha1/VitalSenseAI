/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Salad,
  Dumbbell,
  Moon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PatientProfile, VitalReading, PreventionPlan, PreventionHabit } from '../../types/health';
import { fetchPreventionPlan } from '../../services/healthApi';

interface PreventiveCareViewProps {
  patient: PatientProfile;
  latestVital?: VitalReading;
}

export const PreventiveCareView: React.FC<PreventiveCareViewProps> = ({
  patient,
  latestVital,
}) => {
  const [plan, setPlan] = useState<PreventionPlan | null>(null);
  const [habits, setHabits] = useState<PreventionHabit[]>([]);
  const [streakDays, setStreakDays] = useState<number>(5);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadPlan = async () => {
      setIsLoading(true);
      try {
        const res = await fetchPreventionPlan({
          patientProfile: patient,
          vitals: latestVital || {},
        });
        setPlan(res);
        setHabits(res.dailyHabits || []);
      } catch (err) {
        console.error('Failed to load prevention plan:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPlan();
  }, [patient.id]);

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h))
    );
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const totalScoreEarned = habits
    .filter((h) => h.completed)
    .reduce((sum, h) => sum + h.impactPoints, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Personalized Preventive Care & Longevity Protocol
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                  30-Day Clinical Plan
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Evidence-based lifestyle interventions targeting blood pressure stabilization and glycemic homeostasis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-xs">
              <Flame className="w-4 h-4 text-amber-600 animate-pulse" />
              <span className="font-extrabold text-amber-900">{streakDays} Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 rounded-xl border border-teal-200 text-xs">
              <Award className="w-4 h-4 text-teal-600" />
              <span className="font-extrabold text-teal-900">{totalScoreEarned} Health Points</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-700">
            Tailoring clinical prevention plan based on {patient.name}'s hemodynamics...
          </p>
        </div>
      ) : plan ? (
        <div className="space-y-6">
          {/* Daily Interactive Habit Tracker */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Today's Clinical Habit Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Micro-actions with proven clinical impact on blood pressure and insulin sensitivity
                </p>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-slate-900">
                  {completedCount} / {habits.length} Completed
                </span>
                <div className="w-32 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${habits.length ? (completedCount / habits.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 transition cursor-pointer ${
                    habit.completed
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 hover:bg-white text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded accent-teal-600 w-4 h-4"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-bold text-xs ${
                          habit.completed ? 'line-through text-emerald-800' : 'text-slate-900'
                        }`}
                      >
                        {habit.title}
                      </span>
                      <span className="text-[10px] font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                        +{habit.impactPoints} pts
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {habit.timeOfDay} • {habit.category}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                      {habit.evidenceNote}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pillars of Prevention: Nutrition, Exercise, Sleep */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Nutrition Roadmap */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Salad className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Nutritional Prescription
                  </h4>
                  <p className="text-[11px] text-emerald-700 font-semibold">
                    {plan.nutritionRoadmap.dietaryPattern}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {plan.nutritionRoadmap.clinicalRationale}
              </p>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Foods to Prioritize
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {plan.nutritionRoadmap.keyFoodsToPrioritize.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Daily Hydration Target:</span>
                <span className="font-bold text-slate-800">
                  {plan.nutritionRoadmap.hydrationTargetLiters} Liters
                </span>
              </div>
            </div>

            {/* 2. Physical Activity Prescription */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Exercise Prescription
                  </h4>
                  <p className="text-[11px] text-blue-700 font-semibold">
                    {plan.exercisePrescription.aerobicTargetMinutesPerWeek} mins weekly
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {plan.exercisePrescription.intensityLevel}
              </p>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Recommended Activities
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {plan.exercisePrescription.recommendedActivities.map((act, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-tight">
                <strong>Safety Rule:</strong> {plan.exercisePrescription.cardioSafetyNote}
              </div>
            </div>

            {/* 3. Sleep & Circadian Protocol */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    Sleep & Circadian Protocol
                  </h4>
                  <p className="text-[11px] text-purple-700 font-semibold">
                    Target: {plan.sleepAndCircadianProtocol.targetHours}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Evening Wind-Down Routine
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {plan.sleepAndCircadianProtocol.windDownRoutine.map((step, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Circadian Rhythm Anchors
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {plan.sleepAndCircadianProtocol.circadianTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Clinical Screening Milestones */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Recommended USPSTF Preventive Screening Timeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {plan.clinicalScreenings.map((screen, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{screen.milestone}</span>
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                      {screen.timeframe}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{screen.importance}</p>
                  <span className="text-[10px] text-slate-400 font-mono block pt-1">
                    Source: {screen.guidelineSource}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
