const express = require('express');
const cors = require('cors');
const { dbAsync, initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Initialize SQLite database on startup
initDatabase().catch(err => {
  console.error('❌ Failed to initialize SQLite database:', err);
});

// Helper functions to map SQL snake_case rows to JSON camelCase objects
function mapBusRow(row) {
  const bookedSeats = typeof row.booked_seats === 'string' ? JSON.parse(row.booked_seats || '[]') : (row.booked_seats || []);
  return {
    id: row.id,
    operator: row.operator,
    busType: row.bus_type,
    from: row.from_city,
    to: row.to_city,
    travelDate: row.travel_date,
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time,
    duration: row.duration,
    price: row.price,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    amenities: typeof row.amenities === 'string' ? JSON.parse(row.amenities || '[]') : (row.amenities || []),
    totalSeats: row.total_seats,
    bookedSeats: bookedSeats,
    boardingPoints: typeof row.boarding_points === 'string' ? JSON.parse(row.boarding_points || '[]') : (row.boarding_points || []),
    droppingPoints: typeof row.dropping_points === 'string' ? JSON.parse(row.dropping_points || '[]') : (row.dropping_points || []),
    availableSeats: row.total_seats - bookedSeats.length
  };
}

function mapBookingRow(row) {
  return {
    id: row.id,
    pnr: row.pnr,
    userId: row.user_id,
    busId: row.bus_id,
    operator: row.operator,
    busType: row.bus_type,
    from: row.from_city,
    to: row.to_city,
    travelDate: row.travel_date,
    departureTime: row.departure_time,
    arrivalTime: row.arrival_time,
    duration: row.duration,
    boardingPoint: row.boarding_point,
    droppingPoint: row.dropping_point,
    seats: typeof row.seats === 'string' ? JSON.parse(row.seats || '[]') : (row.seats || []),
    passengers: typeof row.passengers === 'string' ? JSON.parse(row.passengers || '[]') : (row.passengers || []),
    totalFare: row.total_fare,
    status: row.status,
    bookedAt: row.booked_at
  };
}

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  try {
    const userCount = await dbAsync.get('SELECT COUNT(*) as count FROM users');
    const busCount = await dbAsync.get('SELECT COUNT(*) as count FROM buses');
    const bookingCount = await dbAsync.get('SELECT COUNT(*) as count FROM bookings');

    res.json({
      status: 'ok',
      database: 'SQLite (wanderbus.sqlite)',
      counts: {
        users: userCount.count,
        buses: busCount.count,
        bookings: bookingCount.count
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Authentication: Login (SQL Query)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email and password are required.'
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await dbAsync.get('SELECT * FROM users WHERE LOWER(email) = ?', [normalizedEmail]);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email address.'
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please verify your credentials and try again.'
      });
    }

    const token = `fake-jwt-token-${user.id}-${Date.now()}`;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Database query error during login.' });
  }
});

// Authentication: Register (SQL Insert)
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required.'
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await dbAsync.get('SELECT id FROM users WHERE LOWER(email) = ?', [normalizedEmail]);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const avatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80";
    const role = "Explorer Passenger";

    const result = await dbAsync.run(
      'INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), normalizedEmail, password, role, avatar]
    );

    return res.status(201).json({
      success: true,
      message: 'Account created successfully in SQL database! You can now log in.',
      user: {
        id: result.lastID,
        name: name.trim(),
        email: normalizedEmail,
        role: role,
        avatar: avatar
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Database error creating account.' });
  }
});

