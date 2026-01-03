import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_oVdgqn8w.mjs';
import 'piccolore';
import { $ as $$Layout } from '../chunks/Layout_D_hH-HRE.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "The Wedding of Putri & Hifni" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/oasis/Documents/GitHub/Invitation/src/App", "client:component-export": "default" })} ` })}`;
}, "C:/Users/oasis/Documents/GitHub/Invitation/src/pages/index.astro", void 0);

const $$file = "C:/Users/oasis/Documents/GitHub/Invitation/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
