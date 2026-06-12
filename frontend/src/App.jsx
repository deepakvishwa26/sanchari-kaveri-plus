import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DriverDashboard from './pages/DriverDashboard';
import BookingDetail from './pages/BookingDetail';
import OTPVerify from './pages/OTPVerify';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/driver" replace />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/driver/:id" element={<BookingDetail />} />
        <Route path="/driver/:id/verify" element={<OTPVerify />} />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/driver" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
