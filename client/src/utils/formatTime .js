export const formatTime = (isoDate) => {
  const dateObj = new Date(isoDate);

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};
