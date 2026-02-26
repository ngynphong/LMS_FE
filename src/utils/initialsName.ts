export const getInitials = (name: string) => {
  if (!name) return "HV";
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(-2)
    .join("")
    .toUpperCase();
};