export const calculateAge = (dob) => {
  if (!dob) return "N/A";

  const birth = new Date(`${dob.split("T")[0]}T00:00:00`);
  const today = new Date();

  if (isNaN(birth.getTime()) || birth > today) return "N/A";

  let age = today.getFullYear() - birth.getFullYear();

  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate())
  ) age--;

  return `${age} years`;
};