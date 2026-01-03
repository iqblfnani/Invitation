import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_oVdgqn8w.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D_hH-HRE.mjs';
import { Heart } from 'lucide-react';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Page Not Found" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-center text-white"> <div class="pointer-events-none absolute inset-0 opacity-20"> ${renderComponent($$result2, "Heart", Heart, { "className": "absolute top-1/2 left-1/2 h-[120vw] w-[120vw] -translate-x-1/2 -translate-y-1/2 stroke-[0.1]" })} </div> <div class="relative z-10 space-y-6"> <h1 class="font-serif text-9xl text-white/20 italic">404</h1> <h2 class="font-serif text-4xl italic md:text-6xl">
Halaman Tidak Ditemukan
</h2> <p class="mx-auto max-w-md font-light text-white/60">
Maaf, sepertinya Anda tersesat. Silakan kembali ke halaman utama
        undangan kami.
</p> <a href="/" class="mt-8 inline-block rounded-full bg-white px-10 py-4 text-xs font-bold tracking-widest text-slate-950 uppercase transition-colors hover:bg-slate-200">
Kembali ke Undangan
</a> </div> </main> ` })}`;
}, "C:/Users/oasis/Documents/GitHub/Invitation/src/pages/404.astro", void 0);

const $$file = "C:/Users/oasis/Documents/GitHub/Invitation/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
