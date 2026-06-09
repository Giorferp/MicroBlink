import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, solana-client",
};

const DEFAULT_APP_URL = "https://micro-blink.vercel.app";

function extractSurveyId(url: URL): string | null {
  const parts = url.pathname.split("/").filter(Boolean);
  const fnIndex = parts.indexOf("blink-survey");
  if (fnIndex >= 0 && parts[fnIndex + 1]) {
    return parts[fnIndex + 1];
  }
  return url.searchParams.get("survey_id");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const surveyId = extractSurveyId(new URL(req.url));
    if (!surveyId) {
      return new Response(JSON.stringify({ error: "Survey ID required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: survey, error } = await supabase
      .from("surveys")
      .select("id, title, description, incentive_description, is_active, estimated_minutes")
      .eq("id", surveyId)
      .maybeSingle();

    if (error || !survey) {
      return new Response(JSON.stringify({ error: "Survey not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!survey.is_active) {
      return new Response(JSON.stringify({ error: "Survey is not active" }), {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const appUrl = (Deno.env.get("APP_URL") || DEFAULT_APP_URL).replace(/\/$/, "");
    const surveyUrl = `${appUrl}/encuestas/${survey.id}`;
    const incentive = survey.incentive_description?.trim();
    const description = incentive
      ? `${survey.description}\n\n🎁 Incentivo: ${incentive}`
      : survey.description;

    const action = {
      type: "action",
      icon: `${appUrl}/favicon.png`,
      title: `MicroBlink · ${survey.title}`,
      description,
      label: "Responder encuesta",
      links: {
        actions: [
          {
            label: "Abrir encuesta",
            href: surveyUrl,
          },
        ],
      },
    };

    return new Response(JSON.stringify(action), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
