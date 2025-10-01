export const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.split(" ");
  return parts.length > 1
    ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    : name[0].toUpperCase();
};
