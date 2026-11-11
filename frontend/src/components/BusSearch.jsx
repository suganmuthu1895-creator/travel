import React from 'react';
import { MapPin, Calendar, ArrowLeftRight, Search, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

export default function BusSearch({ 
  from, 
  setFrom, 
  to, 
  setTo, 
  date, 
  setDate, 
  onSearch, 
  cities, 
  busTypeFilter, 
  setBusTypeFilter,
  sortBy,
  setSortBy
}) {
  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleQuickRoute = (fromCity, toCity) => {
    setFrom(fromCity);
    setTo(toCity);
    onSearch(fromCity, toCity, date);
  };

  return (
    <div className="search-section">
      <div className="search-card">
        
        <div className="search-header">
          <h1 className="search-title">Book Your Bus Journey Across Cities</h1>
          <p className="search-subtitle">Search, select your preferred seats, and get instant verified confirmation</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSearch(from, to, date); }} className="search-form">
          <div className="search-inputs-grid">
            
            {/* From City */}
            <div className="search-field">
              <label className="field-label">
                <MapPin size={16} className="field-icon-label" />
                Leaving From
              </label>
              <div className="select-container">
                <input 
                  type="text" 
                  list="from-cities" 
                  value={from} 
                  onChange={(e) => setFrom(e.target.value)} 
                  placeholder="e.g. New York or Bangalore"
                  className="search-input"
                  required
                />
                <datalist id="from-cities">
                  {cities.map(c => <option key={`from-${c}`} value={c} />)}
                </datalist>
              </div>
            </div>

            {/* Swap Button */}
            <button 
              type="button" 
              onClick={handleSwap} 
              className="swap-btn" 
              title="Swap Departure and Destination"
            >
              <ArrowLeftRight size={18} />
            </button>

            {/* To City */}
            <div className="search-field">
              <label className="field-label">
                <MapPin size={16} className="field-icon-label" />
                Going To
              </label>
              <div className="select-container">
                <input 
                  type="text" 
                  list="to-cities" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)} 
                  placeholder="e.g. Boston or Goa"
                  className="search-input"
                  required
                />
                <datalist id="to-cities">
                  {cities.map(c => <option key={`to-${c}`} value={c} />)}
                </datalist>
              </div>
            </div>

            {/* Date */}
            <div className="search-field date-field">
              <label className="field-label">
                <Calendar size={16} className="field-icon-label" />
                Date of Travel
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="search-input"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Search Submit Button */}
            <button type="submit" className="search-submit-btn">
              <Search size={18} />
              <span>Search Buses</span>
            </button>

          </div>
        </form>

        {/* Popular Quick Route Chips */}
        <div className="popular-routes">
          <span className="popular-label">
            <Sparkles size={14} /> Popular Routes:
          </span>
          <div className="route-chips">
            <button 
              type="button" 
              className="route-chip" 
              style={{ background: 'rgba(56, 189, 248, 0.2)', borderColor: '#38bdf8', color: '#38bdf8', fontWeight: 700 }}
              onClick={() => {
                setFrom('Chennai');
                setTo('Madurai');
                setDate('2026-11-12');
                onSearch('Chennai', 'Madurai', '2026-11-12');
              }}
            >
              ⭐ Chennai → Madurai (12 Nov, 10 PM)
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('New York', 'Boston')}
            >
              New York → Boston
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('New York', 'Washington DC')}
            >
              New York → Washington DC
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('Bangalore', 'Goa')}
            >
              Bangalore → Goa
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('Bangalore', 'Chennai')}
            >
              Bangalore → Chennai
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('Mumbai', 'Goa')}
            >
              Mumbai → Goa
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('Bangalore', 'Hyderabad')}
            >
              Bangalore → Hyderabad
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('Delhi', 'Jaipur')}
            >
              Delhi → Jaipur
            </button>
            <button 
              type="button" 
              className="route-chip" 
              onClick={() => handleQuickRoute('New York', 'Philadelphia')}
            >
              New York → Philadelphia
            </button>
          </div>
        </div>

      </div>

      {/* Filter and Sort Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-group">
          <Filter size={16} className="filter-icon" />
          <span className="filter-title">Bus Type:</span>
          {['all', 'sleeper', 'seater', 'volvo'].map(type => (
            <button
              key={type}
              type="button"
              className={`filter-pill ${busTypeFilter === type ? 'active' : ''}`}
              onClick={() => setBusTypeFilter(type)}
            >
              {type === 'all' ? 'All Buses' : type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="sort-group">
          <SlidersHorizontal size={16} className="filter-icon" />
          <span className="filter-title">Sort By:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="time">Earliest Departure</option>
          </select>
        </div>
      </div>

    </div>
  );
}
