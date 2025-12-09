import { useEffect, useState } from 'react';
import api from '../services/api';

export default function useLivePrice({ courtId, bookingTime, rackets, coachId }) {
  const [price, setPrice] = useState(null);

  useEffect(()=>{
    if(!courtId || !bookingTime) return;
    let cancelled = false;
    async function fetchPrice(){
      try {
        // call backend calc endpoint (falls back to admin calc stub)
        const res = await api.post('/admin/calcPrice', { courtId, bookingTime, resources: { rackets, coach: coachId } });
        if (!cancelled) setPrice(res.data.pricing || res.data);
      } catch (err) {
        console.error('price fetch err', err);
        if(!cancelled) setPrice(null);
      }
    }
    fetchPrice();
    return ()=> cancelled = true;
  }, [courtId, bookingTime, rackets, coachId]);

  return price;
}
