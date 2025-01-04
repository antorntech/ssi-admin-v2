function validUntil(createdAt) {
  if (!createdAt) return null;

  const createdDate = new Date(createdAt);
  if (isNaN(createdDate.getTime())) return null; // Ensure the date is valid

  const validDays = 30
  const validDate = validDays * 24 * 60 * 60 * 1000;

  const targetDate = new Date(createdDate.getTime() + validDate); // + 30 days

  const calculateTimeLeft = () => {
    const currentDate = new Date();
    const diff = targetDate - currentDate;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const timeLeft = calculateTimeLeft()
  return timeLeft
}

export default validUntil;