import React from 'react';

export default function SlotSelector({ onSelect }) {
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8–20
  const today = new Date();
  const dateISO = today.toISOString().slice(0, 10);

  return (
    <div className="card">
      <label className="section-label">Select time slot (today)</label>

      {/* iOS time grid */}
      <div className="time-grid">
        {hours.map(h => {
          const start = `${dateISO}T${String(h).padStart(2, '0')}:00:00.000Z`;
          const endH = h + 1;
          const end = `${dateISO}T${String(endH).padStart(2, '0')}:00:00.000Z`;

          return (
            <div
              key={h}
              onClick={() => onSelect({ startTime: start, endTime: end })}
              className="time-chip"
            >
              <div className="font-medium">{h}:00 — {endH}:00</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
