import { d as db } from '../../chunks/db_xN7uI99z.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async () => {
  try {
    const stmt = db.prepare(`
      SELECT name, message, created_at 
      FROM wishes 
      ORDER BY created_at DESC
    `);
    const data = stmt.all();
    const csvRows = [];
    const headers = ["Nama Pengirim", "Ucapan & Doa", "Waktu Input"];
    csvRows.push(headers.join(","));
    data.forEach((row) => {
      const values = [
        `"${(row.name || "").replace(/"/g, '""')}"`,
        `"${(row.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
        row.created_at
      ];
      csvRows.push(values.join(","));
    });
    const csvContent = csvRows.join("\n");
    const filename = `wedding-wishes-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error("Export Error:", error);
    return new Response("Failed to export wishes data", { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
