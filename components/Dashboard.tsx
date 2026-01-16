import React, { useMemo, useState } from 'react';
import { Feedback } from '../types';
import { AlertIcon, ChartBarIcon, HeartIcon, UsersIcon } from './Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface DashboardProps {
  feedbacks: Feedback[];
}

const COLORS = ['#10B981', '#FBBF24', '#EF4444']; // Green, Yellow, Red

const Dashboard: React.FC<DashboardProps> = ({ feedbacks }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  // --- Derived Statistics ---
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const avgRating = total > 0 
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) 
      : '0.0';
    
    // Calculate Net Sentiment (Positive % - Negative %)
    const pos = feedbacks.filter(f => f.analysis?.sentimentLabel === 'Positive').length;
    const neg = feedbacks.filter(f => f.analysis?.sentimentLabel === 'Negative').length;
    const netSentiment = total > 0 ? Math.round(((pos - neg) / total) * 100) : 0;

    const clinicalFlags = feedbacks.filter(f => f.analysis?.clinicalFlags).length;

    return { total, avgRating, netSentiment, clinicalFlags };
  }, [feedbacks]);

  // --- Chart Data ---
  const sentimentData = useMemo(() => {
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    feedbacks.forEach(f => {
      if (f.analysis) counts[f.analysis.sentimentLabel]++;
    });
    return [
      { name: 'Positive', value: counts.Positive },
      { name: 'Neutral', value: counts.Neutral },
      { name: 'Negative', value: counts.Negative },
    ];
  }, [feedbacks]);

  const themeData = useMemo(() => {
    const themes: Record<string, number> = {};
    feedbacks.forEach(f => {
      f.analysis?.keyThemes.forEach(theme => {
        themes[theme] = (themes[theme] || 0) + 1;
      });
    });
    return Object.entries(themes)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 themes
  }, [feedbacks]);

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600 mr-4">
            <UsersIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Feedback</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-teal-50 rounded-lg text-teal-600 mr-4">
            <HeartIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Avg Rating</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.avgRating} <span className="text-sm font-normal text-gray-400">/ 5.0</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600 mr-4">
            <ChartBarIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Net Sentiment</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.netSentiment > 0 ? '+' : ''}{stats.netSentiment}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
          <div className={`p-3 rounded-lg mr-4 ${stats.clinicalFlags > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'}`}>
            <AlertIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Clinical Flags</p>
            <h3 className={`text-2xl font-bold ${stats.clinicalFlags > 0 ? 'text-red-600' : 'text-gray-900'}`}>{stats.clinicalFlags}</h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Charts Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sentiment Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Sentiment Distribution</h3>
             <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="ml-8 space-y-2">
                   {sentimentData.map((entry, index) => (
                     <div key={index} className="flex items-center">
                       <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }}></div>
                       <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Topics Bar Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4">Top Recurring Themes</h3>
             <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={themeData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={100} tick={{fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" fill="#0D9488" radius={[0, 4, 4, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

        {/* Feedback List Column */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Recent Feedback</h3>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {feedbacks.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedFeedback(item)}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  selectedFeedback?.id === item.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-100 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-800 text-sm">{item.patientName}</span>
                  <span className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 text-xs">
                     {[...Array(5)].map((_, i) => (
                       <span key={i}>{i < item.rating ? '★' : '☆'}</span>
                     ))}
                  </div>
                  {item.analysis?.clinicalFlags && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded-full">Flag</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Modal/Detail View */}
      {selectedFeedback && selectedFeedback.analysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
               <div>
                 <h2 className="text-xl font-bold text-gray-900">Feedback Analysis</h2>
                 <p className="text-sm text-gray-500">From {selectedFeedback.patientName} on {new Date(selectedFeedback.date).toLocaleDateString()}</p>
               </div>
               <button 
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
               >
                 ✕
               </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Original Text */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Patient Voice</h4>
                <p className="text-gray-800 italic">"{selectedFeedback.text}"</p>
              </div>

              {/* AI Insight Grid */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase">Sentiment Score</span>
                    <div className="text-3xl font-bold text-blue-900 mt-1">{selectedFeedback.analysis.sentimentScore}<span className="text-lg font-normal text-blue-400">/100</span></div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-white text-blue-600 border border-blue-100">
                      {selectedFeedback.analysis.sentimentLabel}
                    </span>
                 </div>
                 <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                    <span className="text-xs font-bold text-indigo-600 uppercase">Key Themes</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {selectedFeedback.analysis.keyThemes.map(theme => (
                         <span key={theme} className="px-2 py-1 bg-white text-indigo-700 text-xs rounded border border-indigo-100">{theme}</span>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-1 h-4 bg-teal-500 mr-2 rounded-full"></span>
                  AI Summary
                </h4>
                <p className="text-gray-700 leading-relaxed">{selectedFeedback.analysis.summary}</p>
              </div>

               {/* Actionable Insights */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="w-1 h-4 bg-amber-500 mr-2 rounded-full"></span>
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {selectedFeedback.analysis.actionableInsights.map((insight, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">{idx + 1}</span>
                      <span className="text-gray-700 text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

               {/* Clinical Flags */}
               {selectedFeedback.analysis.clinicalFlags && (
                 <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertIcon className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Clinical Attention Required</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>The system detected language indicating potential medical complications or severe regression. Please review this patient's case immediately.</p>
                        </div>
                      </div>
                    </div>
                 </div>
               )}

            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
              <button 
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm"
              >
                Close Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
