import { GoogleGenerativeAI } from '@google/generative-ai';
import { FragranceDetails, Participant, CostBreakdown, ParticipantSummary } from '@/types';

// Export an interface for our basic summary fallback as well
export function generateBasicSummary(
  fragrance: FragranceDetails,
  participants: Participant[],
  costBreakdown: CostBreakdown
): ParticipantSummary[] {
  return participants.map((p, i) => {
    const cost = costBreakdown.participantCosts[i]?.cost || 0;
    const text = [
      `🌸 Hey ${p.name}! Here is your split info for ${fragrance.name} 🌸\n`,
      `Your Share: ${p.requestedMl}ml`,
      `Your Total: $${cost.toFixed(2)}\n`,
      `Bottle Info:`,
      `Total Size: ${fragrance.bottleSize}ml`,
      `Total Cost: $${costBreakdown.totalCost.toFixed(2)}`,
      `Cost per ml: $${costBreakdown.costPerMl.toFixed(2)}\n`,
      `📦 Remaining: ${costBreakdown.remainingMl}ml available`,
    ].join('\n');

    return {
      participantId: p.id,
      name: p.name,
      text,
    };
  });
}

export async function generateSplitSummary(
  fragrance: FragranceDetails,
  participants: Participant[],
  costBreakdown: CostBreakdown
): Promise<ParticipantSummary[]> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('Gemini API key is missing. Using fallback basic summary.');
    return generateBasicSummary(fragrance, participants, costBreakdown);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `Generate a personalized, friendly WhatsApp message for EACH participant in a fragrance split.
Use emojis and clear formatting. The message should be conversational, as if I'm texting my friends.

Fragrance Details:
- Name: ${fragrance.name}
- Bottle Size: ${fragrance.bottleSize}ml
- Bottle Price: $${fragrance.bottlePrice.toFixed(2)}
- Shipping Cost: $${fragrance.shippingCost.toFixed(2)}
- Total Cost: $${costBreakdown.totalCost.toFixed(2)}
- Cost per ml: $${costBreakdown.costPerMl.toFixed(2)}
- Remaining: ${costBreakdown.remainingMl}ml available

Participants:
${participants.map((p, i) => 
  `- ID: ${p.id} | Name: ${p.name} | Requested: ${p.requestedMl}ml | Cost Owed: $${(costBreakdown.participantCosts[i]?.cost || 0).toFixed(2)}`
).join('\n')}

For each participant, write a friendly message that includes:
1. A friendly greeting using their name
2. Fragrance name and bottle size
3. Their individual breakdown (ml amount and exact cost owed)
4. The cost per ml calculation
5. Total bottle cost context
6. Remaining ml information

You MUST return a JSON array of objects. Do not include any markdown block formatting outside the JSON array.
Each object must have these exact keys:
- "participantId" (string): the exact ID from the list above
- "name" (string): the participant's name
- "text" (string): the personalized WhatsApp message for them`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text();
    
    // Parse the JSON array
    const parsed = JSON.parse(jsonText) as ParticipantSummary[];
    return parsed;
  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to basic summary on error
    return generateBasicSummary(fragrance, participants, costBreakdown);
  }
}
