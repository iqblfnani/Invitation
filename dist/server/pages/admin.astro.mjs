import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, l as Fragment$1 } from '../chunks/astro/server_oVdgqn8w.mjs';
import 'piccolore';
import { W as WEDDING_CONFIG, a as WEDDING_TEXT, $ as $$Layout } from '../chunks/Layout_D_hH-HRE.mjs';
import { d as db } from '../chunks/db_xN7uI99z.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Copy, Download, Loader2, Upload, FileText, RefreshCcw, CheckCircle2, Eye, Printer, FileSpreadsheet, Check, Users, MessageCircle, QrCode, X, Save, Trash2, Search, Edit, ChevronLeft, ChevronRight, LogOut, HelpCircle, XCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
export { renderers } from '../renderers.mjs';

const QRCodeManager = ({ siteUrl }) => {
  const [activeTab, setActiveTab] = useState("single");
  const [singleName, setSingleName] = useState("");
  const [bulkNames, setBulkNames] = useState([]);
  const [isReadingCsv, setIsReadingCsv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const qrRefs = useRef({});
  const baseUrl = siteUrl?.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl || "";
  const generateUrl = (name) => {
    if (!name) return baseUrl;
    return `${baseUrl}/?to=${encodeURIComponent(name.trim())}`;
  };
  const handleSaveAs = (blob, name) => {
    const saveAsFunc = FileSaver.saveAs || FileSaver;
    saveAsFunc(blob, name);
  };
  const centerLogo = useMemo(() => {
    try {
      const bInitial = (WEDDING_CONFIG?.couple?.bride?.name || "B").charAt(0).toUpperCase();
      const gInitial = (WEDDING_CONFIG?.couple?.groom?.name || "G").charAt(0).toUpperCase();
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B45309;stop-opacity:1" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="white" />
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGradient)" stroke-width="2" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" stroke-width="1" />
          <g font-family="'Times New Roman', Times, serif" font-weight="bold" font-size="40" fill="#334155" text-anchor="middle">
             <text x="26" y="64">${bInitial}</text>
             <text x="74" y="64">${gInitial}</text>
          </g>
          <path d="M50 38 C 46 32, 36 33, 36 42 C 36 52, 50 64, 50 64 C 50 64, 64 52, 64 42 C 64 33, 54 32, 50 38 Z" fill="#e11d48" stroke="white" stroke-width="1.5" />
        </svg>
      `.trim();
      return `data:image/svg+xml;base64,${btoa(svgString)}`;
    } catch (e) {
      console.error("Logo Generation Error:", e);
      return "";
    }
  }, []);
  const downloadTemplate = () => {
    const csvContent = "Nama Tamu\nAhmad Syarief Ramadhan\nMuhammad Ikbal Pauji\nKeluarga Besar Bapak Jokowi";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    handleSaveAs(blob, "template_tamu.csv");
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingCsv(true);
    setTimeout(() => {
      Papa.parse(file, {
        complete: (results) => {
          const names = [];
          results.data.forEach((row) => {
            if (row[0] && typeof row[0] === "string" && row[0].trim() !== "") {
              if (!row[0].toLowerCase().includes("nama tamu")) {
                names.push(row[0].trim());
              }
            }
          });
          setBulkNames(names);
          setIsReadingCsv(false);
        },
        header: false
      });
    }, 100);
  };
  const downloadAllZip = async () => {
    if (bulkNames.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setStatusMsg("Menyiapkan assets...");
    try {
      const zip = new JSZip();
      const folder = zip.folder("QR_Codes_Wedding");
      const CHUNK_SIZE = 50;
      for (let i = 0; i < bulkNames.length; i += CHUNK_SIZE) {
        const chunk = bulkNames.slice(i, i + CHUNK_SIZE);
        setStatusMsg(
          `Memproses ${i + 1} - ${Math.min(i + chunk.length, bulkNames.length)} dari ${bulkNames.length}...`
        );
        await Promise.all(
          chunk.map(async (name, chunkIdx) => {
            const globalIdx = i + chunkIdx;
            const canvas = qrRefs.current[globalIdx];
            if (canvas) {
              const dataUrl = canvas.toDataURL("image/png");
              const base64Data = dataUrl.split(",")[1];
              const safeName = name.replace(/[^a-z0-9]/gi, "_").substring(0, 50);
              folder?.file(`${globalIdx + 1}_${safeName}.png`, base64Data, {
                base64: true
              });
            }
          })
        );
        const currentProgress = Math.round(
          (i + chunk.length) / bulkNames.length * 100
        );
        setProgress(currentProgress);
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
      setStatusMsg("Mengompres file ZIP...");
      const content = await zip.generateAsync({ type: "blob" });
      handleSaveAs(
        content,
        `QR-Codes-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`
      );
      setStatusMsg("Selesai!");
    } catch (e) {
      alert("Terjadi kesalahan saat membuat ZIP.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatusMsg("");
      }, 1e3);
    }
  };
  const downloadSingle = () => {
    const canvas = document.getElementById("single-qr");
    if (canvas) {
      handleSaveAs(
        canvas.toDataURL("image/png"),
        `QR-${singleName || "Wedding"}.png`
      );
    }
  };
  const copySingleLink = () => {
    navigator.clipboard.writeText(generateUrl(singleName));
    alert("Link berhasil disalin!");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("single"),
          className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "single" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
          children: "Manual (Satuan)"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("bulk"),
          className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "bulk" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
          children: "Import CSV (Banyak)"
        }
      )
    ] }) }),
    activeTab === "single" && /* @__PURE__ */ jsxs("div", { className: "animate-reveal grid items-center gap-8 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest text-slate-400 uppercase", children: "Nama Tamu" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: singleName,
              onChange: (e) => setSingleName(e.target.value),
              placeholder: "Ketik nama tamu...",
              className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-slate-50 p-4 font-mono text-xs break-all text-slate-500 dark:bg-slate-900/50 dark:text-slate-400", children: generateUrl(singleName) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: copySingleLink,
              className: "flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800",
              children: [
                /* @__PURE__ */ jsx(Copy, { className: "h-4 w-4" }),
                " Copy Link"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: downloadSingle,
              disabled: !singleName,
              className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white uppercase shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
                " Download PNG"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-800", children: [
        /* @__PURE__ */ jsx(
          QRCodeCanvas,
          {
            id: "single-qr",
            value: generateUrl(singleName),
            size: 250,
            level: "H",
            includeMargin: true,
            imageSettings: centerLogo ? {
              src: centerLogo,
              height: 50,
              width: 50,
              excavate: true
            } : void 0
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-xs font-bold tracking-widest text-slate-400 uppercase", children: "Preview Desain" }) })
      ] }) })
    ] }),
    activeTab === "bulk" && /* @__PURE__ */ jsx("div", { className: "animate-reveal space-y-8", children: bulkNames.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center md:p-10 dark:border-slate-700 dark:bg-slate-800/50", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500 dark:bg-blue-900/20", children: isReadingCsv ? /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-800 dark:text-white", children: isReadingCsv ? "Membaca File CSV..." : "Upload File CSV" }),
        /* @__PURE__ */ jsxs("p", { className: "mx-auto max-w-md text-sm leading-relaxed text-slate-500", children: [
          "Siapkan file CSV sederhana dimana",
          " ",
          /* @__PURE__ */ jsx("strong", { children: "kolom pertama" }),
          " berisi daftar nama tamu."
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: downloadTemplate,
            className: "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700",
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
              "Download Template CSV"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: `inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-slate-900 ${isReadingCsv ? "pointer-events-none opacity-50" : ""}`,
          children: [
            "Pilih File CSV",
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: ".csv",
                onChange: handleFileUpload,
                className: "hidden",
                disabled: isReadingCsv
              }
            )
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between dark:border-blue-900/30 dark:bg-blue-900/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-blue-100 p-2 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300", children: bulkNames.length }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-700 dark:text-blue-100", children: "Data Tamu Siap" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: "Desain Premium dengan Logo Terpasang" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (confirm("Yakin ingin menghapus semua data?"))
                  setBulkNames([]);
              },
              className: "group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
              children: [
                /* @__PURE__ */ jsx(RefreshCcw, { className: "h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" }),
                "Reset Data"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: downloadAllZip,
              disabled: isProcessing,
              className: "group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-blue-600 px-8 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70",
              children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2", children: [
                isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" }),
                /* @__PURE__ */ jsx("span", { children: isProcessing ? "Memproses..." : "Download ZIP" })
              ] })
            }
          )
        ] })
      ] }),
      isProcessing && /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx("span", { children: statusMsg }),
          /* @__PURE__ */ jsxs("span", { children: [
            progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-blue-600 transition-all duration-300 ease-out",
            style: { width: `${progress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5", children: [
        bulkNames.slice(0, 50).map((name, idx) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "group relative flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800",
            children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-white p-1", children: /* @__PURE__ */ jsx(
                QRCodeCanvas,
                {
                  ref: (el) => qrRefs.current[idx] = el,
                  value: generateUrl(name),
                  size: 140,
                  level: "H",
                  includeMargin: true,
                  imageSettings: centerLogo ? {
                    src: centerLogo,
                    height: 35,
                    width: 35,
                    excavate: true
                  } : void 0
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "w-full text-center", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-bold text-slate-700 dark:text-slate-300", children: name }),
                /* @__PURE__ */ jsx("div", { className: "mt-1 flex justify-center opacity-0 transition-opacity group-hover:opacity-100", children: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3 w-3 text-green-500" }) })
              ] })
            ]
          },
          idx
        )),
        bulkNames.slice(50).map((name, idx) => /* @__PURE__ */ jsx("div", { className: "hidden", children: /* @__PURE__ */ jsx(
          QRCodeCanvas,
          {
            ref: (el) => qrRefs.current[idx + 50] = el,
            value: generateUrl(name),
            size: 250,
            level: "H",
            includeMargin: true,
            imageSettings: centerLogo ? {
              src: centerLogo,
              height: 50,
              width: 50,
              excavate: true
            } : void 0
          }
        ) }, idx + 50))
      ] }),
      bulkNames.length > 50 && /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-slate-400 italic", children: [
        "... dan ",
        bulkNames.length - 50,
        " QR Code lainnya (disembunyikan agar browser tidak berat, namun tetap akan terunduh)."
      ] })
    ] }) })
  ] });
};

