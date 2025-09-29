export const calculateDaysLeft = (expireDate?: string) => {
  if (!expireDate) return "-";
  const diff = new Date(expireDate).getTime() - new Date().getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};