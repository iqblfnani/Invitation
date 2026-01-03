import{c as h,W as x,j as e,D as g}from"./constants.Ksv9PyRJ.js";import{r as n}from"./index.TcFrwHGi.js";import{Q as f}from"./index.Zrr6PRrB.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",key:"1cjeqo"}],["path",{d:"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",key:"19qd67"}]],w=h("link",b),N=({siteUrl:r})=>{const[a,m]=n.useState(""),i=n.useRef(null),d=r?.endsWith("/")?r.slice(0,-1):r||"",o=()=>a?`${d}/?to=${encodeURIComponent(a.trim())}`:d,c=n.useMemo(()=>{try{const t=(x?.couple?.bride?.name||"B").charAt(0).toUpperCase(),l=(x?.couple?.groom?.name||"G").charAt(0).toUpperCase(),s=`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#B45309;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- Background Putih -->
          <circle cx="50" cy="50" r="48" fill="white" />
          
          <!-- Border Emas -->
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGradient)" stroke-width="2" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" stroke-width="1" />

          <!-- Teks Inisial Serif -->
          <g font-family="'Times New Roman', Times, serif" font-weight="bold" font-size="40" fill="#334155" text-anchor="middle">
             <text x="26" y="64">${t}</text>
             <text x="74" y="64">${l}</text>
          </g>

          <!-- Hati Merah -->
          <path d="M50 38 
                   C 46 32, 36 33, 36 42 
                   C 36 52, 50 64, 50 64 
                   C 50 64, 64 52, 64 42 
                   C 64 33, 54 32, 50 38 Z" 
                fill="#e11d48" 
                stroke="white" 
                stroke-width="1.5" />
        </svg>
      `.trim();return`data:image/svg+xml;base64,${btoa(s)}`}catch(t){return console.error("Logo Generation Error:",t),""}},[]),p=()=>{const t=i.current;if(t){const l=t.toDataURL("image/png"),s=document.createElement("a");s.href=l,s.download=`QR-${a||"Wedding"}.png`,document.body.appendChild(s),s.click(),document.body.removeChild(s)}},u=()=>{navigator.clipboard.writeText(o()),alert("Link berhasil disalin!")};return e.jsxs("div",{className:"animate-reveal grid items-center gap-10 md:grid-cols-2",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-xs font-bold tracking-widest text-slate-400 uppercase",children:"Nama Tamu"}),e.jsx("input",{type:"text",value:a,onChange:t=>m(t.target.value),placeholder:"Contoh: Ahmad SYarief Ramadhan & Partner",className:"w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-lg transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"}),e.jsx("p",{className:"text-xs text-slate-400 italic",children:"*Nama akan otomatis muncul di sampul undangan & form RSVP."})]}),e.jsx("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs break-all text-slate-500 dark:border-slate-700 dark:bg-slate-900/50",children:o()}),e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("button",{onClick:u,className:"flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",children:[e.jsx(w,{className:"h-4 w-4"})," Copy Link"]}),e.jsxs("button",{onClick:p,disabled:!a,className:"flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white uppercase shadow-lg transition-colors hover:bg-blue-700 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-50",children:[e.jsx(g,{className:"h-4 w-4"})," Download QR"]})]})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-white/5",children:[e.jsx("div",{className:"rounded-2xl border border-slate-100 bg-white p-6 shadow-xl",children:e.jsx(f,{ref:i,value:o(),size:280,level:"H",includeMargin:!0,imageSettings:c?{src:c,height:60,width:60,excavate:!0}:void 0})}),e.jsxs("div",{className:"mt-8 space-y-1 text-center",children:[e.jsx("p",{className:"text-sm font-bold tracking-widest text-slate-400 uppercase",children:"Preview Result"}),a&&e.jsxs("p",{className:"font-serif text-lg text-slate-800 italic dark:text-white",children:['"',a,'"']})]})]})]})};export{N as default};
