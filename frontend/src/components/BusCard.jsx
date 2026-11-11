import React from 'react';
import { Clock, Star, Wifi, Zap, Coffee, ShieldCheck, ChevronRight } from 'lucide-react';

export default function BusCard({ bus, onSelectBus, isSelected }) {
  return (
    <div className={`bus-card ${isSelected ? 'selected' : ''}`}>
      <div className="bus-card-main">
        
        {/* Left: Operator Details */}
        <div className="bus-info-col">
          <div className="bus-operator-row">
            <h3 className="bus-operator-name">{bus.operator}</h3>
            <span className="bus-rating-badge">
              <Star size={12} fill="#eab308" color="#eab308" />
              <span>{bus.rating}</span>
              <span className="rating-count">({bus.reviewsCount || 150})</span>
            </span>
          </div>

          <span className="bus-type-tag">{bus.busType}</span>

          {/* Amenities Chips */}
          <div className="bus-amenities">
            {bus.amenities?.map((amenity, idx) => (
              <span key={idx} className="amenity-chip">
                {amenity.toLowerCase().includes('wifi') && <Wifi size={12} />}
                {amenity.toLowerCase().includes('charg') && <Zap size={12} />}
                {amenity.toLowerCase().includes('coffee') && <Coffee size={12} />}
                <span>{amenity}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Center: Journey Timings & Duration */}
        <div className="bus-timings-col">
          <div className="time-block departure">
            <span className="time-val">{bus.departureTime}</span>
            <span className="city-val">{bus.from}</span>
          </div>

          <div className="duration-line-wrap">
            <span className="duration-text">
              <Clock size={12} />
              {bus.duration}
            </span>
            <div className="duration-line">
              <span className="dot start"></span>
              <span className="line"></span>
              <span className="dot end"></span>
            </div>
          </div>

          <div className="time-block arrival">
            <span className="time-val">{bus.arrivalTime}</span>
            <span className="city-val">{bus.to}</span>
          </div>
        </div>

        {/* Right: Pricing & CTA */}
        <div className="bus-fare-col">
          <div className="fare-display">
            <span className="fare-label">Starting from</span>
            <div className="fare-amount">
              <span className="currency">$</span>
              <span className="price">{bus.price}</span>
            </div>
          </div>

          <span className={`seats-badge ${bus.availableSeats < 5 ? 'urgent' : ''}`}>
            {bus.availableSeats} Seats Available
          </span>

          <button 
            type="button" 
            className={`select-seats-btn ${isSelected ? 'active' : ''}`}
            onClick={() => onSelectBus(bus)}
          >
            <span>{isSelected ? 'Hide Seats' : 'Select Seats'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
