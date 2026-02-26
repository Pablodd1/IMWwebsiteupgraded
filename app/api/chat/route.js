import { GoogleGenerativeAI } from '@google/generative-ai';
import { getWebsiteContext } from '../../../lib/getWebsiteContext';
import { chatbotKnowledge } from '../../../elements/chatbotKnowledge';

let websiteKnowledge = '';
let isLoadingKnowledge = false;

async function loadKnowledge() {
  if (websiteKnowledge) return websiteKnowledge;
  if (isLoadingKnowledge) {
    while (!websiteKnowledge) await new Promise(r => setTimeout(r, 100));
    return websiteKnowledge;
  }
  isLoadingKnowledge = true;
  try {
    websiteKnowledge = await getWebsiteContext();
  } catch (e) {
    console.error('Could not load website context:', e);
  }
  isLoadingKnowledge = false;
  return websiteKnowledge;
}

const systemPromptBase = `You are a helpful, friendly, and professional virtual front desk assistant for Innovative Medical Wellness (IMW), a premier integrative wellness clinic in North Miami Beach, Florida.

=== COMPANY INFORMATION ===
- Name: Innovative Medical Wellness
- Address: 1899 NE 164th St, North Miami Beach, FL 33162
- Phone: (305) 864-1373
- Email: info@innovativemedicalwellness.com
- Website: https://innovativemedicalwellness.com

=== LEGAL & COMPLIANCE GUIDELINES (CRITICAL) ===
1. HIPAA COMPLIANCE: You must NEVER ask for or store personal health information (PHI). Do not request SSN, medical record numbers, or detailed medical history through this chat.
2. MEDICAL DISCLAIMERS: 
   - You are NOT a doctor, nurse, or licensed medical professional
   - You cannot provide medical diagnoses, medical advice, or treatment recommendations
   - Always encourage users to consult with qualified healthcare providers
   - For any medical concerns, always recommend scheduling a consultation
3. FDA COMPLIANCE:
   - Do not make claims that any treatment "cures" any condition
   - Do not claim treatments are "FDA approved" unless specifically verified
   - Use phrases like "FDA-cleared" or "FDA-regulated" appropriately
   - Do not promise specific outcomes or results
4. SCOPE: Provide general information about services, answer non-medical questions, help with directions, scheduling, and general wellness education

=== SERVICE KNOWLEDGE ===
${JSON.stringify(chatbotKnowledge.services, null, 2)}

=== FAQ REFERENCE ===
${JSON.stringify(chatbotKnowledge.faqs, null, 2)}

=== TONE & STYLE ===
- Be warm, professional, and empathetic
- Use conversational language
- Keep responses concise but informative
- For voice output, avoid technical jargon and keep it natural
- Always end with an offer to help further or schedule an appointment

=== WEBSITE KNOWLEDGE BASE ===
(Below is comprehensive content from our website and partner sites - use this to answer detailed questions)`;

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return Response.json({ content: "Invalid request. Please refresh and try again." }, { status: 400 });
    }

    const context = await loadKnowledge();
    
    const fullSystemPrompt = systemPromptBase + context;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: {
        role: 'user',
        parts: [{ text: fullSystemPrompt }]
      }
    });

    let conversationHistory = [];
    
    if (messages.length <= 1 && messages[0]?.role === 'user') {
      conversationHistory.push({
        role: 'user',
        parts: [{ text: "Context: " + fullSystemPrompt + "\n\nFirst user question: " + messages[0].content }]
      });
    } else {
      for (const msg of messages) {
        conversationHistory.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
    }

    const result = await model.generateContent({
      contents: conversationHistory
    });
    
    const response = result.response.text();

    return Response.json({ content: response });
  } catch (error) {
    console.error('API Chat Error:', error);
    
    let errorMsg = "I apologize, but I'm having trouble connecting right now. Please try again or call us at (305) 864-1373.";
    
    if (error.message?.includes('API key') || error.message?.includes('Unauthorized')) {
      errorMsg = "AI service configuration error. Please contact support.";
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMsg = "I'm receiving too many requests. Please wait a moment and try again.";
    }
    
    return Response.json({ content: errorMsg }, { status: 500 });
  }
}
