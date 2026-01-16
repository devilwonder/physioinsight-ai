import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFeedback = async (feedbackText: string, rating: number): Promise<AIAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following physiotherapy patient feedback. Rating provided: ${rating}/5. Text: "${feedbackText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: {
              type: Type.NUMBER,
              description: "A score from 0 to 100 where 100 is extremely positive.",
            },
            sentimentLabel: {
              type: Type.STRING,
              enum: ["Positive", "Neutral", "Negative"],
            },
            keyThemes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 key topics mentioned (e.g., 'Pain Management', 'Staff', 'Exercises').",
            },
            summary: {
              type: Type.STRING,
              description: "A concise 1-sentence summary of the feedback.",
            },
            actionableInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Specific actions the clinic or therapist can take to improve.",
            },
            clinicalFlags: {
              type: Type.BOOLEAN,
              description: "True if the patient mentions severe unexpected pain, regression, or medical complications.",
            },
          },
          required: ["sentimentScore", "sentimentLabel", "keyThemes", "summary", "actionableInsights", "clinicalFlags"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysis;
  } catch (error) {
    console.error("Error analyzing feedback:", error);
    // Return a fallback analysis in case of error to prevent app crash
    return {
      sentimentScore: 50,
      sentimentLabel: "Neutral",
      keyThemes: ["Error analyzing"],
      summary: "Could not analyze text at this time.",
      actionableInsights: ["Check system logs."],
      clinicalFlags: false
    };
  }
};
