import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CAXGiXUR.mjs';
import { manifest } from './manifest_C6ab2jGt.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin.astro.mjs');
const _page3 = () => import('./pages/api/admin.astro.mjs');
const _page4 = () => import('./pages/api/export-rsvp.astro.mjs');
const _page5 = () => import('./pages/api/export-wishes.astro.mjs');
const _page6 = () => import('./pages/api/rsvp.astro.mjs');
const _page7 = () => import('./pages/api/wishes.astro.mjs');
const _page8 = () => import('./pages/qrcode.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin.astro", _page2],
    ["src/pages/api/admin.ts", _page3],
    ["src/pages/api/export-rsvp.ts", _page4],
    ["src/pages/api/export-wishes.ts", _page5],
    ["src/pages/api/rsvp.ts", _page6],
    ["src/pages/api/wishes.ts", _page7],
    ["src/pages/qrcode.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///C:/Users/oasis/Documents/GitHub/Invitation/dist/client/",
    "server": "file:///C:/Users/oasis/Documents/GitHub/Invitation/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro",
    "experimentalStaticHeaders": false
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
