export function getRequestBaseUrl(request?: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || process.env.NEXTAUTH_URL;
  if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1")) {
    return configured.replace(/\/$/, "");
  }

  if (request) {
    const headers = request.headers;
    const forwardedHost = headers.get("x-forwarded-host");
    const forwardedProto = headers.get("x-forwarded-proto");
    const host = forwardedHost || headers.get("host");
    if (host) {
      return `${forwardedProto || "http"}://${host}`;
    }
  }

  return "http://165.227.130.135";
}
