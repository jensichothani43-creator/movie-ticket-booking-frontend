
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/User/Login";
import Home from "./pages/User/Home";
import Offers from "./pages/User/Offers";
import UserOffers from "./pages/User/UserOffers";
import Movies from "./pages/User/Movies";


import Screens from "./pages/Admin/Screens";
import SelectShow from "./pages/User/SelectShow";
import SeatSelection from "./pages/User/SeatSelection";
import Ticket from "./pages/User/Ticket";
import FinalTicket from "./pages/User/FinalTicket";
import Shows from "./pages/Admin/Shows";
import MyBookings from "./pages/User/MyBookings";
import MovieDetail from "./pages/User/MovieDetail";
import CategoryPage from "./pages/User/CategoryPage";
import ActionMovies from "./pages/User/ActionMovies";
import PaymentPage from "./pages/User/PaymentPage";
import CustomerModal from "./pages/User/CustomerModal";
import CinemaList from "./pages/User/CinemaList";
import PaymentResult from "./pages/User/PaymentResult";
import PaymentFailed from "./pages/User/PaymentFailed";
import Register from "./pages/User/Register";
import Profile from "./pages/User/Profile";
import PaymentCancel from "./pages/User/PaymentCancel";
import Layout from "./components/Layout";
import PrivateRoute from "./PrivateRoute";
import Admin from "./pages/Admin/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>        {/* AUTH */}
        <Route path="/" element={<Login />} />
            <Route element={<Layout />}></Route>
    
        <Route path="/login" element={<Login />} />
        {/* HOME */}
     
        <Route path="/index" element={<Navigate to="/home" replace />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/user-offers/:movie_id" element={<UserOffers />} />
        {/* MOVIES */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route 
  path="/cinemas" 
  element={<CinemaList />}
/>
<Route 
  path="/payment-cancel" 
  element={<PaymentCancel />} 
/>
        {/* BOOKING FLOW */}
        <Route path="/shows/:id" element={<SelectShow/>} />
        <Route 
 path="/seat-selection/:id"
 element={<SeatSelection/>}
/>
<Route 
 path="/profile" 
 element={<Profile />}
/>
<Route
  path="/home"
  element={
    <PrivateRoute>
      <Home />
    </PrivateRoute>
  }
/>
        <Route path="/ticket/:id" element={<Ticket />} />
        {/* FINAL TICKET */}
       <Route path="/final-ticket" element={<FinalTicket />} />
        {/* OTHER */}
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/action" element={<ActionMovies />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        
        <Route path="/admin" element={<Admin />} />
        
        <Route path="/register" element={<Register />}
/>
{/* 🛠️ ADMIN PANEL */}{/* 🛠️ ADMIN PANEL — હવે guarded */}
<Route
  path="/admin"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/movies"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/screens"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/shows"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/offers"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/settings"
  element={
    <PrivateRoute requireAdmin>
      <Admin />
    </PrivateRoute>
  }
/>

<Route path="/admin/settings" element={<Admin />} />
        <Route path="/payment" element={<PaymentPage />} />
  
<Route
  path="/payment-success"
  element={<PaymentResult />}
/>

<Route 
 path="/payment-failed" 
 element={<PaymentFailed />}
/>
        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", marginTop: "50px" }}>
              <h2>404 Page Not Found</h2>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
    
  );
}