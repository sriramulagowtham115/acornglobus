import React, { useEffect, useState } from 'react';
import api from '../services/api';
import SlotSelector from '../components/SlotSelector';
import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/courts')
      .then(r => setCourts(r.data || []))
      .catch(() => setCourts([]));
  }, []);

  return (
    <div className="page">
      
      <label className="section-label">Choose a court</label>

      {/* iOS segmented control */}
      <div className="segmented">
        {courts.map(c => (
          <button
            key={c._id || c.name}
            onClick={() => setSelected(prev => ({ ...prev, courtId: c._id, court: c }))}
            className={selected?.courtId === c._id ? "active" : ""}
          >
            {c.name} ({c.type}) — ${c.basePrice}
          </button>
        ))}
      </div>

      {/* Time slot selector */}
      <SlotSelector
        onSelect={(slot) => setSelected(prev => ({ ...prev, ...slot }))}
      />

      {/* Booking form */}
      {selected && selected.startTime && selected.courtId && (
        <BookingForm selectedSlot={selected} courtId={selected.courtId} />
      )}
    </div>
  );
}
