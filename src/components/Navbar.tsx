/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  Heart,
  Stethoscope,
  FileSpreadsheet,
  CalendarCheck,
  ChevronDown,
  Printer,
  Shield,
  PhoneCall,
  User,
  PlusCircle,
  Database,
} from 'lucide-react';
import { PatientProfile } from '../types/health';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  patients: PatientProfile[];
  selectedPatient: PatientProfile;
  onSelectPatient: (patient: PatientProfile) => void;
  onOpenDoctorPrep: () => void;
  onOpenEmergency: () => void;
  onOpenDisclaimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  patients,
  selectedPatient,
  onSelectPatient,
  onOpenDoctorPrep,
  onOpenEmergency,
  onOpenDisclaimer,
}) => {
  const [patientMenuOpen, setPatientMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Vitals & Dashboard', icon: Activity },
    { id: 'symptoms', label: 'AI Symptom Triage', icon: Stethoscope },
    { id: 'risk', label: 'Health Risk Engine', icon: Heart },
    { id: 'reports', label: 'Lab Report Extraction', icon: FileSpreadsheet },
    { id: 'prevention', label: 'Preventive Roadmap', icon: CalendarCheck },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-900 via-teal-900 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-900/10 group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 text-teal-400 animate-pulse-subtle" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">VitalSense</span>
                  <span className="text-teal-600 font-extrabold text-lg tracking-tight">AI</span>
                  <span className="text-[10px] bg-teal-50 text-teal-700 font-bold px-1.5 py-0.5 rounded border border-teal-200/80">
                    CLINICAL
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Health Assessment & Telemetry</p>
              </div>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utility Bar: Patient Switcher & Action buttons */}
          <div className="flex items-center gap-2.5">
            {/* Patient Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setPatientMenuOpen(!patientMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-teal-500 bg-slate-50/80 hover:bg-white transition cursor-pointer"
              >
                <img
                  src={selectedPatient.avatarUrl}
                  alt={selectedPatient.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-300"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {selectedPatient.name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[110px]">
                    {selectedPatient.age}y • {selectedPatient.gender}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {patientMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setPatientMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Switch Clinical Profile
                      </span>
                    </div>

                    <div className="py-1 space-y-1">
                      {patients.map((pat) => (
                        <button
                          key={pat.id}
                          onClick={() => {
                            onSelectPatient(pat);
                            setPatientMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition cursor-pointer ${
                            selectedPatient.id === pat.id
                              ? 'bg-teal-50/80 border border-teal-200/80'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <img
                            src={pat.avatarUrl}
                            alt={pat.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900">{pat.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {pat.age}y • {pat.chronicConditions[0] || 'Preventive tracking'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 mt-1 px-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 px-2 py-1">
                        <span className="flex items-center gap-1">
                          <Database className="w-3 h-3 text-teal-600" />
                          Firebase: Connected
                        </span>
                        <span className="font-mono text-[9px] text-slate-400">vitalsenseai-d2a8f</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Doctor prep sheet button */}
            <button
              onClick={onOpenDoctorPrep}
              title="Printable Consultation Prep Brief"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Doctor Prep</span>
            </button>

            {/* Emergency button */}
            <button
              onClick={onOpenEmergency}
              title="Emergency Protocol & Red Flags"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Emergency</span>
            </button>

            {/* Disclaimer modal trigger */}
            <button
              onClick={onOpenDisclaimer}
              title="Clinical safety and privacy disclosures"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <Shield className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex items-center overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
