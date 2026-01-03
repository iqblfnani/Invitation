import { d as db } from '../../chunks/db_xN7uI99z.mjs';
import { c as checkRateLimit, s as sendTelegramNotification } from '../../chunks/telegram_p6NtPxM0.mjs';
export { renderers } from '../../renderers.mjs';

const sanitize = (str) => {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};
const GET = async () => {
  try {
    const stmt = db.prepare(`
      SELECT id, guest_name, attendance, guest_count, message, created_at 
      FROM rsvps 
      ORDER BY created_at DESC
    `);
    const rsvps = stmt.all();
    return new Response(JSON.stringify(rsvps), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch RSVPs" }), {
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
    const guest_name = sanitize(rawData.guest_name);
    const phone = sanitize(rawData.phone);
    const message = sanitize(rawData.message);
    const attendance = rawData.attendance;
    const guest_count = rawData.guest_count;
    const checkStmt = db.prepare("SELECT id FROM rsvps WHERE guest_name = ?");
    const existingGuest = checkStmt.get(guest_name);
    let actionType = "";
    let resultId = 0;
    if (existingGuest) {
      const updateStmt = db.prepare(`
        UPDATE rsvps 
        SET phone = ?, attendance = ?, guest_count = ?, message = ?, created_at = ?
        WHERE id = ?
      `);
      updateStmt.run(
        phone,
        attendance,
        guest_count,
        message || "",
        (/* @__PURE__ */ new Date()).toISOString(),
        existingGuest.id
      );
      actionType = "updated";
      resultId = existingGuest.id;
    } else {
      const insertStmt = db.prepare(`
        INSERT INTO rsvps (guest_name, phone, attendance, guest_count, message, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      const result = insertStmt.run(
        guest_name,
        phone,
        attendance,
        guest_count,
        message || "",
        (/* @__PURE__ */ new Date()).toISOString()
      );
      actionType = "created";
      resultId = Number(result.lastInsertRowid);
    }
    const title = actionType === "created" ? "💌 <b>RSVP BARU MASUK!</b>" : "♻️ <b>PEMBARUAN DATA RSVP!</b>";
    const statusEmoji = attendance === "hadir" ? "✅" : attendance === "ragu" ? "🤔" : "❌";
    const notifMsg = `
${title}

👤 <b>Nama:</b> ${guest_name}
${statusEmoji} <b>Status:</b> ${attendance.toUpperCase()}
👥 <b>Jml:</b> ${attendance === "hadir" ? guest_count + " Orang" : "-"}
📞 <b>Kontak:</b> ${phone || "-"}

💬 <b>Pesan:</b>
<i>"${message || "-"}"</i>
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
