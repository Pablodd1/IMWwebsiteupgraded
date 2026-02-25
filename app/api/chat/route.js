import { GoogleGenerativeAI } from '@google/generative-ai';
import { getWebsiteContext } from '../../../lib/getWebsiteContext';

let websiteKnowledge = '';
try {
  websiteKnowledge = getWebsiteContext();
} catch (e) {
  console.error('Could not load website context:', e);
}

const systemPrompt = `You are a helpful and friendly virtual front desk assistant for Innovative Medical Wellness.
Company Information:
- Name: Innovative Medical Wellness
- Address: 1899 NE 164th St, North Miami Beach, FL 33162
- Phone: (305) 864-1373
- Email: info@innovativemedicalwellness.com

Guidelines:
- Below is ALL the information extracted from the website regarding our treatments, blogs, about pages, and FAQs. Use it to answer ALL user questions accurately.
- If a user mentions a medical emergency, chest pain, stroke, or 911, instruct them to call 911 immediately or go to the nearest ER.
- Do NOT provide medical advice. Add a small disclaimer that you are an AI and not a doctor when discussing treatments.
- Be polite, professional, yet warm and conversational.
- Keep responses concise as they may be spoken aloud via text-to-speech.

--- WEBSITE KNOWLEDGE BASE ---
${websiteKnowledge}
`;

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ content: "Invalid request. Please refresh and try again." }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation with system prompt
    let conversationHistory = systemPrompt + "\n\n";
    for (const msg of messages) {
      conversationHistory += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    }
    conversationHistory += "Assistant:";

    const result = await model.generateContent(conversationHistory);
    const response = result.response.text();

    return Response.json({ content: response });
  } catch (error) {
    console.error('API Chat Error:', error);
    
    let errorMsg = "I apologize, but I'm having trouble connecting right now. Please try again.";
    
    if (error.message?.includes('API key') || error.message?.includes('Unauthorized') || error.message?.includes('permission')) {
      errorMsg = "AI service configuration error. Please contact support.";
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMsg = "I'm receiving too many requests. Please wait a moment and try again.";
    }
    
    return Response.json({ content: errorMsg }, { status: 500 });
  }
}
