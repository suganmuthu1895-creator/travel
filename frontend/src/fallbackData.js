// Fallback bus dataset ensures the UI NEVER shows "No data" even if the backend is not yet started.
export const FALLBACK_BUSES = [
  // --- Chennai to Madurai (10:00 PM, 12 November) ---
  {
    id: "bus-601",
    operator: "KPN Travels Multi-Axle",
    busType: "Multi-Axle Volvo AC Sleeper (2+1)",
    from: "Chennai",
    to: "Madurai",
    date: "2026-11-12",
    departureTime: "10:00 PM",
    arrivalTime: "05:30 AM",
    duration: "7h 30m",
    price: 32,
    rating: 4.9,
    reviewsCount: 1450,
    amenities: ["WiFi", "Water Bottle", "Blanket", "Charging Port", "Pillow", "Reading Light", "Live GPS Tracking"],
    totalSeats: 30,
    bookedSeats: ["L1", "L2", "U4", "U7"],
    boardingPoints: [
      { name: "Koyambedu Omni Bus Stand", time: "10:00 PM" },
      { name: "Ashok Pillar", time: "10:20 PM" },
      { name: "Guindy Kathipara Junction", time: "10:35 PM" },
      { name: "Tambaram MEPZ", time: "11:15 PM" },
      { name: "Perungalathur", time: "11:35 PM" }
    ],
    droppingPoints: [
      { name: "Mattuthavani Integrated Bus Terminal", time: "05:15 AM" },
      { name: "Periyar Bus Stand", time: "05:30 AM" },
      { name: "Arapalayam Bus Stand", time: "05:45 AM" }
    ]
  },
  {
    id: "bus-602",
    operator: "Parveen Travels Multi-Axle",
    busType: "Mercedes-Benz Luxury AC Sleeper (2+1)",
    from: "Chennai",
    to: "Madurai",
    date: "2026-11-12",
    departureTime: "10:00 PM",
    arrivalTime: "05:15 AM",
    duration: "7h 15m",
    price: 35,
    rating: 4.8,
    reviewsCount: 920,
    amenities: ["High-Speed WiFi", "Snack Pack", "Blanket & Pillow", "Charging Port", "Emergency Exit"],
    totalSeats: 30,
    bookedSeats: ["L3", "U1", "U8"],
    boardingPoints: [
      { name: "Koyambedu Omni Bus Stand", time: "10:00 PM" },
      { name: "Tambaram Junction", time: "11:15 PM" }
    ],
    droppingPoints: [
      { name: "Mattuthavani Integrated Bus Terminal", time: "05:15 AM" },
      { name: "Fathima College", time: "05:35 AM" }
    ]
  },
  {
    id: "bus-603",
    operator: "IntrCity SmartBus",
    busType: "Luxury AC Sleeper (2+1) with Washroom",
    from: "Chennai",
    to: "Madurai",
    date: "2026-11-12",
    departureTime: "10:00 PM",
    arrivalTime: "05:30 AM",
    duration: "7h 30m",
    price: 36,
    rating: 4.9,
    reviewsCount: 1680,
    amenities: ["In-Bus Washroom", "High-Speed WiFi", "Snack Box", "Blanket & Pillow", "Mineral Water", "CCTV Security"],
    totalSeats: 30,
    bookedSeats: ["L4", "L5", "U2", "U3"],
    boardingPoints: [
      { name: "Koyambedu SmartBus Lounge", time: "10:00 PM" },
      { name: "Guindy Metro", time: "10:30 PM" },
      { name: "Tambaram Toll", time: "11:15 PM" }
    ],
    droppingPoints: [
      { name: "Mattuthavani SmartBus Lounge", time: "05:30 AM" }
    ]
  },
  {
    id: "bus-604",
    operator: "YBM Travels Scania",
    busType: "Scania Metrolink AC Sleeper (2+1)",
    from: "Chennai",
    to: "Madurai",
    date: "2026-11-12",
    departureTime: "09:45 PM",
    arrivalTime: "05:15 AM",
    duration: "7h 30m",
    price: 33,
    rating: 4.8,
    reviewsCount: 840,
    amenities: ["WiFi", "Water Bottle", "Blanket", "Charging Port", "Movie Screen"],
    totalSeats: 30,
    bookedSeats: ["L2", "U5"],
    boardingPoints: [
      { name: "Egmore Station", time: "09:45 PM" },
      { name: "Koyambedu Omni Stand", time: "10:15 PM" }
    ],
    droppingPoints: [
      { name: "Mattuthavani Bus Stand", time: "05:15 AM" }
    ]
  },
  {
    id: "bus-605",
    operator: "SRM Transports BharatBenz",
    busType: "BharatBenz AC Sleeper (2+1)",
    from: "Chennai",
    to: "Madurai",
    date: "2026-11-12",
    departureTime: "10:15 PM",
    arrivalTime: "05:45 AM",
    duration: "7h 30m",
    price: 31,
    rating: 4.7,
    reviewsCount: 730,
    amenities: ["WiFi", "Charging Port", "Water Bottle", "Blanket"],
    totalSeats: 30,
    bookedSeats: ["L6", "U6"],
    boardingPoints: [
      { name: "Koyambedu Omni Stand", time: "10:15 PM" },
      { name: "Tambaram MEPZ", time: "11:30 PM" }
    ],
    droppingPoints: [
      { name: "Mattuthavani Bus Stand", time: "05:45 AM" }
    ]
  },

  // --- New York to Boston ---
  {
    id: "bus-101",
    operator: "Royal Volvo Multi-Axle",
    busType: "Multi-Axle Volvo AC Sleeper (2+1)",
    from: "New York",
    to: "Boston",
    departureTime: "07:30 AM",
    arrivalTime: "11:45 AM",
    duration: "4h 15m",
    price: 38,
    rating: 4.8,
    reviewsCount: 342,
    amenities: ["WiFi", "Charging Port", "Water Bottle", "Blanket", "GPS Tracking"],
    totalSeats: 30,
    bookedSeats: ["L1", "L4", "L9", "U3", "U7"],
    boardingPoints: [
      { name: "Port Authority Bus Terminal (Gate 24)", time: "07:30 AM" },
      { name: "Queens Midtown Station", time: "07:50 AM" }
    ],
    droppingPoints: [
      { name: "South Station, Boston", time: "11:30 AM" },
      { name: "Back Bay Station", time: "11:45 AM" }
    ]
  },
  {
    id: "bus-102",
    operator: "Greenline Express Coach",
    busType: "Executive AC Seater (2+2)",
    from: "New York",
    to: "Boston",
    departureTime: "10:15 AM",
    arrivalTime: "02:30 PM",
    duration: "4h 15m",
    price: 28,
    rating: 4.6,
    reviewsCount: 218,
    amenities: ["WiFi", "Charging Port", "Movie Screen", "Reading Light"],
    totalSeats: 36,
    bookedSeats: ["1A", "1B", "3C", "4D", "5A"],
    boardingPoints: [
      { name: "Port Authority Bus Terminal (Gate 18)", time: "10:15 AM" }
    ],
    droppingPoints: [
      { name: "South Station, Boston", time: "02:30 PM" }
    ]
  },
  {
    id: "bus-105",
    operator: "Night Rider Luxury Sleeper",
    busType: "Luxury AC Sleeper (2+1)",
    from: "New York",
    to: "Boston",
    departureTime: "11:00 PM",
    arrivalTime: "03:45 AM",
    duration: "4h 45m",
    price: 45,
    rating: 4.9,
    reviewsCount: 520,
    amenities: ["WiFi", "Charging Port", "Blanket", "Pillow", "Snacks", "Water Bottle"],
    totalSeats: 30,
    bookedSeats: ["L2", "L3", "U1", "U2", "U8"],
    boardingPoints: [
      { name: "Times Square Terminal", time: "11:00 PM" }
    ],
    droppingPoints: [
      { name: "South Station, Boston", time: "03:45 AM" }
    ]
  },

  // --- Bangalore to Goa ---
  {
    id: "bus-301",
    operator: "Goa Coastal Cruiser",
    busType: "Multi-Axle Volvo AC Sleeper (2+1)",
    from: "Bangalore",
    to: "Goa",
    departureTime: "08:30 PM",
    arrivalTime: "07:30 AM",
    duration: "11h 00m",
    price: 42,
    rating: 4.8,
    reviewsCount: 890,
    amenities: ["WiFi", "Blanket", "Water Bottle", "Charging Port", "Emergency Exit"],
    totalSeats: 30,
    bookedSeats: ["L1", "L2", "U5", "U6"],
    boardingPoints: [
      { name: "Majestic Bus Stand", time: "08:30 PM" },
      { name: "Yeshwantpur Toll Plaza", time: "09:15 PM" }
    ],
    droppingPoints: [
      { name: "Panjim Kadamba Bus Terminal", time: "07:00 AM" },
      { name: "Mapusa Circle", time: "07:30 AM" }
    ]
  },

  // --- Bangalore to Chennai ---
  {
    id: "bus-305",
    operator: "Southern Cross Travels",
    busType: "Scania High-Deck Seater",
    from: "Bangalore",
    to: "Chennai",
    departureTime: "06:00 AM",
    arrivalTime: "12:00 PM",
    duration: "6h 00m",
    price: 22,
    rating: 4.5,
    reviewsCount: 610,
    amenities: ["WiFi", "Water Bottle", "Charging Port"],
    totalSeats: 36,
    bookedSeats: ["1A", "4B", "5A"],
    boardingPoints: [
      { name: "Shanthinagar Bus Station", time: "06:00 AM" },
      { name: "Indiranagar 100ft Rd", time: "06:30 AM" }
    ],
    droppingPoints: [
      { name: "Koyambedu CMBT", time: "12:00 PM" }
    ]
  }
];

