import { e as createAstro, f as createComponent, r as renderTemplate, n as renderSlot, o as renderHead, h as addAttribute } from './astro/server_oVdgqn8w.mjs';
import 'piccolore';
import 'clsx';
/* empty css                         */

const parseJson = (jsonString, defaultValue) => {
  if (!jsonString) return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("Failed to parse JSON env:", e);
    return defaultValue;
  }
};
const WEDDING_TEXT = {
  // 1. Salam Pembuka (Hero / Profile)
  opening: {
    salam: "Assalamu’alaikum Warahmatullahi Wabarakatuh"},
  // 2. Ayat Suci / Quotes (Ar-Rum: 21 adalah standar emas yang penuh doa)
  quote: {
    ar_rum: `"Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran Allah) bagi kaum yang berpikir."`},
  // 4. Penutup (Footer)
  closing: {
    text: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kami.",
    salam: "Wassalamu’alaikum Warahmatullahi Wabarakatuh",
    signature: "Kami yang berbahagia,"}};
const WEDDING_CONFIG = {
  couple: {
    bride: {
      name: "Putri",
      fullName: "Nandyar Astari Putri S.H.",
      parents: "Putri tercinta dari Bpk. Anang Barmawi & Ibu Marmiyati",
      instagram: "Putri",
      image: "https://images.unsplash.com/photo-1767444370192-26c530248925?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    groom: {
      name: "Hifni",
      fullName: "Mohammad Hifni Iskandar Shah S.H.",
      parents: "Putra tercinta dari Bpk. Mohammad Arief Wicaksono S.H. & Ibu Siti Endah Minasih S.Pd.I.",
      instagram: "Hifni",
      image: "https://images.unsplash.com/photo-1767444370181-bc7ae960592c?q=80&w=721&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
  },
  venue: {
    name: "The Gade Village Balkondes Ngargogondo",
    address: "Jl. Malangan Raya, Karang Bawang, Ngargogondo, Kec. Borobudur, Kabupaten Magelang",
    latitude: parseFloat("-7.624068021831519"),
    longitude: parseFloat("110.21052203148491")
  },
  events: {
    akad: {
      title: "Akad Nikah",
      day: "Minggu",
      date: "11 Januari 2026",
      startTime: "08:00",
      endTime: "10.00",
      loc: "Gedung Tea Desa Treko Kec. Mungkid Kab. Magelang",
      startDateTime: /* @__PURE__ */ new Date(
        "2026-01-11T08:00:00+07:00"
      ),
      endDateTime: /* @__PURE__ */ new Date(
        "2026-01-11T10:00:00+07:00"
      )
    },
    resepsi: {
      title: "Resepsi Pernikahan",
      day: "Minggu",
      date: "11 Januari 2026",
      startTime: "11:00",
      endTime: "13:00",
      loc: "Gedung Tea Desa Treko Kec. Mungkid Kab. Magelang",
      startDateTime: /* @__PURE__ */ new Date(
        "2026-01-11T11:00:00+07:00"
      ),
      endDateTime: /* @__PURE__ */ new Date(
        "2026-01-11T13:00:00+07:00"
      )
    },
    ngunduh: {
      title: "Ngunduh Mantu",
      day: "Minggu",
      date: "17 Januari 2026",
      loc: "",
      startTime: "10:00",
      endTime: "12:00",
      startDateTime: /* @__PURE__ */ new Date(
        "2026-01-17T10:00:00+07:00"
      ),
      endDateTime: /* @__PURE__ */ new Date(
        "2026-01-17T12:00:00+07:00"
      )
    }
  },
  hero: {
    image: "https://images.unsplash.com/photo-1767444166562-a978f367a90d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    city: "Kec. Borobudur, Kabupaten Magelang"
  }
};
parseJson('[{"date":"2020","title":"Awal Pertemuan","desc":"Atas izin Allah, kami dipertemukan dalam suasana yang sederhana namun penuh makna."},{"date":"2022","title":"Menjalin Harapan","desc":"Dengan niat baik, kami memutuskan untuk saling mengenal dan membangun komitmen menuju ridho-Nya."},{"date":"2025","title":"Ikatan Suci","desc":"Insya Allah, kami memantapkan hati untuk menyempurnakan separuh agama dalam ikatan pernikahan."}]', [
  {
    date: "Musim Gugur, 2020",
    title: "Pertemuan Pertama",
    desc: "Berawal dari sebuah diskusi kecil..."
  }
]);
parseJson('[{"bank":"Bank BRI","number":"680001032161531","name":"NANDYAR ASTARI PUTRI"}]', [
  { bank: "Bank BRI", number: "680001032161531", name: "NANDYAR ASTARI PUTRI" }
]);
parseJson('["https://images.unsplash.com/photo-1767444166490-4e14b8d56042?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1767444166320-ba172624be37?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1767444166386-043c93090551?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1767444166917-ddb9cf66978f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1767444167124-117aa276073d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","https://images.unsplash.com/photo-1767444166523-0b41cf4c2787?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"]', [
  "https://placehold.co/800x1200",
  "https://placehold.co/1200x800"
]);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("http://127.0.0.1:4321");
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title = `The Wedding of Putri & Hifni`,
    description = `Kami mengundang Anda untuk hadir di pernikahan kami pada ${WEDDING_CONFIG.events.akad.date}.`,
    image = "/thumbnail.png"
  } = Astro2.props;
  const canonicalURL = new URL(
    Astro2.url.pathname,
    Astro2.site || "https://wedding.feyaya.com"
  );
  return renderTemplate(_a || (_a = __template(['<html lang="id" class="scroll-smooth"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/groom.svg"><meta name="generator"', "><!-- SEO Primary --><title>", '</title><meta name="title"', '><meta name="description"', '><link rel="canonical"', '><!-- Open Graph / Facebook / WhatsApp --><meta property="og:type" content="website"><meta property="og:url"', '><meta property="og:title"', '><meta property="og:description"', '><meta property="og:image"', '><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url"', '><meta property="twitter:title"', '><meta property="twitter:description"', '><meta property="twitter:image"', '><!-- PWA Theme Color (Sama dengan bg di manifest) --><meta name="theme-color" content="#020617"><!-- PWA Link Manifest (Otomatis digenerate plugin, tapi baiknya didefinisikan untuk fallback) --><link rel="manifest" href="/manifest.webmanifest"><!-- Untuk iOS Safari --><meta name="apple-mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><!-- Fonts --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Outfit:wght@100;200;300;400;500;600&display=swap" rel="stylesheet">', '</head> <body> <script>\n      const theme = (() => {\n        if (\n          typeof localStorage !== "undefined" &&\n          localStorage.getItem("theme")\n        ) {\n          return localStorage.getItem("theme");\n        }\n        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {\n          return "dark";\n        }\n        return "light";\n      })();\n\n      if (theme === "dark") {\n        document.documentElement.classList.add("dark");\n      } else {\n        document.documentElement.classList.remove("dark");\n      }\n    <\/script> ', " </body></html>"])), addAttribute(Astro2.generator, "content"), title, addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(canonicalURL, "href"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), addAttribute(canonicalURL, "content"), addAttribute(title, "content"), addAttribute(description, "content"), addAttribute(image, "content"), renderHead(), renderSlot($$result, $$slots["default"]));
}, "C:/Users/oasis/Documents/GitHub/Invitation/src/layouts/Layout.astro", void 0);

export { $$Layout as $, WEDDING_CONFIG as W, WEDDING_TEXT as a };
