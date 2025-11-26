export function generatePin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function usernameToEmail(name: string) {
  return `${name.toLowerCase().replace(/\s+/g, "_")}@pmb.app`;
}
