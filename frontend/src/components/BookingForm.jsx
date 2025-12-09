// frontend/src/components/BookingForm.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import useLivePrice from '../hooks/useLivePrice';

export default function BookingForm({ selectedSlot, courtId }) {
  const [rackets, setRackets] = useState(0);
  const [coachId, setCoachId] = useState('');
  const [coaches, setCoaches] = useState([]);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(null); // success object
  const [error, setError] = useState(null);     // error string
  const [showDetails, setShowDetails] = useState(false);

  const price = useLivePrice({ courtId, bookingTime: selectedSlot.startTime, rackets, coachId });

  useEffect(()=> {
    api.get('/coaches').then(r => setCoaches(r.data || [])).catch(()=>setCoaches([]));
  }, []);

  const handleBook = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await api.post('/bookings', {
        userId: 'test-user',
        courtId,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        resources: { rackets, coach: coachId || undefined }
      });

      // If API returns booking object, show friendly success
      const booking = res.data?.booking || res.data;
      setSuccess({
        message: 'Booking accepted — Completed successfully',
        booking,
      });

      // clear form lightly (you can keep the selection if you want)
      setBusy(false);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Booking failed';
      setError(msg);
      setBusy(false);
    }
  };

  return (
    <>
      {/* error toast */}
      {error && (
        <div className="card toast toast-error" role="alert" style={{ borderLeft: '4px solid #ff4d4f' }}>
          <div className="font-medium">Error</div>
          <div className="text-sm" style={{ marginTop: 6 }}>{error}</div>
          <div className="mt-3 text-xs" style={{ opacity: 0.8, cursor: 'pointer' }} onClick={() => setError(null)}>Dismiss</div>
        </div>
      )}

      {/* main form card */}
      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 8 }} className="section-label">
          Selected: <strong>{new Date(selectedSlot.startTime).toLocaleString()}</strong>
        </div>

        <div style={{ marginBottom: 12 }} className="section-label">
          Live Price: <strong>{price ? (price.total ?? JSON.stringify(price)) : 'calculating...'}</strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <label style={{ width: 80 }} className="section-label">Rackets</label>
          <input
            type="number"
            value={rackets}
            min={0}
            onChange={e=> setRackets(Number(e.target.value))}
            className="ios-input"
            style={{ width: 96 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <label style={{ width: 80 }} className="section-label">Coach</label>
          <select
            value={coachId}
            onChange={e=> setCoachId(e.target.value)}
            className="ios-input"
            style={{ width: '100%' }}
          >
            <option value="">None</option>
            {coaches.map(c => <option key={c._id} value={c._id}>{c.name} (${c.hourlyRate})</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleBook}
            disabled={busy}
            className={`ios-btn ios-btn-primary ${busy ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {busy ? 'Booking...' : 'Confirm Booking'}
          </button>

          <button
            onClick={() => { setRackets(0); setCoachId(''); }}
            className="ios-btn ios-btn-ghost"
          >
            Reset
          </button>
        </div>
      </div>

      {/* success modal */}
      {success && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" style={{ padding: 20 }}>
          <div className="card modal-card" style={{ maxWidth: 720 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>✅ {success.message}</h3>
                <p style={{ marginTop: 8, color: 'var(--text-muted)' }}>
                  Your booking was confirmed for <strong>{new Date(success.booking?.startTime || selectedSlot.startTime).toLocaleString()}</strong>.
                </p>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <button onClick={() => { setSuccess(null); setShowDetails(false); }} className="ios-btn ios-btn-primary">OK</button>
                  <button onClick={() => setShowDetails(sd => !sd)} className="ios-btn ios-btn-ghost">
                    {showDetails ? 'Hide details' : 'View details'}
                  </button>
                </div>

                {showDetails && (
                  <pre className="mt-4" style={{ fontSize: 12, padding: 12, background: '#f3f4f6', borderRadius: 8, maxHeight: 200, overflow: 'auto' }}>
                    {JSON.stringify(success.booking, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
