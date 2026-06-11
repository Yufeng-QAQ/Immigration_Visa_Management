import { notify } from "../components/Common/Notification/eventBus";
export const calculateDaysLeft = (expireDate: string | Date | null): number => {
  if (!expireDate) return 9999;

  const exp = typeof expireDate === "string" ? new Date(expireDate) : expireDate;
  if (isNaN(exp.getTime())) return 9999;

  const today = new Date();

  const diffTime = exp.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return daysLeft;
};

export const checkPassword = (newPassword: string, confirmPassword: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  let result = true;
  if (newPassword !== confirmPassword) {
    notify.error("The passwords doesn't match.");
    result = false;
  } else if (!passwordRegex.test(newPassword)) {
    notify.error("Invalid password, please refer to the requirement.");
    result = false;
  };

  return result;
}