const THEMES = [
  {
    name: "Sage Green (Original)",
    id: "sage",
    bg: [255, 255, 255],
    primary: [85, 107, 47],
    secondary: [189, 209, 166],
    textMain: [47, 61, 26],
    textMuted: [110, 120, 90]
  },
  {
    name: "Classic Maroon",
    id: "maroon",
    bg: [255, 252, 252],
    primary: [128, 0, 32],
    secondary: [230, 180, 190],
    textMain: [80, 0, 20],
    textMuted: [150, 80, 90]
  },
  {
    name: "Royal Gold",
    id: "gold",
    bg: [255, 255, 252],
    primary: [184, 134, 11],
    secondary: [240, 230, 140],
    textMain: [101, 67, 33],
    textMuted: [160, 130, 90]
  },
  {
    name: "Dusty Blue",
    id: "blue",
    bg: [250, 250, 255],
    primary: [70, 90, 120],
    secondary: [190, 210, 230],
    textMain: [30, 45, 70],
    textMuted: [100, 120, 140]
  }
];
const InvitationManager = () => {
  const [activeTab, setActiveTab] = useState("single");
  const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
  const [singleData, setSingleData] = useState({
    name: "",
    address: "Di Tempat"
  });
  const [bulkData, setBulkData] = useState([]);
  const [isReadingCsv, setIsReadingCsv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewUri, setPreviewUri] = useState(null);
  const handleSaveAs = (blob, name) => {
    const saveAsFunc = FileSaver.saveAs || FileSaver;
    saveAsFunc(blob, name);
  };
  const drawLeaf = (doc, x, y, size, angle) => {
    const rad = angle * Math.PI / 180;
    const ctx = { c: Math.cos(rad), s: Math.sin(rad) };
    const t = (lx, ly) => ({
      x: x + (lx * ctx.c - ly * ctx.s) * size,
      y: y + (lx * ctx.s + ly * ctx.c) * size
    });
    doc.setFillColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.15);
    const p1 = t(0, 0);
    const p2 = t(5, 2.5);
    const p3 = t(10, 0);
    const p4 = t(5, -2.5);
    doc.triangle(p1.x, p1.y, p3.x, p3.y, p2.x, p2.y, "FD");
    doc.triangle(p1.x, p1.y, p3.x, p3.y, p4.x, p4.y, "FD");
    doc.setLineWidth(0.1);
    doc.line(p1.x, p1.y, p3.x, p3.y);
  };
  const drawRose = (doc, x, y, size) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.25);
    doc.circle(x, y, size, "FD");
    const steps = 18;
    let radius = 0.8;
    let angle = 0;
    let prevX = x;
    let prevY = y;
    for (let i = 0; i < steps; i++) {
      angle += 0.7;
      radius += size / steps;
      const nextX = x + Math.cos(angle) * radius;
      const nextY = y + Math.sin(angle) * radius;
      if (i > 1) {
        doc.setLineWidth(0.15 - i * 5e-3);
        doc.line(prevX, prevY, nextX, nextY);
      }
      prevX = nextX;
      prevY = nextY;
    }
  };
  const drawFloralCluster = (doc, cx, cy, rot) => {
    const leaves = [
      { s: 1.6, a: rot + 5, d: 9 },
      { s: 1.3, a: rot + 35, d: 9 },
      { s: 1.6, a: rot + 75, d: 9 },
      { s: 1.1, a: rot + 20, d: 13 },
      { s: 1.1, a: rot + 60, d: 13 },
      { s: 0.9, a: rot + 45, d: 15 }
    ];
    leaves.forEach((l) => {
      const lx = cx + Math.cos(l.a * Math.PI / 180) * l.d;
      const ly = cy + Math.sin(l.a * Math.PI / 180) * l.d;
      drawLeaf(doc, lx, ly, l.s, l.a);
    });
    drawRose(doc, cx, cy, 7.5);
    const buds = [
      { a: rot + 15, d: 10 },
      { a: rot + 65, d: 10 },
      { a: rot + 40, d: 12 }
    ];
    buds.forEach((b) => {
      const bx = cx + Math.cos(b.a * Math.PI / 180) * b.d;
      const by = cy + Math.sin(b.a * Math.PI / 180) * b.d;
      drawRose(doc, bx, by, 3.5);
    });
  };
  const drawBorder = (doc, w, h) => {
    const m = 6;
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.5);
    doc.rect(m, m, w - m * 2, h - m * 2);
    doc.setLineWidth(0.15);
    doc.rect(m + 1.5, m + 1.5, w - (m + 1.5) * 2, h - (m + 1.5) * 2);
    doc.setLineWidth(0.15);
    doc.rect(m + 2.5, m + 2.5, w - (m + 2.5) * 2, h - (m + 2.5) * 2);
  };
  const drawCornerDecorations = (doc, width, height) => {
    const offset = 12;
    drawFloralCluster(doc, offset, offset, 0);
    drawFloralCluster(doc, width - offset, offset, 90);
    drawFloralCluster(doc, width - offset, height - offset, 180);
    drawFloralCluster(doc, offset, height - offset, 270);
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.1);
    const midTop = { x: width / 2, y: 8 };
    const midBottom = { x: width / 2, y: height - 8 };
    const midLeft = { x: 8, y: height / 2 };
    const midRight = { x: width - 8, y: height / 2 };
    [midTop, midBottom, midLeft, midRight].forEach((pos) => {
      for (let i = 0; i < 3; i++) {
        const size = 0.8 - i * 0.2;
        doc.circle(pos.x, pos.y, size, "D");
      }
    });
  };
  const generatePDFDoc = async (guest) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5"
    });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const cx = width / 2;
    const siteUrl = window.location.origin;
    const guestUrl = `${siteUrl}/?to=${encodeURIComponent(guest.name)}`;
    const qrGuestImg = await QRCode.toDataURL(guestUrl, {
      margin: 0,
      color: { dark: "#2f3d1a", light: "#ffffff" }
    });
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${WEDDING_CONFIG.venue.latitude},${WEDDING_CONFIG.venue.longitude}`;
    const qrMapsImg = await QRCode.toDataURL(mapsUrl, {
      margin: 0,
      color: { dark: "#2f3d1a", light: "#ffffff" }
    });
    doc.setFillColor(
      currentTheme.bg[0],
      currentTheme.bg[1],
      currentTheme.bg[2]
    );
    doc.rect(0, 0, width, height, "F");
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text("THE WEDDING OF", cx, 50, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(40);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(WEDDING_CONFIG.couple.bride.name, cx, 75, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text("&", cx, 88, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(40);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(WEDDING_CONFIG.couple.groom.name, cx, 105, { align: "center" });
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.2);
    doc.line(cx - 20, 115, cx + 20, 115);
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(WEDDING_CONFIG.events.resepsi.date.toUpperCase(), cx, 125, {
      align: "center"
    });
    const boxY = 155;
    const boxW = 85;
    const boxH = 30;
    doc.setFillColor(250, 250, 250);
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(cx - boxW / 2 + 0.5, boxY + 0.5, boxW, boxH, 2, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.5);
    doc.roundedRect(cx - boxW / 2, boxY, boxW, boxH, 2, 2, "FD");
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text("Kepada Yth. Bapak/Ibu/Saudara/i:", cx, boxY + 8, {
      align: "center",
      charSpace: 0
    });
    doc.setFont("times", "bolditalic");
    doc.setFontSize(14);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    const splitName = doc.splitTextToSize(guest.name, boxW - 5);
    doc.text(splitName, cx, boxY + 18, { align: "center" });
    if (guest.address) {
      doc.setFont("times", "normal");
      doc.setFontSize(9);
      doc.setTextColor(
        currentTheme.textMuted[0],
        currentTheme.textMuted[1],
        currentTheme.textMuted[2]
      );
      doc.text(guest.address, cx, boxY + 26, { align: "center" });
    }
    doc.addPage();
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(WEDDING_TEXT.opening.salam, cx, 50, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    const quote = doc.splitTextToSize(WEDDING_TEXT.quote.ar_rum, width - 60);
    doc.text(quote, cx, 60, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(
      "Kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
      cx,
      95,
      { align: "center" }
    );
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(WEDDING_CONFIG.couple.bride.fullName, cx, 110, {
      align: "center"
    });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(WEDDING_CONFIG.couple.bride.parents, cx, 117, { align: "center" });
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.text("&", cx, 127, { align: "center" });
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(WEDDING_CONFIG.couple.groom.fullName, cx, 137, {
      align: "center"
    });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(WEDDING_CONFIG.couple.groom.parents, cx, 144, { align: "center" });
    doc.addPage();
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text("Insya Allah acara akan dilaksanakan pada:", cx, 35, {
      align: "center"
    });
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(WEDDING_CONFIG.events.akad.title, cx, 50, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(
      `${WEDDING_CONFIG.events.akad.day}, ${WEDDING_CONFIG.events.akad.date}`,
      cx,
      57,
      { align: "center" }
    );
    doc.text(
      `Pukul: ${WEDDING_CONFIG.events.akad.startTime} - ${WEDDING_CONFIG.events.akad.endTime} WIB`,
      cx,
      62,
      { align: "center" }
    );
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.15);
    doc.line(cx - 20, 70, cx - 5, 70);
    doc.line(cx + 5, 70, cx + 20, 70);
    doc.setFillColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    for (let i = 0; i < 3; i++) {
      doc.circle(cx - 2 + i, 70, 0.3, "F");
    }
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(WEDDING_CONFIG.events.resepsi.title, cx, 85, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text(
      `${WEDDING_CONFIG.events.resepsi.day}, ${WEDDING_CONFIG.events.resepsi.date}`,
      cx,
      92,
      { align: "center" }
    );
    doc.text(
      `Pukul: ${WEDDING_CONFIG.events.resepsi.startTime} - ${WEDDING_CONFIG.events.resepsi.endTime} WIB`,
      cx,
      97,
      { align: "center" }
    );
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    doc.text("BERTEMPAT DI:", cx, 115, { align: "center" });
    doc.setFont("times", "normal");
    doc.setFontSize(11);
    doc.text(WEDDING_CONFIG.venue.name, cx, 122, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    const addr = doc.splitTextToSize(WEDDING_CONFIG.venue.address, 80);
    doc.text(addr, cx, 128, { align: "center" });
    const qrSize = 22;
    const qrY = 145;
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(
      cx - qrSize / 2 - 1.5,
      qrY - 1.5,
      qrSize + 3,
      qrSize + 3,
      1,
      1
    );
    doc.addImage(qrMapsImg, "PNG", cx - qrSize / 2, qrY, qrSize, qrSize);
    doc.text("Scan Google Maps", cx, qrY + qrSize + 5, { align: "center" });
    doc.addPage();
    drawBorder(doc, width, height);
    drawCornerDecorations(doc, width, height);
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text("E-INVITATION", cx, 50, { align: "center" });
    const qrDigiSize = 40;
    const digiY = 60;
    doc.setFillColor(
      currentTheme.bg[0],
      currentTheme.bg[1],
      currentTheme.bg[2]
    );
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.3);
    doc.roundedRect(
      cx - qrDigiSize / 2 - 2.5,
      digiY - 2.5,
      qrDigiSize + 5,
      qrDigiSize + 5,
      2,
      2,
      "FD"
    );
    doc.setDrawColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.setLineWidth(0.4);
    doc.roundedRect(
      cx - qrDigiSize / 2 - 2,
      digiY - 2,
      qrDigiSize + 4,
      qrDigiSize + 4,
      1.5,
      1.5,
      "D"
    );
    doc.addImage(
      qrGuestImg,
      "PNG",
      cx - qrDigiSize / 2,
      digiY,
      qrDigiSize,
      qrDigiSize
    );
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(
      currentTheme.textMuted[0],
      currentTheme.textMuted[1],
      currentTheme.textMuted[2]
    );
    doc.text(
      "Scan untuk buka undangan digital & konfirmasi kehadiran",
      cx,
      digiY + qrDigiSize + 8,
      { align: "center" }
    );
    const closingY = 135;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(
      currentTheme.textMain[0],
      currentTheme.textMain[1],
      currentTheme.textMain[2]
    );
    const closing = doc.splitTextToSize(WEDDING_TEXT.closing.text, width - 60);
    doc.text(closing, cx, closingY, { align: "center" });
    doc.setFont("times", "bolditalic");
    doc.text(WEDDING_TEXT.closing.salam, cx, closingY + 20, {
      align: "center"
    });
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text(WEDDING_TEXT.closing.signature, cx, closingY + 30, {
      align: "center"
    });
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(
      currentTheme.primary[0],
      currentTheme.primary[1],
      currentTheme.primary[2]
    );
    doc.text(
      `${WEDDING_CONFIG.couple.bride.name} & ${WEDDING_CONFIG.couple.groom.name}`,
      cx,
      closingY + 38,
      { align: "center" }
    );
    doc.setDrawColor(
      currentTheme.secondary[0],
      currentTheme.secondary[1],
      currentTheme.secondary[2]
    );
    doc.setLineWidth(0.1);
    for (let i = 0; i < 5; i++) {
      const xOffset = -10 + i * 5;
      doc.circle(cx + xOffset, closingY + 48, 0.4, "D");
    }
    return doc;
  };
  const handlePreview = async () => {
    if (!singleData.name) return;
    const doc = await generatePDFDoc(singleData);
    const pdfDataUri = doc.output("datauristring");
    setPreviewUri(pdfDataUri);
  };
  const downloadSingle = async () => {
    if (!singleData.name) return;
    const doc = await generatePDFDoc(singleData);
    handleSaveAs(
      doc.output("blob"),
      `Inv_${singleData.name.replace(/[^a-zA-Z0-9]/g, "_")}_${currentTheme.id}.pdf`
    );
  };
  const downloadTemplate = () => {
    const csvContent = "Nama Tamu,Alamat (Opsional)\nBapak Jokowi & Ibu Iriana,Jakarta\nTeman-teman Alumni SMA 1,Di Tempat\nKeluarga Besar H. Syarif,Bandung";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    handleSaveAs(blob, "template_undangan_pdf.csv");
  };
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsReadingCsv(true);
    setTimeout(() => {
      Papa.parse(file, {
        complete: (results) => {
          const guests = [];
          results.data.forEach((row) => {
            const name = row[0];
            const address = row[1] || "Di Tempat";
            if (name && typeof name === "string" && name.trim() !== "") {
              if (!name.toLowerCase().includes("nama tamu")) {
                guests.push({ name: name.trim(), address: address.trim() });
              }
            }
          });
          setBulkData(guests);
          setIsReadingCsv(false);
        },
        header: false
      });
    }, 100);
  };
  const processBulk = async () => {
    if (bulkData.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setStatusMsg("Menyiapkan assets...");
    try {
      const zip = new JSZip();
      const folder = zip.folder(`Undangan_${currentTheme.name}_Floral`);
      const CHUNK_SIZE = 10;
      for (let i = 0; i < bulkData.length; i += CHUNK_SIZE) {
        const chunk = bulkData.slice(i, i + CHUNK_SIZE);
        setStatusMsg(
          `Generating PDF ${i + 1} - ${Math.min(i + chunk.length, bulkData.length)} dari ${bulkData.length}...`
        );
        await Promise.all(
          chunk.map(async (guest, idx) => {
            const doc = await generatePDFDoc(guest);
            const blob = doc.output("blob");
            const safeName = guest.name.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50);
            folder?.file(`${i + idx + 1}_${safeName}.pdf`, blob);
          })
        );
        const currentCount = Math.min(i + CHUNK_SIZE, bulkData.length);
        setProgress(Math.round(currentCount / bulkData.length * 100));
        await new Promise((r) => setTimeout(r, 20));
      }
      setStatusMsg("Mengompres ZIP...");
      const content = await zip.generateAsync({ type: "blob" });
      handleSaveAs(
        content,
        `Undangan-${currentTheme.id}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.zip`
      );
      setStatusMsg("Selesai!");
    } catch (error) {
      console.error("Gagal generate bulk:", error);
      alert("Terjadi kesalahan sistem saat memproses PDF.");
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
        setStatusMsg("");
      }, 1e3);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-1.5 shadow-sm dark:from-slate-800 dark:to-slate-900", children: [
        /* @__PURE__ */ jsx("div", { className: "h-2 w-2 animate-pulse rounded-full bg-emerald-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400", children: "Premium Edition" })
      ] }),
      /* @__PURE__ */ jsx("h3", { className: "bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text font-serif text-3xl font-bold text-transparent dark:from-white dark:to-slate-300", children: "Floral PDF Invitation" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400", children: "Template Floral Elegan (4 Halaman A5) dengan Ornamen Vektor, QR Code & Multi-Theme Support" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-bold tracking-widest text-slate-400 uppercase", children: "Pilih Nuansa Warna" }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: THEMES.map((theme) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => {
            setCurrentTheme(theme);
            setPreviewUri(null);
          },
          className: `group relative flex h-16 w-16 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${currentTheme.id === theme.id ? "scale-110 border-slate-800 ring-4 ring-slate-200 dark:border-white dark:ring-slate-700" : "border-transparent hover:border-slate-300 dark:hover:border-slate-600"}`,
          style: {
            backgroundColor: `rgb(${theme.bg[0]},${theme.bg[1]},${theme.bg[2]})`
          },
          title: theme.name,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "relative h-9 w-9", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute top-0 right-0 h-6 w-6 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900",
                  style: {
                    backgroundColor: `rgb(${theme.primary[0]},${theme.primary[1]},${theme.primary[2]})`
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute bottom-0 left-0 h-6 w-6 rounded-tl-xl rounded-br-xl border-2 border-white shadow-md transition-transform group-hover:scale-110 dark:border-slate-900",
                  style: {
                    backgroundColor: `rgb(${theme.secondary[0]},${theme.secondary[1]},${theme.secondary[2]})`
                  }
                }
              )
            ] }),
            currentTheme.id === theme.id && /* @__PURE__ */ jsx("div", { className: "absolute -bottom-3 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 px-3 py-1 text-[10px] font-bold whitespace-nowrap text-white shadow-lg dark:from-white dark:to-slate-100 dark:text-slate-900", children: theme.name })
          ]
        },
        theme.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-900", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("single"),
          className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "single" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
          children: "Manual (Satuan)"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveTab("bulk"),
          className: `rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === "bulk" ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`,
          children: "Import CSV (Banyak)"
        }
      )
    ] }) }),
    activeTab === "single" && /* @__PURE__ */ jsxs("div", { className: "grid items-start gap-8 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest text-slate-400 uppercase", children: "Nama Tamu" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: singleData.name,
                onChange: (e) => setSingleData({ ...singleData, name: e.target.value }),
                placeholder: "Contoh: Bpk. Habibie & Keluarga",
                className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-lg focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-xs font-bold tracking-widest text-slate-400 uppercase", children: "Alamat / Kota (Opsional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: singleData.address,
                onChange: (e) => setSingleData({ ...singleData, address: e.target.value }),
                placeholder: "Jakarta Selatan",
                className: "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base focus:ring-2 focus:ring-slate-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handlePreview,
              disabled: !singleData.name,
              className: "flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-800",
              children: [
                /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" }),
                " Preview"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: downloadSingle,
              disabled: !singleData.name,
              className: "flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-800 py-3 text-xs font-bold text-white uppercase shadow-lg hover:bg-slate-900 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
              children: [
                /* @__PURE__ */ jsx(Printer, { className: "h-4 w-4" }),
                " Download PDF"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex min-h-[400px] items-center justify-center rounded-xl bg-slate-200 p-4 dark:bg-slate-900/50", children: previewUri ? /* @__PURE__ */ jsx(
        "iframe",
        {
          src: previewUri,
          className: "h-[500px] w-full rounded-lg bg-white shadow-2xl",
          title: "PDF Preview"
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "text-center text-slate-400", children: [
        /* @__PURE__ */ jsx(FileSpreadsheet, { className: "mx-auto mb-2 h-12 w-12 opacity-50" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Masukkan data & klik Preview" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-slate-500", children: "(Ornamen bunga dirender menggunakan vektor PDF)" })
      ] }) })
    ] }),
    activeTab === "bulk" && /* @__PURE__ */ jsx("div", { className: "animate-reveal space-y-8", children: bulkData.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "space-y-6 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-800/50", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300", children: isReadingCsv ? /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin" }) : /* @__PURE__ */ jsx(Upload, { className: "h-8 w-8" }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-800 dark:text-white", children: isReadingCsv ? "Membaca File CSV..." : "Upload Database Tamu" }),
        /* @__PURE__ */ jsxs("p", { className: "mx-auto max-w-md text-sm text-slate-500", children: [
          "Siapkan file CSV dengan format:",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("strong", { children: "Kolom 1: Nama Tamu" }),
          " |",
          " ",
          /* @__PURE__ */ jsx("strong", { children: "Kolom 2: Alamat/Kota (Opsional)" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-2", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: downloadTemplate,
            className: "inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-white hover:shadow-sm dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700",
            children: [
              /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
              "Download Template CSV"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs(
        "label",
        {
          className: `inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:opacity-90 dark:bg-white dark:text-slate-900 ${isReadingCsv ? "pointer-events-none opacity-50" : ""}`,
          children: [
            "Pilih File CSV",
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "file",
                accept: ".csv",
                onChange: handleFileUpload,
                className: "hidden",
                disabled: isReadingCsv
              }
            )
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:flex-row md:items-center md:justify-between dark:border-blue-900/30 dark:bg-blue-900/10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-blue-100 p-2 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-300", children: bulkData.length }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-slate-700 dark:text-blue-100", children: "Tamu Terdeteksi" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
              "Tema:",
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-bold", children: currentTheme.name })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (confirm("Yakin ingin menghapus semua data?"))
                  setBulkData([]);
              },
              className: "group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-5 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-100 hover:shadow-sm active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30",
              children: [
                /* @__PURE__ */ jsx(RefreshCcw, { className: "h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" }),
                "Reset Data"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: processBulk,
              disabled: isProcessing,
              className: "group relative flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 px-8 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-slate-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200",
              children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex items-center gap-2", children: [
                isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" }),
                /* @__PURE__ */ jsx("span", { children: isProcessing ? "Memproses..." : "Download ZIP" })
              ] })
            }
          )
        ] })
      ] }),
      isProcessing && /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400", children: [
          /* @__PURE__ */ jsx("span", { children: statusMsg }),
          /* @__PURE__ */ jsxs("span", { children: [
            progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full rounded-full bg-blue-600 transition-all duration-300 ease-out",
            style: { width: `${progress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "custom-scrollbar grid max-h-[400px] grid-cols-1 gap-3 overflow-y-auto pr-2 md:grid-cols-2 lg:grid-cols-3", children: bulkData.map((guest, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500 dark:bg-slate-700", children: idx + 1 }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "truncate text-xs font-bold text-slate-700 dark:text-slate-300", children: guest.name }),
                /* @__PURE__ */ jsx("p", { className: "truncate text-[10px] text-slate-400", children: guest.address })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500" })
          ]
        },
        idx
      )) })
    ] }) })
  ] });
};

