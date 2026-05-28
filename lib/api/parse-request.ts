import { MAX_JSON_BODY_BYTES } from "@/lib/security/constants";

export type ParseJsonBodyError =
  | "invalid_content_type"
  | "payload_too_large"
  | "invalid_json"
  | "invalid_payload_shape";

export type ParsedJsonBody =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: ParseJsonBodyError };

function isJsonContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const normalized = contentType.toLowerCase().split(";")[0]?.trim();
  return normalized === "application/json";
}

function parseContentLength(header: string | null): number | null {
  if (!header) return null;
  const value = Number.parseInt(header, 10);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/**
 * Strict JSON POST parser for public API routes.
 * - Requires `Content-Type: application/json`
 * - Enforces max body size
 * - Rejects non-object roots (arrays, primitives)
 */
export async function parseJsonPostRequest(
  request: Request,
): Promise<ParsedJsonBody> {
  if (!isJsonContentType(request.headers.get("content-type"))) {
    return { ok: false, error: "invalid_content_type" };
  }

  const contentLength = parseContentLength(request.headers.get("content-length"));
  if (contentLength !== null && contentLength > MAX_JSON_BODY_BYTES) {
    return { ok: false, error: "payload_too_large" };
  }

  const text = await request.text();

  if (text.length > MAX_JSON_BODY_BYTES) {
    return { ok: false, error: "payload_too_large" };
  }

  if (!text.trim()) {
    return { ok: false, error: "invalid_json" };
  }

  try {
    const data: unknown = JSON.parse(text);

    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      return { ok: false, error: "invalid_payload_shape" };
    }

    return { ok: true, data: data as Record<string, unknown> };
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}

export function jsonBodyErrorToMessage(error: ParseJsonBodyError): string {
  switch (error) {
    case "invalid_content_type":
      return "Content-Type must be application/json";
    case "payload_too_large":
      return "Request body is too large";
    case "invalid_payload_shape":
      return "Request body must be a JSON object";
    case "invalid_json":
    default:
      return "Request body must be valid JSON";
  }
}
