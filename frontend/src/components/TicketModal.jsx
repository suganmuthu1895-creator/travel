import React from 'react';
import { CheckCircle2, QrCode, Printer, X, Bus, Calendar, Clock, MapPin, User } from 'lucide-react';

export default function TicketModal({ booking, onClose, onViewBookings }) {
  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="ticket-modal-card">
        
        {/* Modal Close Button */}
        <button type="button" onClick={onClose} className="modal-close-btn">
          <X size={20} />
        </button>

        {/* Top Success Banner */}
        <div className="ticket-success-header">
          <div className="ticket-success-icon-wrap">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="ticket-success-title">Bus Ticket Confirmed!</h2>
          <p className="ticket-success-sub">Your digital boarding pass has been generated and verified by the backend server.</p>
        </div>

        {/* Boarding Pass Container */}
        <div className="boarding-pass">
          
          {/* Header of Pass */}
          <div className="pass-top">
            <div className="pass-brand">
              <Bus size={20} />
              <span>WanderBus Express</span>
            </div>
            <div className="pass-pnr-badge">
              <span className="pnr-label">PNR NUMBER</span>
              <span className="pnr-val">{booking.pnr}</span>
            </div>
          </div>

          {/* Journey Section */}
          <div className="pass-route-strip">
            <div className="route-stop">
              <span className="route-city">{booking.from}</span>
              <span className="route-time">{booking.departureTime}</span>
            </div>
            <div className="route-arrow-box">
              <span className="route-duration">{booking.duration}</span>
              <div className="route-arrow-line">
                <span>✈️</span>
              </div>
            </div>
            <div className="route-stop right">
              <span className="route-city">{booking.to}</span>
              <span className="route-time">{booking.arrivalTime}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="pass-info-grid">
            <div className="pass-info-cell">
              <span className="info-cell-label"><Calendar size={12} /> Date</span>
              <span className="info-cell-val">{booking.travelDate}</span>
            </div>
            <div className="pass-info-cell">
              <span className="info-cell-label"><Bus size={12} /> Operator</span>
              <span className="info-cell-val">{booking.operator}</span>
            </div>
            <div className="pass-info-cell">
              <span className="info-cell-label">Seats</span>
              <span className="info-cell-val highlight">{booking.seats?.join(', ')}</span>
            </div>
            <div className="pass-info-cell">
              <span className="info-cell-label">Total Fare Paid</span>
              <span className="info-cell-val price">${booking.totalFare}</span>
            </div>
          </div>

          {/* Boarding & Dropping Points */}
          <div className="pass-points">
            <div className="pass-point-item">
              <MapPin size={14} className="point-icon green" />
              <div>
                <span className="point-caption">Boarding Point:</span>
                <span className="point-name">{booking.boardingPoint}</span>
              </div>
            </div>
            <div className="pass-point-item">
              <MapPin size={14} className="point-icon red" />
              <div>
                <span className="point-caption">Dropping Point:</span>
                <span className="point-name">{booking.droppingPoint}</span>
              </div>
            </div>
          </div>

          {/* Passenger Names */}
          <div className="pass-passengers-list">
            <span className="pass-p-label"><User size={12} /> Passengers:</span>
            <div className="pass-p-tags">
              {booking.passengers?.map((p, idx) => (
                <span key={idx} className="pass-p-tag">
                  {p.name} ({p.gender || 'M'}, {p.age || '25'}) - Seat {p.seatNo}
                </span>
              ))}
            </div>
          </div>

          {/* Tear-off Barcode / QR Section */}
          <div className="pass-perforation">
            <div className="cut-circle left"></div>
            <div className="perforated-line"></div>
            <div className="cut-circle right"></div>
          </div>

          <div className="pass-bottom-barcode">
            <div className="qr-box">
              <QrCode size={56} />
            </div>
            <div className="barcode-box">
              <div className="barcode-bars"></div>
              <span className="barcode-text">TICKET-AUTH-{booking.pnr}</span>
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="ticket-actions">
          <button 
            type="button" 
            onClick={() => window.print()} 
            className="ticket-btn print"
          >
            <Printer size={16} />
            <span>Print / Save Ticket</span>
          </button>
          
          <button 
            type="button" 
            onClick={onViewBookings} 
            className="ticket-btn primary"
          >
            <span>View All My Bookings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