const DataTable = ({
  data,
  columns,
  onEdit,
  onDelete,
  onBulkDelete
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const filteredData = useMemo(() => {
    return data.filter(
      (item) => Object.values(item).some(
        (val) => String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);
  useEffect(() => {
    setPage(1);
  }, [search]);
  useEffect(() => {
    setSelected([]);
  }, [data]);
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(paginatedData.map((d) => d.id));
    } else {
      setSelected([]);
    }
  };
  const handleSelectOne = (id) => {
    setSelected(
      (prev) => prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };
  const executeBulkDelete = () => {
    if (onBulkDelete && selected.length > 0) {
      if (confirm(`Yakin hapus ${selected.length} data terpilih?`)) {
        onBulkDelete(selected);
        setSelected([]);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-between gap-4 md:flex-row md:items-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "select",
          {
            value: pageSize,
            onChange: (e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            },
            className: "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800",
            children: [5, 10, 25, 50].map((size) => /* @__PURE__ */ jsxs("option", { value: size, children: [
              size,
              " Data"
            ] }, size))
          }
        ),
        onBulkDelete && selected.length > 0 && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: executeBulkDelete,
            className: "flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400",
            children: [
              /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
              " Hapus (",
              selected.length,
              ")"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-64", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: "Cari data...",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "w-full rounded-lg border border-slate-200 py-2 pr-4 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left text-sm", children: [
      /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-xs text-slate-500 uppercase dark:bg-slate-900/50 dark:text-slate-400", children: /* @__PURE__ */ jsxs("tr", { children: [
        onBulkDelete && /* @__PURE__ */ jsx("th", { className: "w-4 px-6 py-4", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            onChange: handleSelectAll,
            checked: paginatedData.length > 0 && paginatedData.every((d) => selected.includes(d.id)),
            className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          }
        ) }),
        columns.map((col, idx) => /* @__PURE__ */ jsx(
          "th",
          {
            className: `px-6 py-4 font-bold ${col.className || ""}`,
            children: col.header
          },
          idx
        )),
        (onEdit || onDelete) && /* @__PURE__ */ jsx("th", { className: "px-6 py-4 text-right", children: "Aksi" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-700", children: paginatedData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
        "td",
        {
          colSpan: columns.length + (onBulkDelete ? 2 : onEdit ? 1 : 0),
          className: "px-6 py-8 text-center text-slate-400",
          children: "Tidak ada data ditemukan."
        }
      ) }) : paginatedData.map((item) => /* @__PURE__ */ jsxs(
        "tr",
        {
          className: "hover:bg-slate-50 dark:hover:bg-slate-700/50",
          children: [
            onBulkDelete && /* @__PURE__ */ jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: selected.includes(item.id),
                onChange: () => handleSelectOne(item.id),
                className: "rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              }
            ) }),
            columns.map((col, idx) => /* @__PURE__ */ jsx(
              "td",
              {
                className: `px-6 py-4 ${col.className || ""}`,
                children: typeof col.accessor === "function" ? col.accessor(item) : item[col.accessor]
              },
              idx
            )),
            (onEdit || onDelete) && /* @__PURE__ */ jsx("td", { className: "px-6 py-4 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-2", children: [
              onEdit && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => onEdit(item),
                  className: "rounded p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20",
                  title: "Edit",
                  children: /* @__PURE__ */ jsx(Edit, { className: "h-4 w-4" })
                }
              ),
              onDelete && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (confirm(
                      "Yakin hapus data ini secara permanen?"
                    ))
                      onDelete(item.id);
                  },
                  className: "rounded p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20",
                  title: "Hapus",
                  children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                }
              )
            ] }) })
          ]
        },
        item.id
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs text-slate-500", children: [
        "Halaman ",
        filteredData.length === 0 ? 0 : page,
        " dari ",
        totalPages,
        " ",
        "(Total ",
        filteredData.length,
        " Data)"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setPage(Math.max(1, page - 1)),
            disabled: page === 1,
            className: "rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800",
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setPage(Math.min(totalPages, page + 1)),
            disabled: page === totalPages || totalPages === 0,
            className: "rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800",
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
          }
        )
      ] })
    ] })
  ] });
};
const AdminDashboard = ({
  initialRsvps,
  initialWishes,
  siteUrl
}) => {
  const [activeTab, setActiveTab] = useState(
    "rsvp"
  );
  const [rsvps, setRsvps] = useState(initialRsvps);
  const [wishes, setWishes] = useState(initialWishes);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = async (type, ids) => {
    if (ids.length === 0) return;
    setIsDeleting(true);
    try {
      const actionKey = type === "rsvp" ? "delete_rsvp" : "delete_wish";
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: actionKey, ids })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        if (type === "rsvp")
          setRsvps((prev) => prev.filter((i) => !ids.includes(i.id)));
        if (type === "wish")
          setWishes((prev) => prev.filter((i) => !ids.includes(i.id)));
      } else {
        alert("Gagal menghapus: " + (json.error || "Unknown Error"));
      }
    } catch (e) {
      alert("Error Network: Gagal menghubungi server.");
    } finally {
      setIsDeleting(false);
    }
  };
  const handleUpdate = async (type, id, data) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: type === "rsvp" ? "update_rsvp" : "update_wish",
          id,
          data
        })
      });
      if (res.ok) {
        if (type === "rsvp") {
          setRsvps(
            (prev) => prev.map((item) => item.id === id ? { ...item, ...data } : item)
          );
        } else {
          setWishes(
            (prev) => prev.map((item) => item.id === id ? { ...item, ...data } : item)
          );
        }
        setIsModalOpen(false);
      } else {
        alert("Gagal update data.");
      }
    } catch (e) {
      alert("Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };
  const tabs = [
    { id: "rsvp", label: "Data RSVP", icon: Users },
    { id: "wishes", label: "Ucapan & Doa", icon: MessageCircle },
    { id: "qr", label: "QR Generator", icon: QrCode },
    { id: "pdf", label: "Design PDF", icon: Printer }
  ];
  return /* @__PURE__ */ jsxs("div", { children: [
    isDeleting && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 rounded-xl bg-white p-6 shadow-2xl", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-blue-600" }),
      /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-slate-700", children: "Menghapus Data..." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mb-8 flex gap-2 overflow-x-auto border-b border-slate-200 pb-1 dark:border-slate-700", children: tabs.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`,
        children: [
          /* @__PURE__ */ jsx(tab.icon, { className: "h-4 w-4" }),
          tab.label
        ]
      },
      tab.id
    )) }),
    activeTab === "rsvp" && /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/api/export-rsvp",
          target: "_blank",
          className: "flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-green-700",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            " EXPORT CSV"
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(
        DataTable,
        {
          data: rsvps,
          columns: [
            {
              header: "Nama Tamu",
              accessor: "guest_name",
              className: "font-medium"
            },
            {
              header: "Status",
              accessor: (item) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: `rounded-full px-2 py-1 text-[10px] font-bold uppercase ${item.attendance === "hadir" ? "bg-green-100 text-green-700" : item.attendance === "tidak_hadir" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`,
                  children: item.attendance.replace("_", " ")
                }
              )
            },
            { header: "Pax", accessor: "guest_count" },
            {
              header: "Pesan",
              accessor: (item) => /* @__PURE__ */ jsx("span", { className: "block max-w-[200px] truncate text-slate-500", children: item.message })
            },
            {
              header: "Waktu",
              accessor: (item) => new Date(item.created_at).toLocaleDateString("id-ID")
            }
          ],
          onEdit: (item) => {
            setEditingItem(item);
            setIsModalOpen(true);
          },
          onDelete: (id) => handleDelete("rsvp", [id]),
          onBulkDelete: (ids) => handleDelete("rsvp", ids)
        }
      )
    ] }),
    activeTab === "wishes" && /* @__PURE__ */ jsxs("div", { className: "animate-reveal space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "/api/export-wishes",
          target: "_blank",
          className: "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
            " EXPORT CSV"
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(
        DataTable,
        {
          data: wishes,
          columns: [
            {
              header: "Nama Pengirim",
              accessor: "name",
              className: "font-medium"
            },
            {
              header: "Ucapan",
              accessor: (item) => /* @__PURE__ */ jsxs("span", { className: "block max-w-[300px] text-wrap text-slate-500 italic", children: [
                '"',
                item.message,
                '"'
              ] })
            },
            {
              header: "Waktu",
              accessor: (item) => new Date(item.created_at).toLocaleDateString("id-ID")
            }
          ],
          onEdit: (item) => {
            setEditingItem(item);
            setIsModalOpen(true);
          },
          onDelete: (id) => handleDelete("wish", [id]),
          onBulkDelete: (ids) => handleDelete("wish", ids)
        }
      )
    ] }),
    activeTab === "qr" && /* @__PURE__ */ jsx("div", { className: "animate-reveal rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800", children: /* @__PURE__ */ jsx(QRCodeManager, { siteUrl }) }),
    activeTab === "pdf" && /* @__PURE__ */ jsx("div", { className: "animate-reveal rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800", children: /* @__PURE__ */ jsx(InvitationManager, {}) }),
    isModalOpen && editingItem && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold dark:text-white", children: "Edit Data" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsModalOpen(false), children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-slate-400" }) })
      ] }),
      /* @__PURE__ */ jsxs(
        "form",
        {
          onSubmit: (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            handleUpdate(
              activeTab === "rsvp" ? "rsvp" : "wish",
              editingItem.id,
              data
            );
          },
          className: "space-y-4",
          children: [
            activeTab === "rsvp" ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase", children: "Nama Tamu" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "guest_name",
                    defaultValue: editingItem.guest_name,
                    className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase", children: "Status" }),
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      name: "attendance",
                      defaultValue: editingItem.attendance,
                      className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "hadir", children: "Hadir" }),
                        /* @__PURE__ */ jsx("option", { value: "ragu", children: "Ragu" }),
                        /* @__PURE__ */ jsx("option", { value: "tidak_hadir", children: "Tidak Hadir" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase", children: "Pax" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "number",
                      name: "guest_count",
                      defaultValue: editingItem.guest_count,
                      min: 1,
                      className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase", children: "Pesan" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    name: "message",
                    defaultValue: editingItem.message,
                    className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
                    rows: 3
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase", children: "Nama Pengirim" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    name: "name",
                    defaultValue: editingItem.name,
                    className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-slate-500 uppercase", children: "Ucapan" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    name: "message",
                    defaultValue: editingItem.message,
                    className: "w-full rounded-lg border p-2 dark:border-slate-600 dark:bg-slate-700 dark:text-white",
                    rows: 5,
                    required: true
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-700", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setIsModalOpen(false),
                  className: "rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700",
                  children: "Batal"
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "submit",
                  disabled: isSaving,
                  className: "flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50",
                  children: [
                    isSaving ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4" }),
                    " ",
                    "Simpan"
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] }) })
  ] });
};

const $$Astro = createAstro("http://127.0.0.1:4321");
const $$Admin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Admin;
  const ADMIN_PASSWORD = "P@ssw0rd";
  const COOKIE_NAME = "wedding_admin_auth";
  if (Astro2.request.method === "POST") {
    const formData = await Astro2.request.formData();
    const action = formData.get("action");
    if (action === "login") {
      const passwordInput = formData.get("password")?.toString();
      if (passwordInput === ADMIN_PASSWORD) {
        Astro2.cookies.set(COOKIE_NAME, "true", {
          path: "/",
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24
        });
        return Astro2.redirect("/admin");
      }
    }
    if (action === "logout") {
      Astro2.cookies.delete(COOKIE_NAME, { path: "/" });
      return Astro2.redirect("/admin");
    }
  }
  const isAuthenticated = Astro2.cookies.has(COOKIE_NAME);
  let rsvps = [], wishes = [], stats = { total: 0, hadir: 0, ragu: 0, tidak: 0, guestCount: 0 };
  if (isAuthenticated) {
    rsvps = db.prepare("SELECT * FROM rsvps ORDER BY created_at DESC").all();
    wishes = db.prepare("SELECT * FROM wishes ORDER BY created_at DESC").all();
    stats.total = rsvps.length;
    stats.hadir = rsvps.filter((r) => r.attendance === "hadir").length;
    stats.ragu = rsvps.filter((r) => r.attendance === "ragu").length;
    stats.tidak = rsvps.filter((r) => r.attendance === "tidak_hadir").length;
    stats.guestCount = rsvps.filter((r) => r.attendance === "hadir").reduce((sum, r) => sum + (r.guest_count || 1), 0);
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Admin Dashboard" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-200"> ${!isAuthenticated ? renderTemplate`<div class="flex h-screen w-full items-center justify-center px-4"> <div class="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl dark:bg-slate-800"> <div class="text-center"> <h1 class="font-serif text-3xl font-bold text-slate-900 italic dark:text-white">
Admin Access
</h1> </div> <form method="POST" class="mt-8 space-y-6"> <input type="hidden" name="action" value="login"> <input type="password" name="password" required class="block w-full rounded-lg border border-slate-300 bg-slate-50 p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-700 dark:text-white" placeholder="Password..."> <button type="submit" class="w-full rounded-lg bg-slate-900 px-4 py-4 text-sm font-bold text-white hover:bg-slate-800 dark:bg-blue-600">
MASUK
</button> </form> </div> </div>` : renderTemplate`<div class="container mx-auto max-w-7xl px-4 py-10"> <div class="mb-10 flex flex-col items-center justify-between gap-4 md:flex-row"> <div> <h1 class="font-serif text-3xl font-bold italic md:text-4xl">
Wedding Dashboard
</h1> <p class="text-sm text-slate-500 dark:text-slate-400">
Selamat datang, Admin
</p> </div> <form method="POST"> <input type="hidden" name="action" value="logout"> <button class="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2 text-xs font-bold text-red-600 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400"> ${renderComponent($$result2, "LogOut", LogOut, { "className": "h-4 w-4" })} LOGOUT
</button> </form> </div>  <div class="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6"> <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"> <div class="flex items-center gap-3 text-slate-400"> ${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Users", Users, { "className": "h-5 w-5" })} <span class="text-xs font-bold uppercase">Total Respon</span> ` })} </div> <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white"> ${stats.total} </p> </div> <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"> <div class="flex items-center gap-3 text-green-500"> ${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "CheckCircle2", CheckCircle2, { "className": "h-5 w-5" })} <span class="text-xs font-bold uppercase">Hadir</span> ` })} </div> <div class="mt-2 flex items-baseline gap-2"> ${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` <span class="text-3xl font-bold text-slate-900 dark:text-white"> ${stats.hadir} </span> <span class="text-lg font-medium text-slate-400">
(${stats.guestCount} Pax)
</span> ` })} </div> </div> <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"> <div class="flex items-center gap-3 text-yellow-500"> ${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "HelpCircle", HelpCircle, { "className": "h-5 w-5" })} <span class="text-xs font-bold uppercase">Ragu</span> ` })} </div> <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white"> ${stats.ragu} </p> </div> <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-800"> <div class="flex items-center gap-3 text-red-500"> ${renderComponent($$result2, "Fragment", Fragment$1, {}, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "XCircle", XCircle, { "className": "h-5 w-5" })} <span class="text-xs font-bold uppercase">Tidak Hadir</span> ` })} </div> <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white"> ${stats.tidak} </p> </div> </div>  ${renderComponent($$result2, "AdminDashboard", AdminDashboard, { "client:load": true, "initialRsvps": rsvps, "initialWishes": wishes, "siteUrl": Astro2.site?.toString() || "https://wedding.feyaya.com", "client:component-hydration": "load", "client:component-path": "C:/Users/oasis/Documents/GitHub/Invitation/src/components/Admin/AdminDashboard", "client:component-export": "default" })} </div>`} </main> ` })}`;
}, "C:/Users/oasis/Documents/GitHub/Invitation/src/pages/admin.astro", void 0);
const $$file = "C:/Users/oasis/Documents/GitHub/Invitation/src/pages/admin.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Admin,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
