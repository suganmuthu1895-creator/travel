import React, { useState } from 'react';
import { User, Check, AlertCircle, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export default function SeatLayout({ 
  bus, 
  user, 
  travelDate, 
  onConfirmBooking, 
  isBookingLoading,
  onRequireLogin
}) {
  const [deck, setDeck] = useState('lower'); // 'lower' or 'upper'
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState(
    bus.boardingPoints?.[0]?.name || `${bus.from} Central Station`
  );
  const [droppingPoint, setDroppingPoint] = useState(
    bus.droppingPoints?.[0]?.name || `${bus.to} Main Terminal`
  );

  // Dynamic passengers state based on selected seats
  const [passengers, setPassengers] = useState([
    { name: user?.name || '', age: '28', gender: 'Male', seatNo: '' }
  ]);

  const isSleeper = bus.busType.toLowerCase().includes('sleeper');

  // Generate seat matrix based on bus type
  const lowerSeats = isSleeper 
    ? ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15']
    : ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D', '4A', '4B', '4C', '4D', '5A', '5B', '5C', '5D'];

  const upperSeats = ['U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15'];

  const activeSeats = deck === 'lower' ? lowerSeats : upperSeats;

  const handleSeatClick = (seat) => {
    if (bus.bookedSeats?.includes(seat)) return;

    if (selectedSeats.includes(seat)) {
      const nextSeats = selectedSeats.filter(s => s !== seat);
      setSelectedSeats(nextSeats);
      setPassengers(passengers.filter(p => p.seatNo !== seat));
    } else {
      if (selectedSeats.length >= 5) {
        alert("You can select a maximum of 5 seats per booking.");
        return;
      }
      const nextSeats = [...selectedSeats, seat];
      setSelectedSeats(nextSeats);

      // Add passenger slot
      const existing = passengers.filter(p => p.seatNo && nextSeats.includes(p.seatNo));
      const newPassenger = {
        name: nextSeats.length === 1 && user?.name ? user.name : '',
        age: '25',
        gender: 'Male',
        seatNo: seat
      };
      setPassengers([...existing, newPassenger]);
    }
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      onRequireLogin();
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat to continue.");
      return;
    }

    // Validate passenger names
    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].name?.trim()) {
        alert(`Please enter name for passenger on Seat ${passengers[i].seatNo}`);
        return;
      }
    }

    const baseFare = bus.price * selectedSeats.length;
    const tax = Math.round(baseFare * 0.05);
    const totalFare = baseFare + tax;

    onConfirmBooking({
      busId: bus.id,
      operator: bus.operator,
      busType: bus.busType,
      from: bus.from,
      to: bus.to,
      travelDate: travelDate,
      departureTime: bus.departureTime,
      arrivalTime: bus.arrivalTime,
      duration: bus.duration,
      boardingPoint: boardingPoint,
      droppingPoint: droppingPoint,
      seats: selectedSeats,
      passengers: passengers,
      totalFare: totalFare
    });
  };

  const baseFare = bus.price * selectedSeats.length;
  const tax = selectedSeats.length > 0 ? Math.round(baseFare * 0.05) : 0;
  const totalFare = baseFare + tax;

  return (
    <div className="seat-layout-drawer">
      <div className="seat-drawer-grid">
        
        {/* Left Side: Seat Map */}
        <div className="seat-map-container">
          <div className="seat-map-header">
            <h4 className="seat-map-title">Select Your Preferred Seats</h4>
            
            {/* Deck Selector for Sleepers */}
            {isSleeper && (
              <div className="deck-toggle">
                <button 
                  type="button" 
                  className={`deck-btn ${deck === 'lower' ? 'active' : ''}`}
                  onClick={() => setDeck('lower')}
                >
                  Lower Deck
                </button>
                <button 
                  type="button" 
                  className={`deck-btn ${deck === 'upper' ? 'active' : ''}`}
                  onClick={() => setDeck('upper')}
                >
                  Upper Deck
                </button>
              </div>
            )}
          </div>

          {/* Seat Color Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <span className="legend-box available"></span>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <span className="legend-box booked"></span>
              <span>Booked</span>
            </div>
            <div className="legend-item">
              <span className="legend-box selected"></span>
              <span>Selected</span>
            </div>
          </div>

          {/* Bus Interior Shell */}
          <div className="bus-interior">
            {/* Front Cabin & Steering */}
            <div className="bus-front-cabin">
              <span className="front-label">FRONT</span>
              <div className="steering-wheel" title="Driver's Cabin">
                ☸️
              </div>
            </div>

            {/* Seats Grid */}
            <div className={`bus-seats-grid ${isSleeper ? 'sleeper-grid' : 'seater-grid'}`}>
              {activeSeats.map((seatNo) => {
                const isBooked = bus.bookedSeats?.includes(seatNo);
                const isSelected = selectedSeats.includes(seatNo);

                return (
                  <button
                    key={seatNo}
                    type="button"
                    disabled={isBooked}
                    className={`bus-seat ${isSleeper ? 'sleeper-seat' : 'standard-seat'} ${
                      isBooked ? 'booked' : isSelected ? 'selected' : 'available'
                    }`}
                    onClick={() => handleSeatClick(seatNo)}
                    title={isBooked ? `Seat ${seatNo} (Booked)` : `Seat ${seatNo} ($${bus.price})`}
                  >
                    <span className="seat-label">{seatNo}</span>
                    {isSelected && <Check size={12} className="seat-check" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Boarding, Dropping & Passenger Form */}
        <div className="seat-booking-form-col">
          <form onSubmit={handleBookingSubmit}>
            
            {/* Boarding & Dropping Points */}
            <div className="points-container">
              <div className="point-select-group">
                <label className="point-label">
                  <MapPin size={14} className="point-icon" />
                  Boarding Point:
                </label>
                <select 
                  value={boardingPoint} 
                  onChange={(e) => setBoardingPoint(e.target.value)}
                  className="point-select"
                >
                  {bus.boardingPoints?.map((bp, i) => (
                    <option key={i} value={bp.name}>{bp.name} ({bp.time})</option>
                  ))}
                  {(!bus.boardingPoints || bus.boardingPoints.length === 0) && (
                    <option value={`${bus.from} Central Terminal`}>{bus.from} Central Terminal ({bus.departureTime})</option>
                  )}
                </select>
              </div>

              <div className="point-select-group">
                <label className="point-label">
                  <MapPin size={14} className="point-icon" />
                  Dropping Point:
                </label>
                <select 
                  value={droppingPoint} 
                  onChange={(e) => setDroppingPoint(e.target.value)}
                  className="point-select"
                >
                  {bus.droppingPoints?.map((dp, i) => (
                    <option key={i} value={dp.name}>{dp.name} ({dp.time})</option>
                  ))}
                  {(!bus.droppingPoints || bus.droppingPoints.length === 0) && (
                    <option value={`${bus.to} Main Drop Point`}>{bus.to} Main Drop Point ({bus.arrivalTime})</option>
                  )}
                </select>
              </div>
            </div>

            {/* Passenger Information */}
            <div className="passengers-info-card">
              <h5 className="passenger-section-title">
                Passenger Details ({selectedSeats.length > 0 ? `${selectedSeats.length} Selected` : 'Select a seat'})
              </h5>

              {selectedSeats.length === 0 ? (
                <div className="no-seats-alert">
                  <AlertCircle size={16} />
                  <span>Please pick one or more seats from the layout to enter passenger details.</span>
                </div>
              ) : (
                passengers.map((p, idx) => (
                  <div key={idx} className="passenger-row-card">
                    <div className="passenger-seat-badge">
                      <span>Seat: <strong>{p.seatNo}</strong></span>
                    </div>

                    <div className="passenger-fields">
                      <input 
                        type="text" 
                        placeholder="Passenger Full Name" 
                        value={p.name} 
                        onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)} 
                        className="p-input p-name"
                        required
                      />

                      <div className="p-sub-fields">
                        <input 
                          type="number" 
                          placeholder="Age" 
                          min="1" 
                          max="110"
                          value={p.age} 
                          onChange={(e) => handlePassengerChange(idx, 'age', e.target.value)} 
                          className="p-input p-age"
                          required
                        />

                        <select 
                          value={p.gender} 
                          onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                          className="p-input p-gender"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Fare Summary */}
            <div className="fare-summary-box">
              <div className="fare-row">
                <span>Selected Seats ({selectedSeats.length})</span>
                <span className="seat-chips-list">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </span>
              </div>
              <div className="fare-row">
                <span>Base Fare</span>
                <span>${baseFare}</span>
              </div>
              <div className="fare-row">
                <span>Taxes & Station Fees</span>
                <span>${tax}</span>
              </div>
              <div className="fare-row total">
                <span>Total Amount</span>
                <span className="total-highlight">${totalFare}</span>
              </div>
            </div>

            {/* Action Button */}
            {!user ? (
              <button 
                type="button" 
                onClick={onRequireLogin}
                className="checkout-btn login-required"
              >
                <span>Sign In to Complete Booking</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={selectedSeats.length === 0 || isBookingLoading}
                className="checkout-btn"
              >
                {isBookingLoading ? (
                  <span>Reserving Ticket with Backend...</span>
                ) : (
                  <>
                    <span>Proceed to Book (${totalFare})</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}

          </form>
        </div>

      </div>
    </div>
  );
}
