export const calculateDaysLeft = (expireDate: string | Date | null) => {
  if (!expireDate) return "-";
  const exp = typeof expireDate === "string" ? new Date(expireDate) : expireDate;
  if (isNaN(exp.getTime())) return "-";
  
  const diffTime = exp.getTime() - new Date().getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};