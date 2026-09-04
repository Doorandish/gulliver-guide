export const getNextWeekendDates = () => {
  const today = new Date();
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
  if (today.getDay() === 6) {
      nextSaturday.setDate(today.getDate() + 7);
  }
  
  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);
  
  return { nextSaturday, nextSunday };
};

export const generateBahnLink = (from: string, to: string, dateStr: string, timeStr: string) => {
  return `https://reiseauskunft.bahn.de/bin/query.exe/dn?S=${encodeURIComponent(from)}&Z=${encodeURIComponent(to)}&date=${dateStr}&time=${timeStr}`;
};

export const generateOmioLink = (from: string, to: string, dateStr: string) => {
  return `https://www.omio.de/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&departure_date=${dateStr}`;
};
