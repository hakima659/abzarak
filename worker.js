// ---------------- Router ----------------

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({}, 204);
    }

    if (url.pathname === "/" && request.method === "GET") {
      return html(renderHomepage());
    }

    // مسیر تایید مالکیت دامنه برای eNamad
    if (url.pathname === "/36032134.txt" && request.method === "GET") {
      return new Response("", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // =========================================================
    // SEO — Sitemap
    // =========================================================
    if (url.pathname === "/sitemap.xml" && request.method === "GET") {
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://abzarakai.ir/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

      return new Response(sitemap, {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // =========================================================
    // SEO — Robots.txt
    // =========================================================
    if (url.pathname === "/robots.txt" && request.method === "GET") {
      const robots = `User-agent: *
Allow: /

Sitemap: https://abzarakai.ir/sitemap.xml`;

      return new Response(robots, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // =========================================================
    // Authentication
    // =========================================================

    if (url.pathname === "/api/signup" && request.method === "POST") {
      return handleSignup(request, env);
    }

    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    if (url.pathname === "/api/me" && request.method === "GET") {
      return handleMe(request, env);
    }

    // =========================================================
    // Password Reset
    // =========================================================

    if (
      url.pathname === "/api/forgot-password" &&
      request.method === "POST"
    ) {
      return handleForgotPassword(request, env);
    }

    if (
      url.pathname === "/api/reset-password" &&
      request.method === "POST"
    ) {
      return handleResetPassword(request, env);
    }

    // =========================================================
    // Plans
    // =========================================================

    if (url.pathname === "/api/plans" && request.method === "GET") {
      return handlePlans(request, env);
    }

    // =========================================================
    // AI
    // =========================================================

    if (
      url.pathname === "/api/ai/chat" &&
      request.method === "POST"
    ) {
      return handleAiChat(request, env);
    }

    // =========================================================
    // ZarinPal Payment
    // =========================================================

    if (
      url.pathname === "/api/payment/request" &&
      request.method === "POST"
    ) {
      return handleCreatePayment(request, env);
    }

    if (
      url.pathname === "/api/payment/verify" &&
      request.method === "GET"
    ) {
      return handleVerifyPayment(request, env);
    }

    // =========================================================
    // Admin
    // =========================================================

    if (
      url.pathname === "/api/admin/login" &&
      request.method === "POST"
    ) {
      return handleAdminLogin(request, env);
    }

    if (
      url.pathname === "/api/admin/users" &&
      request.method === "GET"
    ) {
      return handleAdminUsers(request, env);
    }

    if (
      url.pathname === "/api/admin/payments" &&
      request.method === "GET"
    ) {
      return handleAdminPayments(request, env);
    }

    if (
      url.pathname === "/api/admin/adjust-balance" &&
      request.method === "POST"
    ) {
      return handleAdminAdjustBalance(request, env);
    }

    // =========================================================
    // Not Found
    // =========================================================

    return json(
      { error: "مسیر یافت نشد" },
      404
    );
  },
};
