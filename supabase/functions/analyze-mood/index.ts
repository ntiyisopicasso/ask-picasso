import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          {
            role: "system",
            content: `You are an emotion detection system. Analyze the text and return ONLY a JSON object with the following structure:
{
  "mood": "one of: happy, sad, anxious, calm, angry, neutral",
  "confidence": 0.0 to 1.0,
  "emoji": "single emoji that represents the mood"
}

Be empathetic in your analysis. Look for:
- Explicit emotional words
- Tone and sentiment
- Context clues
- Intensity of expression

Return ONLY the JSON object, no other text.`
          },
          {
            role: "user",
            content: text
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error("Mood analysis error:", response.status);
      return new Response(JSON.stringify({ 
        mood: "neutral", 
        confidence: 0.5, 
        emoji: "😊" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{"mood":"neutral","confidence":0.5,"emoji":"😊"}';
    
    // Parse the JSON from the response
    let moodData;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      moodData = jsonMatch ? JSON.parse(jsonMatch[0]) : { mood: "neutral", confidence: 0.5, emoji: "😊" };
    } catch {
      moodData = { mood: "neutral", confidence: 0.5, emoji: "😊" };
    }

    return new Response(JSON.stringify(moodData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Mood analysis error:", error);
    return new Response(JSON.stringify({ 
      mood: "neutral", 
      confidence: 0.5, 
      emoji: "😊" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
