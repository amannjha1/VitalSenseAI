/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VitalReading } from '../../types/health';
import { Activity, Calendar, HelpCircle, Info } from 'lucide-react';

interface VitalsChartProps {
  vitals: VitalReading[];
}

type MetricType = 'bp' | 'hr' | 'glucose' | 'spo2';

export const VitalsChart: React.FC<VitalsChartProps> = ({ vitals }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('bp');
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'all'>('30d');
  const [hoveredPoint, setHoveredPoint] = useState<{
    index: number;
    x: number;
    y: number;
    reading: VitalReading;
  } | null>(null);

  // Sort chronological
  const sortedVitals = [...vitals].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Filter based on timeframe
  const displayedVitals =
    timeframe === '7d'
      ? sortedVitals.slice(-7)
      : timeframe === '30d'
      ? sortedVitals.slice(-30)
      : sortedVitals;

  if (displayedVitals.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
        No vital readings recorded yet.
      </div>
    );
  }

  // Chart dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 35, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Compute scales based on selected metric
  let minY = 60;
  let maxY = 160;
  let unit = 'mmHg';
  let title = 'Blood Pressure Trends (Systolic / Diastolic)';

  if (selectedMetric === 'bp') {
    const allVals = displayedVitals.flatMap((v) => [v.systolicBP, v.diastolicBP]);
    minY = Math.max(40, Math.min(...allVals) - 15);
    maxY = Math.max(...allVals) + 15;
    unit = 'mmHg';
    title = 'Blood Pressure Trends (Systolic & Diastolic)';
  } else if (selectedMetric === 'hr') {
    const allVals = displayedVitals.map((v) => v.heartRate);
    minY = Math.max(40, Math.min(...allVals) - 10);
    maxY = Math.max(...allVals) + 10;
    unit = 'BPM';
    title = 'Resting Heart Rate Trends';
  } else if (selectedMetric === 'glucose') {
    const allVals = displayedVitals.map((v) => v.bloodGlucose);
    minY = Math.max(50, Math.min(...allVals) - 15);
    maxY = Math.max(...allVals) + 20;
    unit = 'mg/dL';
    title = 'Fasting Blood Glucose Trends';
  } else if (selectedMetric === 'spo2') {
    minY = 90;
    maxY = 100;
    unit = '%';
    title = 'Blood Oxygen Saturation (SpO2)';
  }

  const getY = (val: number) => {
    return padding.top + graphHeight - ((val - minY) / (maxY - minY)) * graphHeight;
  };

  const getX = (index: number) => {
    if (displayedVitals.length === 1) return padding.left + graphWidth / 2;
    return padding.left + (index / (displayedVitals.length - 1)) * graphWidth;
  };

  // Build SVG path strings
  const systolicPoints = displayedVitals.map((v, i) => `${getX(i)},${getY(v.systolicBP)}`).join(' ');
  const diastolicPoints = displayedVitals.map((v, i) => `${getX(i)},${getY(v.diastolicBP)}`).join(' ');
  const singleMetricPoints = displayedVitals
    .map((v, i) => {
      const val =
        selectedMetric === 'hr' ? v.heartRate : selectedMetric === 'glucose' ? v.bloodGlucose : v.spO2;
      return `${getX(i)},${getY(val)}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
      {/* Header with metric tabs and timeframe filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSelectedMetric('bp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedMetric === 'bp'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Blood Pressure
          </button>
          <button
            onClick={() => setSelectedMetric('hr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedMetric === 'hr'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setSelectedMetric('glucose')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedMetric === 'glucose'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Glucose
          </button>
          <button
            onClick={() => setSelectedMetric('spo2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedMetric === 'spo2'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SpO2
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 mr-1 hidden sm:inline">Range:</span>
          {(['7d', '30d', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium uppercase transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-teal-50 text-teal-700 font-bold border border-teal-200'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas & Legend */}
      <div className="relative">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-slate-800">{title}</span>
          <div className="flex items-center gap-3">
            {selectedMetric === 'bp' ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                  Systolic (Target &lt; 120)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  Diastolic (Target &lt; 80)
                </span>
              </>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                Measured {unit}
              </span>
            )}
          </div>
        </div>

        {/* Responsive SVG Chart */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const yVal = Math.round(minY + pct * (maxY - minY));
              const yPos = getY(yVal);
              return (
                <g key={idx}>
                  <line
                    x1={padding.left}
                    y1={yPos}
                    x2={width - padding.right}
                    y2={yPos}
                    stroke="#E2E8F0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={padding.left - 8}
                    y={yPos + 4}
                    textAnchor="end"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {yVal}
                  </text>
                </g>
              );
            })}

            {/* Target zone band for BP (e.g. 80 - 120) */}
            {selectedMetric === 'bp' && (
              <rect
                x={padding.left}
                y={getY(120)}
                width={graphWidth}
                height={Math.max(0, getY(80) - getY(120))}
                fill="#10B981"
                fillOpacity="0.06"
              />
            )}

            {/* Target zone band for Fasting Glucose (70 - 99 mg/dL) */}
            {selectedMetric === 'glucose' && (
              <rect
                x={padding.left}
                y={getY(99)}
                width={graphWidth}
                height={Math.max(0, getY(70) - getY(99))}
                fill="#10B981"
                fillOpacity="0.08"
              />
            )}

            {/* Polyline Paths */}
            {selectedMetric === 'bp' ? (
              <>
                {/* Systolic Line */}
                <polyline
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={systolicPoints}
                />
                {/* Diastolic Line */}
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={diastolicPoints}
                />
              </>
            ) : (
              <polyline
                fill="none"
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={singleMetricPoints}
              />
            )}

            {/* Interactive Data Points */}
            {displayedVitals.map((reading, index) => {
              const xPos = getX(index);
              const sysY = getY(reading.systolicBP);
              const diaY = getY(reading.diastolicBP);
              const singleY = getY(
                selectedMetric === 'hr'
                  ? reading.heartRate
                  : selectedMetric === 'glucose'
                  ? reading.bloodGlucose
                  : reading.spO2
              );

              return (
                <g key={reading.id}>
                  {selectedMetric === 'bp' ? (
                    <>
                      <circle
                        cx={xPos}
                        cy={sysY}
                        r="4"
                        className="fill-teal-700 stroke-white stroke-2 cursor-pointer hover:r-6 transition-all"
                        onMouseEnter={() =>
                          setHoveredPoint({ index, x: xPos, y: sysY, reading })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <circle
                        cx={xPos}
                        cy={diaY}
                        r="3.5"
                        className="fill-blue-600 stroke-white stroke-2 cursor-pointer hover:r-5 transition-all"
                        onMouseEnter={() =>
                          setHoveredPoint({ index, x: xPos, y: diaY, reading })
                        }
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    </>
                  ) : (
                    <circle
                      cx={xPos}
                      cy={singleY}
                      r="4"
                      className="fill-teal-700 stroke-white stroke-2 cursor-pointer hover:r-6 transition-all"
                      onMouseEnter={() =>
                        setHoveredPoint({ index, x: xPos, y: singleY, reading })
                      }
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  )}

                  {/* Date labels on X-axis */}
                  <text
                    x={xPos}
                    y={height - 8}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400 font-mono"
                  >
                    {new Date(reading.timestamp).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover inspection tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none bg-slate-900 text-white text-[11px] px-3 py-2 rounded-xl shadow-xl border border-slate-700 -translate-x-1/2 -translate-y-16"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${hoveredPoint.y}px`,
            }}
          >
            <div className="font-semibold text-teal-300">
              {new Date(hoveredPoint.reading.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}{' '}
              {new Date(hoveredPoint.reading.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            {selectedMetric === 'bp' ? (
              <div className="font-bold text-white text-xs mt-0.5">
                {hoveredPoint.reading.systolicBP}/{hoveredPoint.reading.diastolicBP} mmHg
              </div>
            ) : selectedMetric === 'hr' ? (
              <div className="font-bold text-white text-xs mt-0.5">
                {hoveredPoint.reading.heartRate} BPM
              </div>
            ) : selectedMetric === 'glucose' ? (
              <div className="font-bold text-white text-xs mt-0.5">
                {hoveredPoint.reading.bloodGlucose} mg/dL
              </div>
            ) : (
              <div className="font-bold text-white text-xs mt-0.5">
                {hoveredPoint.reading.spO2}% SpO2
              </div>
            )}
            {hoveredPoint.reading.notes && (
              <div className="text-[10px] text-slate-300 mt-1 max-w-[180px] truncate">
                "{hoveredPoint.reading.notes}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
