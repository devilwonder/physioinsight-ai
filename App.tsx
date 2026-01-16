import React, { useState, useEffect } from 'react';
import FeedbackForm from './components/FeedbackForm';
import Dashboard from './components/Dashboard';
import { Feedback } from './types';
import { analyzeFeedback } from './services/geminiService';

// --- MOCK DATA FOR DEMO PURPOSES ---
const INITIAL_DATA: Feedback[] = [
  {
    id: '1',
    patientName: 'Sarah M.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    rating: 5,
    text: "The new exercises have really helped my lower back pain. I feel much more mobile in the mornings now.",
    status: 'analyzed',
    analysis: {
      sentimentScore: 92,
      sentimentLabel: 'Positive',
      keyThemes: ['Mobility', 'Back Pain', 'Exercises'],
      summary: 'Patient reports significant improvement in mobility and pain reduction due to new exercise regimen.',
      actionableInsights: ['Continue current progression', 'Ask about morning stiffness levels in next session'],
      clinicalFlags: false
    }
  },
  {
    id: '2',
    patientName: 'John D.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    rating: 3,
    text: "The session was okay, but I felt a sharp pain in my knee during the squats. The therapist was busy with another patient so I couldn't ask about it.",
    status: 'analyzed',
    analysis: {
      sentimentScore: 40,
      sentimentLabel: 'Negative',
      keyThemes: ['Knee Pain', 'Staff Availability', 'Safety'],
      summary: 'Patient experienced knee pain during squats and could not communicate it due to therapist unavailability.',
      actionableInsights: ['Review squat form immediately', 'Ensure supervision during high-risk exercises'],
      clinicalFlags: true
    }
  },
  {
    id: '3',
    patientName: 'Anonymous',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    rating: 4,
    text: "Great facility, very clean. The receptionist was very friendly. Waiting time was a bit long though.",
    status: 'analyzed',
    analysis: {
      sentimentScore: 75,
      sentimentLabel: 'Positive',
      keyThemes: ['Facility Hygiene', 'Staff Courtesy', 'Wait Times'],
      summary: 'Positive feedback on facility and staff, with a minor complaint about wait times.',
      actionableInsights: ['Monitor scheduling gaps', 'Pass praise to reception team'],
      clinicalFlags: false
    }
  }
];

function App() {
  const [view, setView] = useState<'patient' | 'therapist'>('therapist');
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(INITIAL_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const handleFeedbackSubmit = async (text: string, rating: number, name: string) => {
    setIsAnalyzing(true);
    setNotification(null);

    try {
      // 1. Create a temp object
      const newId = Date.now().toString();
      const newFeedback: Feedback = {
        id: newId,
        patientName: name,
        date: new Date().toISOString(),
        rating,
        text,
        status: 'processing'
      };

      // 2. Perform AI Analysis
      const analysis = await analyzeFeedback(text, rating);

      // 3. Update with results
      const analyzedFeedback: Feedback = {
        ...newFeedback,
        status: 'analyzed',
        analysis
      };

      setFeedbacks(prev => [analyzedFeedback, ...prev]);
      setNotification({ message: 'Feedback received and analyzed successfully!', type: 'success' });

      // Optional: Auto-switch to dashboard to see result after a delay
      setTimeout(() => {
        setView('therapist');
      }, 2000);

    } catch (e) {
      setNotification({ message: 'Error processing feedback. Please try again.', type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">PhysioInsight AI</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('patient')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'patient'
                    ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Patient View
              </button>
              <button
                onClick={() => setView('therapist')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'therapist'
                    ? 'bg-teal-50 text-teal-700 ring-1 ring-teal-600/20'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
              >
                Therapist Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Notification Toast */}
        {notification && (
          <div className={`fixed top-20 right-4 p-4 rounded-lg shadow-lg text-white font-medium transform transition-all duration-500 z-50 flex items-center ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
            {notification.type === 'success' && (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            )}
            {notification.message}
          </div>
        )}

        {view === 'patient' ? (
          <div className="max-w-3xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">We Value Your Voice</h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Your recovery journey is our priority. Please share your thoughts on your recent therapy session so we can tailor your care.
              </p>
            </div>
            <FeedbackForm onSubmit={handleFeedbackSubmit} isLoading={isAnalyzing} />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Analytics Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Real-time analysis of patient sentiment and therapeutic outcomes.</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Model Active</p>
                <p className="text-sm font-medium text-teal-600 flex items-center justify-end">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-pulse"></span>
                  gemini-3-flash-preview
                </p>
              </div>
            </div>
            <Dashboard feedbacks={feedbacks} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; 2025 PhysioInsight AI.
            </p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              Developed by <a href="https://pratikdev.tech" target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-600 hover:text-teal-700 decoration-dotted underline underline-offset-4">Pratik Pandey</a>
              <span className="mx-2 text-gray-300">|</span>
              <a href="https://github.com/devilwonder/physioinsight-ai" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                GitHub Repo
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
