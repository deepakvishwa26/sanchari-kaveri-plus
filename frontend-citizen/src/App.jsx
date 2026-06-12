import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import BookingStatus from './pages/BookingStatus';
import OTPConfirmPage from './pages/OTPConfirmPage';
import DriverDashboard from './pages/DriverDashboard';
import DriverRoutePage from './pages/DriverRoutePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<BookingPage />} />
        <Route path='/book' element={<BookingPage />} />
        <Route path='/success' element={<BookingSuccess />} />
        <Route path='/status/:bookingId' element={<BookingStatus />} />
        <Route path='/confirm/:bookingId' element={<OTPConfirmPage />} />
        <Route path='/driver' element={<DriverDashboard />} />
        <Route path='/driver/:bookingId' element={<DriverRoutePage />} />
      </Routes>
    </BrowserRouter>
  );
}
