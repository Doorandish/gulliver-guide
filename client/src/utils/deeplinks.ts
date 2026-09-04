export function generateBahnLink(from: string, to: string, date: string, time: string): string {
  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  // date should be in YYYY-MM-DD format, we need to convert to bahn.de format or pass directly to travel search
  return `https://www.bahn.de/buchung/fahrplan/suche#sts=true&so=${encodedFrom}&zo=${encodedTo}&kl=2&r=13:16:5.5,5.5&hd=${date}T${time}:00`;
}

export function generateOmioLink(from: string, to: string, date: string): string {
  const encodedFrom = encodeURIComponent(from);
  const encodedTo = encodeURIComponent(to);
  return `https://www.omio.de/search-frontend/results/${encodedFrom}/${encodedTo}/${date}`;
}

export function getNextWeekendDates(): { saturday: string; sunday: string } {
  const today = new Date();
  
  // Find next Saturday
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + (6 - today.getDay() + 7) % 7);
  if (today.getDay() === 6) saturday.setDate(today.getDate() + 7);

  // Find next Sunday
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);

  return {
    saturday: saturday.toISOString().split('T')[0],
    sunday: sunday.toISOString().split('T')[0]
  };
}
