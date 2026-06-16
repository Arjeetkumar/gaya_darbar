
import { GoogleGenAI, Type } from "@google/genai";
import { MenuItem, WorkoutIntensity } from "../types";
import { MENU_ITEMS } from "../constants";

export const getAIRecommendation = async (moodOrGoal: string, intensity: WorkoutIntensity = 'Rest Day'): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a world-class Fitness Nutritionist at "IRON & FUEL KITCHEN". 
      The customer's current feeling is: "${moodOrGoal}". 
      THEIR TRAINING INTENSITY TODAY: "${intensity}".
      Based on our high-protein, macro-calculated menu: ${JSON.stringify(MENU_ITEMS)}, 
      recommend 1 dish, state its key macros (P, C, F), and explain why it supports their fitness goal given their specific intensity today (e.g., higher carbs for Lifting, lean protein for Rest). 
      Keep the tone encouraging, professional, and Appetizing. Max 65 words.`,
      config: {
        temperature: 0.7,
      },
    });

    return response.text || "Our Grilled Chicken is the ultimate recovery meal.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Fuel your gains with our Brown Rice Mutton Biryani - 45g Protein for peak recovery.";
  }
};
