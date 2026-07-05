import OpenAI from 'openai';
import { prisma } from '../lib/prisma';


// Initialize OpenAI conditionally
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'YOUR_OPENAI_KEY_HERE') {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

const SYSTEM_PROMPT = `
You are the official 'GuardianRS' AI Sales Assistant, a highly professional, human-sounding, and friendly expert for an Old School RuneScape (OSRS) boosting website.

CORE RULES:
1. NEVER SOUND ROBOTIC. Keep responses natural, short, and conversational like a real human sales agent (e.g. "Zendesk/Intercom" style).
2. DO NOT INVENT PRICES. If someone asks for a price, check the provided service data. If the specific service isn't listed, give an estimate and ask for their current stats to give an exact quote, or say you'll transfer them to an admin for an exact quote.
3. ACCOUNT SAFETY: If asked about safety, always emphasize: "We only use hand-played methods by verified pros. No bots, no scripts, no macros. We can also use a VPN matching your location for extra security." Never say "100% risk-free", but emphasize our flawless track record and safety measures.
4. LEAD CAPTURE: If a visitor seems interested but hesitant, or needs an exact custom quote, politely ask for their Discord username or email so a manager can reach out.
5. KNOWLEDGE BASE: Use the provided knowledge base context to answer questions about OSRS skills, minigames, quests, and bossing.
`;

export class AIService {
  static async generateReply(sessionId: string): Promise<string> {
    if (!openai) {
      return "Hi there! I'm the GuardianRS Assistant. I am currently offline as my OpenAI API key is missing. An admin will be with you shortly!";
    }

    try {
      // 1. Fetch chat history for context
      const chatHistory = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 20, // last 20 messages
      });

      // 2. Format history for OpenAI
      const messages: any[] = chatHistory.map((msg: any) => ({
        role: msg.senderType === 'VISITOR' ? 'user' : 'assistant',
        content: msg.message,
      }));

      // 3. Fetch context from DB (Pricing & Services)
      // This is a naive RAG approach: just inject all active services if it's small, or we could filter based on the last message keywords.
      // For this demo, let's inject top services and categories
      const services = await prisma.service.findMany({
        where: { isActive: true },
        select: { name: true, basePrice: true, estimatedTime: true },
        take: 50,
      });

      const serviceContext = services.map((s: any) => `- ${s.name}: Starts at $${s.basePrice} (${s.estimatedTime})`).join('\n');

      const fullSystemPrompt = `
${SYSTEM_PROMPT}

AVAILABLE SERVICES & BASE PRICING:
${serviceContext}

Use this pricing info to help the user. If they want to place an order, tell them they can do so on the website, or you can pass them to an admin.
`;

      messages.unshift({ role: 'system', content: fullSystemPrompt });

      // 4. Generate response
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // or gpt-3.5-turbo
        messages,
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0].message.content || "I'm not sure how to answer that, but I can get an admin to help you out!";

    } catch (error) {
      console.error('[AI Service] Error generating reply:', error);
      return "I'm having a brief connection issue, but an admin has been notified and will jump in to assist you shortly! Feel free to type your question here.";
    }
  }

  static async analyzeForLead(sessionId: string, latestMessage: string) {
    if (!openai) return null;

    // Check if the user shared an email or discord tag
    const emailRegex = /[^@ \\t\\r\\n]+@[^@ \\t\\r\\n]+\\.[^@ \\t\\r\\n]+/;
    const discordRegex = /.{3,32}#[0-9]{4}|^[a-z0-9_\\.]{2,32}$/i; // Basic discord detection

    if (emailRegex.test(latestMessage) || latestMessage.toLowerCase().includes('discord')) {
      // Prompt AI to extract lead info
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Extract the Discord username or email address from the user message. Return it as a JSON object: { "email": "string|null", "discord": "string|null" }. Return ONLY valid JSON, nothing else.' },
            { role: 'user', content: latestMessage }
          ],
          response_format: { type: "json_object" }
        });

        const data = JSON.parse(response.choices[0].message.content || '{}');
        
        if (data.email || data.discord) {
          return {
            email: data.email || null,
            discord: data.discord || null
          };
        }
      } catch (e) {
        console.error('Failed to parse lead from message', e);
      }
    }
    return null;
  }
}
