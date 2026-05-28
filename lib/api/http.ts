import { NextResponse } from "next/server";

export type ApiErrorBody = {
  error: string;
  details?: Record<string, string[]>;
};

export function jsonSuccess<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}

export function jsonError(
  status: number,
  message: string,
  details?: Record<string, string[]>,
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export function jsonValidationError(
  message: string,
  details: Record<string, string[]>,
): NextResponse<ApiErrorBody> {
  return jsonError(400, message, details);
}
