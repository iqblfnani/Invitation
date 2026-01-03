import { d as db } from '../../chunks/db_xN7uI99z.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    const stmt = db.prepare(`
      SELECT guest_name, phone, attendance, guest_count, message, created_at 
      FROM rsvps 
      ORDER BY created_at DESC
    `);
    const data = stmt.all();
    const csvRows = [];
    const headers = [
      "Nama Tamu",
      "No HP",
      "Kehadiran",
      "Jumlah",
      "Pesan",
      "Waktu Input"
    ];
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = [
        `"${row.guest_name}"`,
        `'${row.phone || "-"}'`,
        row.attendance,
        row.guest_count,
        `"${(row.message || "").replace(/"/g, '""')}"`,
        row.created_at
      ];
      csvRows.push(values.join(","));
    });
    const csvContent = csvRows.join("\n");
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="wedding-rsvp-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`
      }
    });
  } catch (error) {
    console.error(error);
    return new Response("Failed to export data", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
