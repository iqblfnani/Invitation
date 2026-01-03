import { d as db } from '../../chunks/db_xN7uI99z.mjs';
import { c as checkRateLimit, s as sendTelegramNotification } from '../../chunks/telegram_p6NtPxM0.mjs';
export { renderers } from '../../renderers.mjs';

const sanitize = (str) => {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
const GET = async () => {
  try {
    const stmt = db.prepare("SELECT * FROM wishes ORDER BY created_at DESC");
    const wishes = stmt.all();
    return new Response(JSON.stringify(wishes), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500
    });
  }
};
const POST = async ({ request, clientAddress }) => {
  const ip = clientAddress || "unknown";
  if (!checkRateLimit(ip, 5, 6e4)) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      { status: 429 }
    );
  }
  try {
    const rawData = await request.json();
    const name = sanitize(rawData.name);
    const message = sanitize(rawData.message);
    const checkStmt = db.prepare("SELECT id FROM wishes WHERE name = ?");
    const existingWish = checkStmt.get(name);
    let actionType = "";
    let resultId = 0;
    if (existingWish) {
      const updateStmt = db.prepare(`
        UPDATE wishes 
        SET message = ?, created_at = ?
        WHERE id = ?
      `);
      updateStmt.run(message, (/* @__PURE__ */ new Date()).toISOString(), existingWish.id);
      actionType = "updated";
      resultId = existingWish.id;
    } else {
      const insertStmt = db.prepare(
        "INSERT INTO wishes (name, message, created_at) VALUES (?, ?, ?)"
      );
      const result = insertStmt.run(name, message, (/* @__PURE__ */ new Date()).toISOString());
      actionType = "created";
      resultId = Number(result.lastInsertRowid);
    }
    const title = actionType === "created" ? "✨ <b>UCAPAN & DOA BARU!</b>" : "📝 <b>UCAPAN DIPERBARUI!</b>";
    const notifMsg = `
${title}

👤 <b>Dari:</b> ${name}

<i>"${message}"</i>
    `.trim();
    sendTelegramNotification(notifMsg);
    return new Response(
      JSON.stringify({
        success: true,
        id: resultId,
        action: actionType
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
