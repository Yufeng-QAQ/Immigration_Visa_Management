export const calculateDaysLeft = (expireDate: string | Date | null): string | number => {
  if (!expireDate) return "-";

  const exp = typeof expireDate === "string" ? new Date(expireDate) : expireDate;
  if (isNaN(exp.getTime())) return "-";

  const today = new Date();
  
  const diffTime = exp.setHours(0,0,0,0) - today.setHours(0,0,0,0);
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  
  if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} days ago`;
  if (daysLeft === 0) return "Expires today";
  return `${daysLeft} days left`;
};
