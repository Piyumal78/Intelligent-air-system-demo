import React from 'react';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GaugeCard = ({ title, value, unit, status }) => {
    const getColor = () => {
        switch (status) {
            case "Good": return "#2DD4BF";      // teal-400 (Calm Green)
            case "Moderate": return "#FBBF24";  // amber-400 (Warm Yellow)
            case "Bad": return "#FB7185";        // rose-400 (Soft Red)
            case "Danger": return "#E11D48";     // rose-600 (Deep Red)
            default: return "#94A3B8";           // slate-400
        }
    };

    const getStatusStyle = () => {
        switch (status) {
            case "Good": return "bg-teal-50 text-teal-600 border-teal-100";
            case "Moderate": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Bad": return "bg-rose-50 text-rose-600 border-rose-100";
            case "Danger": return "bg-rose-100 text-rose-700 border-rose-200 animate-pulse";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    }

    return (
        <div className="bg-white rounded-3xl p-6 flex flex-col items-center border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6">{title}</h2>

            <div className="w-36 h-36 relative mb-4">
                <CircularProgressbar
                    value={value}
                    maxValue={100}
                    text={`${value}`}
                    strokeWidth={8}
                    styles={buildStyles({
                        pathColor: getColor(),
                        textColor: "#334155", // slate-700
                        trailColor: "#F1F5F9", // slate-100
                        pathTransitionDuration: 1.5,
                        textSize: '22px',
                        backgroundColor: '#3e98c7',
                    })}
                />
                <div className="absolute bottom-8 w-full text-center">
                    <span className="text-xs font-bold text-slate-300">{unit}</span>
                </div>
            </div>

            <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle()}`}>
                {status}
            </div>
        </div>
    );
};

export default GaugeCard;
