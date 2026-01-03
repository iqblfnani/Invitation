import { dns } from 'node:dns';

const requestLog = /* @__PURE__ */ new Map();
const checkRateLimit = (ip, limit = 5, windowMs = 6e4) => {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];
  const recentRequests = timestamps.filter((time) => now - time < windowMs);
  if (recentRequests.length >= limit) {
    return false;
  }
  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  if (requestLog.size > 1e3) requestLog.clear();
  return true;
};

if (typeof dns !== "undefined" && dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder("ipv4first");
}
const sendTelegramNotification = async (text) => {
  {
    console.warn("⚠️ Telegram Token/Chat ID belum diset di .env");
    return;
  }
};

export { checkRateLimit as c, sendTelegramNotification as s };
