export interface Driver {
  id: string;
  name: string;
  status: "active" | "idle" | "offline";
  lat: number;
  lng: number;
  speed: number;
  zone: string;
  lastSeen: string;
  avatar: string;
}

export interface Incident {
  id: string;
  type: "collision" | "theft" | "suspicious" | "assault";
  description: string;
  location: string;
  timestamp: string;
  status: "open" | "investigating" | "resolved";
  driverId: string;
  facesDetected: number;
}

export interface Activity {
  id: string;
  driverId: string;
  driverName: string;
  action: string;
  timestamp: string;
  type: "info" | "warning" | "alert";
}

export const drivers: Driver[] = [
  { id: "D001", name: "Thabo Molefe", status: "active", lat: -26.107407, lng: 28.056229, speed: 32, zone: "Sandton CBD", lastSeen: "Just now", avatar: "/avatars/nikolas-gibbons.jpg" },
  { id: "D002", name: "Sipho Ndaba", status: "active", lat: -25.989460, lng: 28.125280, speed: 28, zone: "Midrand", lastSeen: "Just now", avatar: "/avatars/owen-harding.jpg" },
  { id: "D003", name: "Lebogang Khumalo", status: "idle", lat: -26.147886, lng: 28.042421, speed: 0, zone: "Rosebank", lastSeen: "8 min ago", avatar: "/avatars/zaynab-donnelly.jpg" },
  { id: "D004", name: "Mandla Zulu", status: "active", lat: -26.184167, lng: 28.011667, speed: 35, zone: "Melville", lastSeen: "Just now", avatar: "/avatars/rayhan-zua.jpg" },
  { id: "D005", name: "Tshepo Dlamini", status: "offline", lat: -26.094444, lng: 27.981389, speed: 0, zone: "Randburg", lastSeen: "1 hr ago", avatar: "/avatars/leyton-fields.jpg" },
  { id: "D006", name: "Bongani Sithole", status: "active", lat: -26.195246, lng: 28.034088, speed: 41, zone: "Braamfontein", lastSeen: "Just now", avatar: "/avatars/kari-rasmussen.jpg" },
  { id: "D007", name: "Kagiso Mahlangu", status: "active", lat: -26.133056, lng: 28.088333, speed: 38, zone: "Bedfordview", lastSeen: "Just now", avatar: "/avatars/franklin-mays.jpg" },
  { id: "D008", name: "Thulani Mthembu", status: "active", lat: -26.172222, lng: 28.078333, speed: 29, zone: "Cyrildene", lastSeen: "Just now", avatar: "/avatars/alec-whitten.jpg" },
  { id: "D009", name: "Mpho Dube", status: "active", lat: -26.121667, lng: 28.013889, speed: 33, zone: "Parktown", lastSeen: "Just now", avatar: "/avatars/adil-floyd.jpg" },
  { id: "D010", name: "Sizwe Nkosi", status: "idle", lat: -26.068889, lng: 28.026667, speed: 0, zone: "Hyde Park", lastSeen: "5 min ago", avatar: "/avatars/aston-hood.jpg" },
  { id: "D011", name: "Katlego Mokoena", status: "active", lat: -26.153333, lng: 28.120556, speed: 36, zone: "Germiston", lastSeen: "Just now", avatar: "/avatars/cohen-lozano.jpg" },
  { id: "D012", name: "Jabulani Cele", status: "active", lat: -26.087778, lng: 28.097222, speed: 31, zone: "Alexandra", lastSeen: "Just now", avatar: "/avatars/nikolas-gibbons.jpg" },
];

export const incidents: Incident[] = [
  { id: "INC001", type: "collision", description: "Minor collision at intersection with taxi", location: "Rivonia Rd & 5th Ave", timestamp: "2026-02-10T14:23:00", status: "investigating", driverId: "D001", facesDetected: 3 },
  { id: "INC002", type: "theft", description: "Attempted grab of delivery package", location: "Oxford Rd, Rosebank", timestamp: "2026-02-10T13:05:00", status: "open", driverId: "D003", facesDetected: 1 },
  { id: "INC003", type: "suspicious", description: "Unidentified individual following driver", location: "Jan Smuts Ave", timestamp: "2026-02-10T11:47:00", status: "resolved", driverId: "D004", facesDetected: 2 },
  { id: "INC004", type: "assault", description: "Driver threatened at delivery point", location: "Sandton Dr", timestamp: "2026-02-10T09:32:00", status: "investigating", driverId: "D006", facesDetected: 1 },
];

export const activities: Activity[] = [
  { id: "A001", driverId: "D001", driverName: "Thabo Molefe", action: "Entered Sandton CBD zone", timestamp: "14:30", type: "info" },
  { id: "A002", driverId: "D006", driverName: "Bongani Sithole", action: "Speed alert: 41 km/h in 30 zone", timestamp: "14:28", type: "warning" },
  { id: "A003", driverId: "D001", driverName: "Thabo Molefe", action: "Incident reported: Collision", timestamp: "14:23", type: "alert" },
  { id: "A004", driverId: "D002", driverName: "Sipho Ndaba", action: "Started shift", timestamp: "14:15", type: "info" },
  { id: "A005", driverId: "D003", driverName: "Lebogang Khumalo", action: "Incident reported: Theft attempt", timestamp: "13:05", type: "alert" },
  { id: "A006", driverId: "D004", driverName: "Mandla Zulu", action: "Completed delivery #247", timestamp: "12:50", type: "info" },
  { id: "A007", driverId: "D005", driverName: "Tshepo Dlamini", action: "Went offline", timestamp: "12:30", type: "warning" },
];

export const stats = {
  activeDrivers: 9,
  totalDrivers: 12,
  openIncidents: 2,
  resolvedToday: 5,
  avgSpeed: 33,
  totalDeliveries: 247,
};