export function generateFallbackBuses(from, to, date) {
  return [
    {
      id: `bus-dyn-1-${from}-${to}`,
      operator: "Grand Intercity Express",
      busType: "Multi-Axle AC Sleeper (2+1)",
      from: from,
      to: to,
      date: date || '2026-11-12',
      departureTime: "10:00 PM",
      arrivalTime: "05:30 AM",
      duration: "7h 30m",
      price: 34,
      rating: 4.8,
      reviewsCount: 320,
      amenities: ["WiFi", "Charging Port", "Blanket", "Water Bottle", "GPS Tracking"],
      totalSeats: 30,
      bookedSeats: ["L1", "L4", "U2"],
      boardingPoints: [
        { name: `${from} Central Stand`, time: "10:00 PM" },
        { name: `${from} Highway Junction`, time: "10:30 PM" }
      ],
      droppingPoints: [
        { name: `${to} Central Terminal`, time: "05:30 AM" }
      ]
    },
    {
      id: `bus-dyn-2-${from}-${to}`,
      operator: "Wanderer Superfast Coach",
      busType: "Executive AC Seater (2+2)",
      from: from,
      to: to,
      date: date || '2026-11-12',
      departureTime: "10:15 PM",
      arrivalTime: "05:45 AM",
      duration: "7h 30m",
      price: 26,
      rating: 4.6,
      reviewsCount: 210,
      amenities: ["WiFi", "Charging Port", "Reading Lamp"],
      totalSeats: 36,
      bookedSeats: ["1A", "2B", "4C"],
      boardingPoints: [
        { name: `${from} Main Stand`, time: "10:15 PM" }
      ],
      droppingPoints: [
        { name: `${to} Bus Station`, time: "05:45 AM" }
      ]
    },
    {
      id: `bus-dyn-3-${from}-${to}`,
      operator: "Starlight Night Cruiser",
      busType: "Luxury AC Sleeper (2+1)",
      from: from,
      to: to,
      date: date || '2026-11-12',
      departureTime: "10:30 PM",
      arrivalTime: "06:00 AM",
      duration: "7h 30m",
      price: 38,
      rating: 4.9,
      reviewsCount: 450,
      amenities: ["WiFi", "Pillow & Blanket", "Snacks Box", "Charging Port"],
      totalSeats: 30,
      bookedSeats: ["L2", "U6"],
      boardingPoints: [
        { name: `${from} Bypass Hub`, time: "10:30 PM" }
      ],
      droppingPoints: [
        { name: `${to} Main Circle`, time: "06:00 AM" }
      ]
    }
  ];
}
