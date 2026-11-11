const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'wanderbus.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Could not connect to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at:', DB_PATH);
  }
});

// Helper wrappers for clean Promise / async/await usage
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize Schema and Seed Data
async function initDatabase() {
  // 1. Users Table
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Explorer Passenger',
      avatar TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Cities Table
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // 3. Buses Table
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS buses (
      id TEXT PRIMARY KEY,
      operator TEXT NOT NULL,
      bus_type TEXT NOT NULL,
      from_city TEXT NOT NULL,
      to_city TEXT NOT NULL,
      travel_date TEXT,
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      duration TEXT NOT NULL,
      price REAL NOT NULL,
      rating REAL DEFAULT 4.5,
      reviews_count INTEGER DEFAULT 100,
      amenities TEXT,
      total_seats INTEGER DEFAULT 30,
      booked_seats TEXT DEFAULT '[]',
      boarding_points TEXT,
      dropping_points TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Bookings Table
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pnr TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      bus_id TEXT,
      operator TEXT NOT NULL,
      bus_type TEXT NOT NULL,
      from_city TEXT NOT NULL,
      to_city TEXT NOT NULL,
      travel_date TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      arrival_time TEXT NOT NULL,
      duration TEXT NOT NULL,
      boarding_point TEXT NOT NULL,
      dropping_point TEXT NOT NULL,
      seats TEXT NOT NULL,
      passengers TEXT NOT NULL,
      total_fare REAL NOT NULL,
      status TEXT DEFAULT 'CONFIRMED',
      booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Seed Users if empty
  const userCount = await dbAsync.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('🌱 Seeding initial users into SQL database...');
    await dbAsync.run(`
      INSERT INTO users (name, email, password, role, avatar) VALUES 
      ('Alex Rivera', 'traveler@example.com', 'password123', 'World Explorer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'),
      ('Sophia Martinez', 'sophia@wanderlust.com', 'adventure2026', 'Travel Blogger', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')
    `);
  }

  // Seed Cities if empty
  const cityCount = await dbAsync.get('SELECT COUNT(*) as count FROM cities');
  if (cityCount.count === 0) {
    console.log('🌱 Seeding cities into SQL database...');
    const citiesList = [
      "Chennai", "Madurai", "Bangalore", "Goa", "Mumbai", "Hyderabad",
      "Pune", "Delhi", "Jaipur", "New York", "Boston", "Washington DC",
      "Philadelphia", "Chicago", "Atlantic City"
    ];
    for (const city of citiesList) {
      await dbAsync.run('INSERT OR IGNORE INTO cities (name) VALUES (?)', [city]);
    }
  }

  // Seed Buses if empty
  const busCount = await dbAsync.get('SELECT COUNT(*) as count FROM buses');
  if (busCount.count === 0) {
    console.log('🌱 Seeding buses into SQL database...');
    const seedBuses = [
      // Chennai to Madurai (10:00 PM, 12 November)
      {
        id: "bus-601",
        operator: "KPN Travels Multi-Axle",
        bus_type: "Multi-Axle Volvo AC Sleeper (2+1)",
        from_city: "Chennai",
        to_city: "Madurai",
        travel_date: "2026-11-12",
        departure_time: "10:00 PM",
        arrival_time: "05:30 AM",
        duration: "7h 30m",
        price: 32,
        rating: 4.9,
        reviews_count: 1450,
        amenities: JSON.stringify(["WiFi", "Water Bottle", "Blanket", "Charging Port", "Pillow", "Reading Light", "Live GPS Tracking"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L1", "L2", "U4", "U7"]),
        boarding_points: JSON.stringify([
          { name: "Koyambedu Omni Bus Stand", time: "10:00 PM" },
          { name: "Ashok Pillar", time: "10:20 PM" },
          { name: "Guindy Kathipara Junction", time: "10:35 PM" },
          { name: "Tambaram MEPZ", time: "11:15 PM" },
          { name: "Perungalathur", time: "11:35 PM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Mattuthavani Integrated Bus Terminal", time: "05:15 AM" },
          { name: "Periyar Bus Stand", time: "05:30 AM" },
          { name: "Arapalayam Bus Stand", time: "05:45 AM" }
        ])
      },
      {
        id: "bus-602",
        operator: "Parveen Travels Multi-Axle",
        bus_type: "Mercedes-Benz Luxury AC Sleeper (2+1)",
        from_city: "Chennai",
        to_city: "Madurai",
        travel_date: "2026-11-12",
        departure_time: "10:00 PM",
        arrival_time: "05:15 AM",
        duration: "7h 15m",
        price: 35,
        rating: 4.8,
        reviews_count: 920,
        amenities: JSON.stringify(["High-Speed WiFi", "Snack Pack", "Blanket & Pillow", "Charging Port", "Emergency Exit"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L3", "U1", "U8"]),
        boarding_points: JSON.stringify([
          { name: "Koyambedu Omni Bus Stand", time: "10:00 PM" },
          { name: "Tambaram Junction", time: "11:15 PM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Mattuthavani Integrated Bus Terminal", time: "05:15 AM" },
          { name: "Fathima College", time: "05:35 AM" }
        ])
      },
      {
        id: "bus-603",
        operator: "IntrCity SmartBus",
        bus_type: "Luxury AC Sleeper (2+1) with Washroom",
        from_city: "Chennai",
        to_city: "Madurai",
        travel_date: "2026-11-12",
        departure_time: "10:00 PM",
        arrival_time: "05:30 AM",
        duration: "7h 30m",
        price: 36,
        rating: 4.9,
        reviews_count: 1680,
        amenities: JSON.stringify(["In-Bus Washroom", "High-Speed WiFi", "Snack Box", "Blanket & Pillow", "Mineral Water", "CCTV Security"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L4", "L5", "U2", "U3"]),
        boarding_points: JSON.stringify([
          { name: "Koyambedu SmartBus Lounge", time: "10:00 PM" },
          { name: "Guindy Metro", time: "10:30 PM" },
          { name: "Tambaram Toll", time: "11:15 PM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Mattuthavani SmartBus Lounge", time: "05:30 AM" }
        ])
      },
      {
        id: "bus-604",
        operator: "YBM Travels Scania",
        bus_type: "Scania Metrolink AC Sleeper (2+1)",
        from_city: "Chennai",
        to_city: "Madurai",
        travel_date: "2026-11-12",
        departure_time: "09:45 PM",
        arrival_time: "05:15 AM",
        duration: "7h 30m",
        price: 33,
        rating: 4.8,
        reviews_count: 840,
        amenities: JSON.stringify(["WiFi", "Water Bottle", "Blanket", "Charging Port", "Movie Screen"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L2", "U5"]),
        boarding_points: JSON.stringify([
          { name: "Egmore Station", time: "09:45 PM" },
          { name: "Koyambedu Omni Stand", time: "10:15 PM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Mattuthavani Bus Stand", time: "05:15 AM" }
        ])
      },
      {
        id: "bus-605",
        operator: "SRM Transports BharatBenz",
        bus_type: "BharatBenz AC Sleeper (2+1)",
        from_city: "Chennai",
        to_city: "Madurai",
        travel_date: "2026-11-12",
        departure_time: "10:15 PM",
        arrival_time: "05:45 AM",
        duration: "7h 30m",
        price: 31,
        rating: 4.7,
        reviews_count: 730,
        amenities: JSON.stringify(["WiFi", "Charging Port", "Water Bottle", "Blanket"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L6", "U6"]),
        boarding_points: JSON.stringify([
          { name: "Koyambedu Omni Stand", time: "10:15 PM" },
          { name: "Tambaram MEPZ", time: "11:30 PM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Mattuthavani Bus Stand", time: "05:45 AM" }
        ])
      },
      // New York to Boston
      {
        id: "bus-101",
        operator: "Royal Volvo Multi-Axle",
        bus_type: "Multi-Axle Volvo AC Sleeper (2+1)",
        from_city: "New York",
        to_city: "Boston",
        travel_date: null,
        departure_time: "07:30 AM",
        arrival_time: "11:45 AM",
        duration: "4h 15m",
        price: 38,
        rating: 4.8,
        reviews_count: 342,
        amenities: JSON.stringify(["WiFi", "Charging Port", "Water Bottle", "Blanket", "GPS Tracking"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L1", "L4", "L9", "U3", "U7"]),
        boarding_points: JSON.stringify([
          { name: "Port Authority Bus Terminal (Gate 24)", time: "07:30 AM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "South Station, Boston", time: "11:30 AM" }
        ])
      },
      {
        id: "bus-102",
        operator: "Greenline Express Coach",
        bus_type: "Executive AC Seater (2+2)",
        from_city: "New York",
        to_city: "Boston",
        travel_date: null,
        departure_time: "10:15 AM",
        arrival_time: "02:30 PM",
        duration: "4h 15m",
        price: 28,
        rating: 4.6,
        reviews_count: 218,
        amenities: JSON.stringify(["WiFi", "Charging Port", "Movie Screen"]),
        total_seats: 36,
        booked_seats: JSON.stringify(["1A", "1B", "3C", "4D"]),
        boarding_points: JSON.stringify([
          { name: "Port Authority NYC", time: "10:15 AM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "South Station, Boston", time: "02:30 PM" }
        ])
      },
      // Bangalore to Goa
      {
        id: "bus-301",
        operator: "Goa Coastal Cruiser",
        bus_type: "Multi-Axle Volvo AC Sleeper (2+1)",
        from_city: "Bangalore",
        to_city: "Goa",
        travel_date: null,
        departure_time: "08:30 PM",
        arrival_time: "07:30 AM",
        duration: "11h 00m",
        price: 42,
        rating: 4.8,
        reviews_count: 890,
        amenities: JSON.stringify(["WiFi", "Blanket", "Water Bottle", "Charging Port"]),
        total_seats: 30,
        booked_seats: JSON.stringify(["L1", "L2", "U5", "U6"]),
        boarding_points: JSON.stringify([
          { name: "Majestic Bus Stand", time: "08:30 PM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Panjim Kadamba Bus Terminal", time: "07:00 AM" }
        ])
      },
      // Bangalore to Chennai
      {
        id: "bus-305",
        operator: "Southern Cross Travels",
        bus_type: "Scania High-Deck Seater",
        from_city: "Bangalore",
        to_city: "Chennai",
        travel_date: null,
        departure_time: "06:00 AM",
        arrival_time: "12:00 PM",
        duration: "6h 00m",
        price: 22,
        rating: 4.5,
        reviews_count: 610,
        amenities: JSON.stringify(["WiFi", "Water Bottle", "Charging Port"]),
        total_seats: 36,
        booked_seats: JSON.stringify(["1A", "4B", "5A"]),
        boarding_points: JSON.stringify([
          { name: "Shanthinagar Bus Station", time: "06:00 AM" }
        ]),
        dropping_points: JSON.stringify([
          { name: "Koyambedu CMBT", time: "12:00 PM" }
        ])
      }
    ];

    const insertBusStmt = `
      INSERT INTO buses (
        id, operator, bus_type, from_city, to_city, travel_date,
        departure_time, arrival_time, duration, price, rating,
        reviews_count, amenities, total_seats, booked_seats,
        boarding_points, dropping_points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const b of seedBuses) {
      await dbAsync.run(insertBusStmt, [
        b.id, b.operator, b.bus_type, b.from_city, b.to_city, b.travel_date,
        b.departure_time, b.arrival_time, b.duration, b.price, b.rating,
        b.reviews_count, b.amenities, b.total_seats, b.booked_seats,
        b.boarding_points, b.dropping_points
      ]);
    }
  }

  // Seed initial booking if empty
  const bookingCount = await dbAsync.get('SELECT COUNT(*) as count FROM bookings');
  if (bookingCount.count === 0) {
    console.log('🌱 Seeding initial booking into SQL database...');
    await dbAsync.run(`
      INSERT INTO bookings (
        pnr, user_id, bus_id, operator, bus_type, from_city, to_city,
        travel_date, departure_time, arrival_time, duration,
        boarding_point, dropping_point, seats, passengers, total_fare, status
      ) VALUES (
        'WND-84920', 1, 'bus-601', 'KPN Travels Multi-Axle', 'Multi-Axle Volvo AC Sleeper (2+1)',
        'Chennai', 'Madurai', '2026-11-12', '10:00 PM', '05:30 AM', '7h 30m',
        'Koyambedu Omni Bus Stand', 'Mattuthavani Integrated Bus Terminal',
        '["L1"]', '[{"name":"Alex Rivera","age":28,"gender":"Male","seatNo":"L1"}]', 34, 'CONFIRMED'
      )
    `);
  }

  console.log('🎉 SQLite Database initialized successfully!');
}

module.exports = {
  db,
  dbAsync,
  initDatabase
};
