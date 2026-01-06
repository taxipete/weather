import { GoogleGenAI, Type } from "@google/genai";
import type { WeatherSummaryData } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const comparisonSchema = {
  type: Type.OBJECT,
  properties: {
    comparisonSummary: {
      type: Type.STRING,
      description:
        "A friendly, one-sentence summary comparing today's weather to yesterday's. For example: 'Today is warmer and less humid than yesterday.' or 'It's looking much rainier today!'",
    },
  },
  required: ["comparisonSummary"],
};

export const generateComparisonSummary = async (
  location: string,
  weatherData: WeatherSummaryData
): Promise<string> => {
  const prompt = `
    Here is the weather data for ${location}.
    Yesterday's weather: ${JSON.stringify(weatherData.yesterday)}.
    Today's weather: ${JSON.stringify(weatherData.today)}.
    
    Please provide a friendly, one-sentence summary comparing today's weather to yesterday's.
    The units are: temperature in Celsius, humidity in percent, wind speed in km/h.
    `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: comparisonSchema,
      },
    });

    const jsonText = response.text?.trim() ?? "";
    const data = JSON.parse(jsonText);

    if (data && data.comparisonSummary) {
      return data.comparisonSummary;
    } else {
      throw new Error("Invalid summary structure received from API.");
    }
  } catch (error) {
    console.error(
      "Error generating comparison summary from Gemini API:",
      error
    );
    if (error instanceof Error) {
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error(
      "An unknown error occurred while communicating with the AI."
    );
  }
};
