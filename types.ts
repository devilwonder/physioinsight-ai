import React from 'react';

export interface AIAnalysis {
  sentimentScore: number; // 0 to 100
  sentimentLabel: 'Positive' | 'Neutral' | 'Negative';
  keyThemes: string[];
  summary: string;
  actionableInsights: string[];
  clinicalFlags: boolean; // True if the AI detects mentions of severe pain or medical issues
}

export interface Feedback {
  id: string;
  patientName: string; // Optional/Anonymous
  date: string;
  rating: number; // 1-5 stars
  text: string;
  analysis?: AIAnalysis;
  status: 'processing' | 'analyzed' | 'error';
}

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon: React.ReactNode;
}