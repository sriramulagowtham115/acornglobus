import React from 'react';
import BookingPage from './pages/BookingPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Acorn Globus — Book a Court</h1>
        <BookingPage />
      </div>
    </div>
  );
}
