import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SignupForm from './components/SignupForm'
import LoginForm from './components/LoginForm'
import AdvancedDashboard from './components/AdvancedDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './App.css'

function App() {
  // Check if user is logged in
  const isLoggedIn = () => {
    const ls = localStorage.getItem('user');
    const ss = sessionStorage.getItem('user');
    return ls !== null || ss !== null;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="pt-16 flex-grow"> {/* Add padding to account for fixed navbar */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route 
              path="/dashboard" 
              element={isLoggedIn() ? <AdvancedDashboard /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
