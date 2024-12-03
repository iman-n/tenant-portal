import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TicketForm } from './components/tickets/TicketForm';
import { TicketDashboard } from './components/tickets/TicketDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<TicketForm />} />
          <Route path="/dashboard" element={<TicketDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App