// Get Cities (SQL Query)
app.get('/api/cities', async (req, res) => {
  try {
    const rows = await dbAsync.all('SELECT name FROM cities ORDER BY name ASC');
    res.json({ success: true, cities: rows.map(r => r.name) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Search Buses (SQL Query)
app.get('/api/buses', async (req, res) => {
  const { from, to, date, busType } = req.query;

  try {
    let sql = 'SELECT * FROM buses WHERE 1=1';
    const params = [];

    if (from) {
      sql += ' AND (LOWER(from_city) LIKE ? OR ? LIKE "%" || LOWER(from_city) || "%")';
      params.push(`%${from.trim().toLowerCase()}%`, from.trim().toLowerCase());
    }

    if (to) {
      sql += ' AND (LOWER(to_city) LIKE ? OR ? LIKE "%" || LOWER(to_city) || "%")';
      params.push(`%${to.trim().toLowerCase()}%`, to.trim().toLowerCase());
    }

    if (busType && busType !== 'all') {
      sql += ' AND LOWER(bus_type) LIKE ?';
      params.push(`%${busType.trim().toLowerCase()}%`);
    }

    sql += ' ORDER BY price ASC';

    let rows = await dbAsync.all(sql, params);

    // If no direct matches and both from & to are provided, generate dynamic buses
    if (rows.length === 0 && from && to) {
      const f = from.trim();
      const t = to.trim();
      const dynamicBuses = [
        {
          id: `bus-dyn-1-${f.toLowerCase()}-${t.toLowerCase()}`,
          operator: "Grand Intercity Express",
          bus_type: "Multi-Axle AC Sleeper (2+1)",
          from_city: f,
          to_city: t,
          travel_date: date || '2026-11-12',
          departure_time: "10:00 PM",
          arrival_time: "05:30 AM",
          duration: "7h 30m",
          price: 34,
          rating: 4.8,
          reviews_count: 194,
          amenities: JSON.stringify(["WiFi", "Charging Port", "Blanket", "Water Bottle", "GPS Tracking"]),
          total_seats: 30,
          booked_seats: JSON.stringify(["L1", "L4", "U2"]),
          boarding_points: JSON.stringify([
            { name: `${f} Central Terminal`, time: "10:00 PM" }
          ]),
          dropping_points: JSON.stringify([
            { name: `${t} Downtown Station`, time: "05:30 AM" }
          ])
        },
        {
          id: `bus-dyn-2-${f.toLowerCase()}-${t.toLowerCase()}`,
          operator: "Wanderer Superfast Coach",
          bus_type: "Executive AC Seater (2+2)",
          from_city: f,
          to_city: t,
          travel_date: date || '2026-11-12',
          departure_time: "10:15 PM",
          arrival_time: "05:45 AM",
          duration: "7h 30m",
          price: 26,
          rating: 4.6,
          reviews_count: 142,
          amenities: JSON.stringify(["WiFi", "Charging Port", "TV Entertainment"]),
          total_seats: 36,
          booked_seats: JSON.stringify(["1A", "2B", "4C"]),
          boarding_points: JSON.stringify([
            { name: `${f} Highway Junction`, time: "10:15 PM" }
          ]),
          dropping_points: JSON.stringify([
            { name: `${t} City Bypass`, time: "05:45 AM" }
          ])
        }
      ];

      // Save dynamically generated buses to database for persistence!
      for (const dbus of dynamicBuses) {
        await dbAsync.run(`
          INSERT OR IGNORE INTO buses (
            id, operator, bus_type, from_city, to_city, travel_date,
            departure_time, arrival_time, duration, price, rating,
            reviews_count, amenities, total_seats, booked_seats,
            boarding_points, dropping_points
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          dbus.id, dbus.operator, dbus.bus_type, dbus.from_city, dbus.to_city, dbus.travel_date,
          dbus.departure_time, dbus.arrival_time, dbus.duration, dbus.price, dbus.rating,
          dbus.reviews_count, dbus.amenities, dbus.total_seats, dbus.booked_seats,
          dbus.boarding_points, dbus.dropping_points
        ]);
      }

      rows = await dbAsync.all(sql, params);
    }

    const buses = rows.map(mapBusRow).map(b => ({
      ...b,
      travelDate: date || b.travelDate || '2026-11-12'
    }));

    res.json({
      success: true,
      count: buses.length,
      buses: buses
    });
  } catch (err) {
    console.error('Bus search error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Single Bus by ID (SQL Query)
app.get('/api/buses/:id', async (req, res) => {
  try {
    const row = await dbAsync.get('SELECT * FROM buses WHERE id = ?', [req.params.id]);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Bus not found' });
    }

    res.json({
      success: true,
      bus: mapBusRow(row)
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create a New Bus Booking (SQL Insert & Bus Seat Update)
app.post('/api/bookings', async (req, res) => {
  const { 
    userId, 
    busId, 
    operator,
    busType,
    from, 
    to, 
    travelDate, 
    departureTime,
    arrivalTime,
    duration,
    boardingPoint, 
    droppingPoint, 
    seats, 
    passengers, 
    totalFare 
  } = req.body;

  if (!seats || !seats.length || !passengers || !passengers.length) {
    return res.status(400).json({
      success: false,
      message: 'Please select seats and provide passenger information.'
    });
  }

  try {
    // 1. Fetch current bus to verify and reserve seats
    const busRow = await dbAsync.get('SELECT * FROM buses WHERE id = ?', [busId]);
    if (busRow) {
      const currentBooked = JSON.parse(busRow.booked_seats || '[]');
      const conflict = seats.some(seat => currentBooked.includes(seat));
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'One or more selected seats were just taken. Please choose different seats.'
        });
      }

      // Update bus booked_seats in SQL
      const updatedBooked = [...currentBooked, ...seats];
      await dbAsync.run('UPDATE buses SET booked_seats = ? WHERE id = ?', [
        JSON.stringify(updatedBooked),
        busId
      ]);
    }

    // 2. Generate unique PNR
    const pnr = `WND-${Math.floor(10000 + Math.random() * 90000)}`;

    // 3. Insert Booking into SQL
    const insertSql = `
      INSERT INTO bookings (
        pnr, user_id, bus_id, operator, bus_type, from_city, to_city,
        travel_date, departure_time, arrival_time, duration,
        boarding_point, dropping_point, seats, passengers, total_fare, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await dbAsync.run(insertSql, [
      pnr,
      userId ? Number(userId) : 1,
      busId,
      operator || (busRow ? busRow.operator : 'WanderBus Express'),
      busType || (busRow ? busRow.bus_type : 'AC Sleeper'),
      from || (busRow ? busRow.from_city : 'Chennai'),
      to || (busRow ? busRow.to_city : 'Madurai'),
      travelDate || '2026-11-12',
      departureTime || (busRow ? busRow.departure_time : '10:00 PM'),
      arrivalTime || (busRow ? busRow.arrival_time : '05:30 AM'),
      duration || (busRow ? busRow.duration : '7h 30m'),
      boardingPoint || 'Main Central Terminal',
      droppingPoint || 'City Center Drop Point',
      JSON.stringify(seats),
      JSON.stringify(passengers),
      Number(totalFare) || 50,
      'CONFIRMED'
    ]);

    const createdBookingRow = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      success: true,
      message: 'Bus ticket booked successfully and stored in SQL database!',
      booking: mapBookingRow(createdBookingRow)
    });
  } catch (err) {
    console.error('Booking insertion error:', err);
    return res.status(500).json({ success: false, message: 'Database error saving reservation.' });
  }
});

// Get User Bookings (SQL Query)
app.get('/api/bookings', async (req, res) => {
  const { userId } = req.query;

  try {
    let rows;
    if (userId) {
      rows = await dbAsync.all('SELECT * FROM bookings WHERE user_id = ? ORDER BY id DESC', [Number(userId)]);
    } else {
      rows = await dbAsync.all('SELECT * FROM bookings ORDER BY id DESC');
    }

    res.json({
      success: true,
      bookings: rows.map(mapBookingRow)
    });
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Cancel a Booking (SQL Update)
app.post('/api/bookings/:pnr/cancel', async (req, res) => {
  const { pnr } = req.params;

  try {
    const booking = await dbAsync.get('SELECT * FROM bookings WHERE UPPER(pnr) = ?', [pnr.toUpperCase()]);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking with this PNR not found in SQL database.'
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.'
      });
    }

    // Mark as cancelled in SQL
    await dbAsync.run('UPDATE bookings SET status = "CANCELLED" WHERE id = ?', [booking.id]);

    // Free up seats in bus if present
    const bus = await dbAsync.get('SELECT * FROM buses WHERE id = ?', [booking.bus_id]);
    if (bus) {
      const currentBooked = JSON.parse(bus.booked_seats || '[]');
      const bookingSeats = JSON.parse(booking.seats || '[]');
      const updatedBooked = currentBooked.filter(s => !bookingSeats.includes(s));
      await dbAsync.run('UPDATE buses SET booked_seats = ? WHERE id = ?', [
        JSON.stringify(updatedBooked),
        bus.id
      ]);
    }

    const updatedBooking = await dbAsync.get('SELECT * FROM bookings WHERE id = ?', [booking.id]);

    return res.json({
      success: true,
      message: `Ticket ${pnr} has been cancelled in SQL database. Refund initiated.`,
      booking: mapBookingRow(updatedBooking)
    });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚌 WanderBus SQL Backend Server listening on http://localhost:${PORT}`);
});
