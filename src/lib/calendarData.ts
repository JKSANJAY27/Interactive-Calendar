// Indian public holidays + major international ones
// Format: "MM-DD" → label

export const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "01-14": "Makar Sankranti",
  "01-26": "Republic Day",
  "03-25": "Holi",
  "04-14": "Dr. Ambedkar Jayanti",
  "04-18": "Good Friday",
  "05-01": "Labour Day",
  "06-21": "World Music Day",
  "08-15": "Independence Day",
  "08-27": "Janmashtami",
  "10-02": "Gandhi Jayanti",
  "10-24": "Dussehra",
  "11-01": "Diwali",
  "11-15": "Guru Nanak Jayanti",
  "12-25": "Christmas Day",
  "12-31": "New Year's Eve",
};

export function getHoliday(date: Date): string | null {
  const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
  return HOLIDAYS[key] ?? null;
}

// Month hero images — Unsplash curated collection
export const MONTH_IMAGES: Record<number, { url: string; credit: string }> = {
  0:  { url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80", credit: "Snow mountains" },
  1:  { url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80", credit: "Cherry blossoms" },
  2:  { url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80", credit: "Spring valley" },
  3:  { url: "https://images.unsplash.com/photo-1455218873509-8097305ee378?w=800&q=80", credit: "Spring flowers" },
  4:  { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", credit: "Summer pool" },
  5:  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", credit: "Beach sunset" },
  6:  { url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80", credit: "Mountain hike" },
  7:  { url: "https://images.unsplash.com/photo-1439853949212-36589f9f9e7e?w=800&q=80", credit: "Golden hour" },
  8:  { url: "https://images.unsplash.com/photo-1444927714506-8492d94b4e3d?w=800&q=80", credit: "Autumn leaves" },
  9:  { url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80", credit: "Halloween pumpkins" },
  10: { url: "https://images.unsplash.com/photo-1477601263568-180e2c6d046e?w=800&q=80", credit: "Foggy forest" },
  11: { url: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800&q=80", credit: "Winter snow" },
};

export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
