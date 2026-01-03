import 'piccolore';
import { p as decodeKey } from './chunks/astro/server_oVdgqn8w.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DKiOE4pU.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/oasis/Documents/GitHub/Invitation/","cacheDir":"file:///C:/Users/oasis/Documents/GitHub/Invitation/node_modules/.astro/","outDir":"file:///C:/Users/oasis/Documents/GitHub/Invitation/dist/","srcDir":"file:///C:/Users/oasis/Documents/GitHub/Invitation/src/","publicDir":"file:///C:/Users/oasis/Documents/GitHub/Invitation/public/","buildClientDir":"file:///C:/Users/oasis/Documents/GitHub/Invitation/dist/client/","buildServerDir":"file:///C:/Users/oasis/Documents/GitHub/Invitation/dist/server/","adapterName":"@astrojs/node","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/node.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BPjgkHTN.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BPjgkHTN.css"}],"routeData":{"route":"/admin","isIndex":false,"type":"page","pattern":"^\\/admin\\/?$","segments":[[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/admin.astro","pathname":"/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/admin","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/admin\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/admin.ts","pathname":"/api/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/export-rsvp","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/export-rsvp\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"export-rsvp","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/export-rsvp.ts","pathname":"/api/export-rsvp","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/export-wishes","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/export-wishes\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"export-wishes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/export-wishes.ts","pathname":"/api/export-wishes","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/rsvp","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/rsvp\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"rsvp","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/rsvp.ts","pathname":"/api/rsvp","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/wishes","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/wishes\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"wishes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/wishes.ts","pathname":"/api/wishes","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BPjgkHTN.css"}],"routeData":{"route":"/qrcode","isIndex":false,"type":"page","pattern":"^\\/qrcode\\/?$","segments":[[{"content":"qrcode","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/qrcode.astro","pathname":"/qrcode","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/admin.BPjgkHTN.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"site":"http://127.0.0.1:4321","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/oasis/Documents/GitHub/Invitation/src/pages/404.astro",{"propagation":"none","containsHead":true}],["C:/Users/oasis/Documents/GitHub/Invitation/src/pages/admin.astro",{"propagation":"none","containsHead":true}],["C:/Users/oasis/Documents/GitHub/Invitation/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/oasis/Documents/GitHub/Invitation/src/pages/qrcode.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/admin@_@astro":"pages/admin.astro.mjs","\u0000@astro-page:src/pages/api/admin@_@ts":"pages/api/admin.astro.mjs","\u0000@astro-page:src/pages/api/export-rsvp@_@ts":"pages/api/export-rsvp.astro.mjs","\u0000@astro-page:src/pages/api/export-wishes@_@ts":"pages/api/export-wishes.astro.mjs","\u0000@astro-page:src/pages/api/rsvp@_@ts":"pages/api/rsvp.astro.mjs","\u0000@astro-page:src/pages/api/wishes@_@ts":"pages/api/wishes.astro.mjs","\u0000@astro-page:src/pages/qrcode@_@astro":"pages/qrcode.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/node@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_C6ab2jGt.mjs","C:/Users/oasis/Documents/GitHub/Invitation/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","C:/Users/oasis/Documents/GitHub/Invitation/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_C4lYnRgb.mjs","C:/Users/oasis/Documents/GitHub/Invitation/src/components/QRCodeGenerator":"_astro/QRCodeGenerator.BvbkMicF.js","C:/Users/oasis/Documents/GitHub/Invitation/src/App":"_astro/App.FqpbuQVT.js","@astrojs/react/client.js":"_astro/client.xQwsnwNd.js","C:/Users/oasis/Documents/GitHub/Invitation/node_modules/html2canvas/dist/html2canvas.esm.js":"_astro/html2canvas.esm.B0tyYwQk.js","C:/Users/oasis/Documents/GitHub/Invitation/node_modules/dompurify/dist/purify.es.mjs":"_astro/purify.es.B9ZVCkUG.js","C:/Users/oasis/Documents/GitHub/Invitation/node_modules/canvg/lib/index.es.js":"_astro/index.es.DiWb81Ag.js","C:/Users/oasis/Documents/GitHub/Invitation/src/components/Admin/AdminDashboard":"_astro/AdminDashboard.Civ2VNgw.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/admin.BPjgkHTN.css","/016calendar_113716.svg","/favicon.svg","/groom.svg","/manifest.webmanifest","/pwa-192x192.png","/pwa-512x512.png","/registerSW.js","/robots.txt","/sw.js","/thumbnail.png","/workbox-1d305bb8.js","/_astro/AdminDashboard.Civ2VNgw.js","/_astro/AdminDashboard.Dg7fvTJ9.js","/_astro/App.FqpbuQVT.js","/_astro/client.xQwsnwNd.js","/_astro/constants.Ksv9PyRJ.js","/_astro/html2canvas.esm.B0tyYwQk.js","/_astro/index.es.DiWb81Ag.js","/_astro/index.TcFrwHGi.js","/_astro/index.Zrr6PRrB.js","/_astro/purify.es.B9ZVCkUG.js","/_astro/QRCodeGenerator.BvbkMicF.js","/_astro/x.CLNkkPBX.js"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"3zvhaaMFb52UNgKRYu1b8seFjok7uaoFGNlQ1vjRC4w=","sessionConfig":{"driver":"fs-lite","options":{"base":"C:\\Users\\oasis\\Documents\\GitHub\\Invitation\\node_modules\\.astro\\sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
