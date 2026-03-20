import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const GasChart = ({ title }) => {
    // Mock data
    const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    color: '#64748b', // slate-500
                    font: { size: 12, family: "'Inter', sans-serif" }
                }
            },
            tooltip: {
                backgroundColor: '#ffffff',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                cornerRadius: 12,
                displayColors: true,
                boxPadding: 4,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#94a3b8' }
            },
            y: {
                border: { display: false },
                grid: { color: '#f1f5f9', drawBorder: false }, // Very subtle grid
                ticks: { font: { size: 11 }, color: '#94a3b8', padding: 10 }
            }
        },
        elements: {
            line: { tension: 0.4, borderWidth: 3 },
            point: { radius: 0, hoverRadius: 6, hoverBorderWidth: 3 }
        }
    };

    const data = {
        labels,
        datasets: [
            {
                label: 'LPG',
                data: [65, 59, 80, 81, 56, 55, 40],
                borderColor: '#2DD4BF', // Teal-400
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(45, 212, 191, 0.2)');
                    gradient.addColorStop(1, 'rgba(45, 212, 191, 0.0)');
                    return gradient;
                },
                fill: true,
            },
            {
                label: 'CO',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: '#FBBF24', // Amber-400
                backgroundColor: 'transparent',
                fill: false,
            },
            {
                label: 'H₂',
                data: [15, 25, 35, 20, 45, 30, 25],
                borderColor: '#38BDF8', // Sky-400
                backgroundColor: 'transparent',
                fill: false,
            },
        ],
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 h-[420px]">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-700">{title || "Air Quality Trends"}</h3>
                    <p className="text-sm text-slate-400 mt-1">Real-time gas concentration levels</p>
                </div>

                <div className="bg-slate-50 p-1 rounded-xl flex gap-1">
                    {['1H', '24H', '7D'].map((period) => (
                        <button
                            key={period}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${period === '24H'
                                    ? 'bg-white text-slate-700 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-[300px] w-full">
                <Line options={options} data={data} />
            </div>
        </div>
    );
};

export default GasChart;
