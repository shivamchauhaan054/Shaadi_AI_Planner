export class IntakeNotFoundError extends Error {
  constructor(id: string) {
    super(`Wedding intake not found: ${id}`);
    this.name = "IntakeNotFoundError";
  }
}
