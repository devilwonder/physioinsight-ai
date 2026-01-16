import React, { useState } from 'react';
import { StarIcon } from './Icons';

interface FeedbackFormProps {
  onSubmit: (text: string, rating: number, name: string) => void;
  isLoading: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || text.trim() === '') return;
    onSubmit(text, rating, name || 'Anonymous');
    setRating(0);
    setText('');
    setName('');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-teal-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white">How was your session?</h2>
        <p className="text-teal-100 mt-2">Your feedback helps us improve your treatment.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <StarIcon 
                  filled={star <= (hoverRating || rating)} 
                  className={`w-10 h-10 ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about your experience
          </label>
          <textarea
            id="feedback"
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
            placeholder="What went well? What could be better?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Name (Optional) */}
        <div>
           <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name (Optional)
          </label>
          <input 
            id="name"
            type="text"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || rating === 0 || text.trim() === ''}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg shadow-md transition-all
            ${isLoading || rating === 0 || text.trim() === '' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Feedback...
            </span>
          ) : (
            'Submit Feedback'
          )}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
