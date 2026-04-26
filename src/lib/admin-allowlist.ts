export const ADMIN_EMAILS = new Set<string>([
  "davidmccrindle@gmail.com",
]);

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}
