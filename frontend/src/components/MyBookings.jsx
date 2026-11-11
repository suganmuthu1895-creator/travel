import React from 'react';
import { Ticket, Calendar, Clock, MapPin, Bus, Trash2, Eye, AlertCircle, ArrowRight } from 'lucide-react';

export default function MyBookings({ 
  bookings, 
  onViewTicket, 
  onCancelBooking, 
  onStartSearch,
  isCancelling
}) {
  return (
    <div className="my-bookings-container">
      <div className="bookings-header">
        <div>
          <h2 className="bookings-page-title">My Bus Bookings</h2>
          <p className="bookings-page-sub">View your upcoming trips, download boarding passes, or manage your reservations</p>
        </div>
      </div>

      {(!bookings || bookings.length === 0) ? (
        <div className="empty-bookings-card">
          <div className="empty-icon-wrap">
            <Ticket size={40} />
          </div>
          <h3 className="empty-title">No Bus Bookings Found</h3>
          <p className="empty-sub">You have not booked any bus tickets yet. Search routes and reserve your seats now!</p>
          <button 
            type="button" 
            onClick={onStartSearch} 
            className="empty-cta-btn"
          >
            <span>Search Available Buses</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'CANCELLED';

            return (
              <div key={booking.pnr} className={`booking-record-card ${isCancelled ? 'cancelled' : ''}`}>
                
                {/* Header Strip */}
                <div className="booking-card-top">
                  <div className="booking-operator-info">
                    <Bus size={18} className="bus-icon-small" />
                    <span className="b-operator">{booking.operator}</span>
                    <span className="b-bus-type">({booking.busType})</span>
                  </div>

                  <div className="booking-status-wrap">
                    <span className="b-pnr-pill">PNR: {booking.pnr}</span>
                    <span className={`status-pill ${isCancelled ? 'cancelled' : 'confirmed'}`}>
                      {booking.status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>

                {/* Route & Times */}
                <div className="booking-card-route">
                  <div className="route-col">
                    <span className="route-city-label">{booking.from}</span>
                    <span className="route-time-val">{booking.departureTime}</span>
                    <span className="route-point-val">{booking.boardingPoint}</span>
                  </div>

                  <div className="route-duration-center">
                    <span className="route-date-badge">
                      <Calendar size={12} />
                      {booking.travelDate}
                    </span>
                    <div className="route-line-decor">
                      <span>🚌</span>
                    </div>
                    <span className="route-duration-val">{booking.duration}</span>
                  </div>

                  <div className="route-col right">
                    <span className="route-city-label">{booking.to}</span>
                    <span className="route-time-val">{booking.arrivalTime}</span>
                    <span className="route-point-val">{booking.droppingPoint}</span>
                  </div>
                </div>

                {/* Footer details & actions */}
                <div className="booking-card-footer">
                  <div className="footer-details">
                    <div className="footer-seat-info">
                      <span className="f-label">Seats:</span>
                      <span className="f-val seats">{booking.seats?.join(', ')}</span>
                    </div>
                    <div className="footer-fare-info">
                      <span className="f-label">Total Fare:</span>
                      <span className="f-val price">${booking.totalFare}</span>
                    </div>
                    <div className="footer-passengers">
                      <span className="f-label">Passengers:</span>
                      <span className="f-val">{booking.passengers?.map(p => p.name).join(', ')}</span>
                    </div>
                  </div>

                  <div className="booking-card-actions">
                    <button 
                      type="button" 
                      onClick={() => onViewTicket(booking)} 
                      className="b-action-btn view"
                      title="View Boarding Pass"
                    >
                      <Eye size={15} />
                      <span>View Ticket</span>
                    </button>

                    {!isCancelled && (
                      <button 
                        type="button" 
                        disabled={isCancelling}
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to cancel booking ${booking.pnr}?`)) {
                            onCancelBooking(booking.pnr);
                          }
                        }} 
                        className="b-action-btn cancel"
                        title="Cancel this reservation"
                      >
                        <Trash2 size={15} />
                        <span>Cancel Booking</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
