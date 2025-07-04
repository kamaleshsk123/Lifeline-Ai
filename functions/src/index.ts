
import * as functions from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {GoogleGenerativeAI, HarmCategory, HarmBlockThreshold} from "@google/generative-ai";

initializeApp();

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.GEMINI_API_KEY;

export const chat = onCall(async (request) => {
  if (!API_KEY) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be configured with a Gemini API key.'
    );
  }

  const {history, message} = request.data;

  if (!message) {
      throw new functions.https.HttpsError(
          'invalid-argument',
          'The function must be called with one argument "message".'
      );
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({model: MODEL_NAME});

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  try {
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: history || [],
    });

    const result = await chatSession.sendMessage(message);
    const response = result.response;
    return {text: response.text()};
  } catch (error) {
      console.error(error);
      throw new functions.https.HttpsError('internal', 'Error generating response from AI.');
  }
});
