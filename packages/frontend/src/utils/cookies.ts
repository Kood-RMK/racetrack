
export function getBrowserCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};
  const cookieString = document.cookie;

  if (!cookieString) return cookies;

  cookieString.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.split('=');
    const trimmedName = name.trim();
    const value = rest.join('=').trim();
    cookies[decodeURIComponent(trimmedName)] = decodeURIComponent(value);
  });

  return cookies;
}