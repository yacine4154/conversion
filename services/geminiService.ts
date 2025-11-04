
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the "data:mime/type;base64," part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const extractTextFromDocument = async (file: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("La variable d'environnement API_KEY n'est pas définie.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(file);

  const filePart = {
    inlineData: {
      mimeType: file.type,
      data: base64Data,
    },
  };

  const textPart = {
    text: "Extrais tout le texte de ce document (image ou PDF). Préserve la mise en forme originale autant que possible, y compris les sauts de ligne, les paragraphes et les titres. Ne renvoie que le texte extrait, sans aucun commentaire ou phrase d'introduction de ta part.",
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [filePart, textPart] },
  });

  return response.text;
};
