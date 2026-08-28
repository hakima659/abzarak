export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/ai" && request.method === "POST") {
      try {
        const body = await request.json();
        const prompt = body.prompt;

        if (!prompt || !prompt.trim()) {
          return Response.json(
            { error: "لطفاً متن خود را وارد کنید." },
            { status: 400 }
          );
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: [
              {
                role: "system",
                content: "شما یک دستیار هوش مصنوعی فارسی‌زبان و مفید هستید."
              },
              {
                role: "user",
                content: prompt
              }
            ]
          }
        );

        return Response.json({
          success: true,
          response: result.response
        });
      } catch (error) {
        return Response.json(
          { error: "خطایی در اجرای هوش مصنوعی رخ داد." },
          { status: 500 }
        );
      }
    }

    return new Response("ابزارک هوش مصنوعی فعال است.");
  }
};
