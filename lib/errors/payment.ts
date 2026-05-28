export class InvalidVendorCategoryError extends Error {
  constructor(category: string, allowed: string[]) {
    super(
      `Invalid vendor category "${category}". Allowed: ${allowed.join(", ")}`,
    );
    this.name = "InvalidVendorCategoryError";
  }
}
