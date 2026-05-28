/**
 * Runs once when the Next.js server starts (Node.js runtime).
 * Validates production environment without failing the build on optional services.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { assertProductionEnvironment } = await import(
    "@/lib/env/validation"
  );
  assertProductionEnvironment();
}
