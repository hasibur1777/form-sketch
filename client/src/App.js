import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateTemplate from './components/CreateTemplate';
import FillupTemplate from './components/FillupTemplate';
import ViewResponses from './components/ViewResponses';

const ProtectedRoute = ({ element, redirectTo }) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        // Token has expired
        localStorage.removeItem('token');
        return <Navigate to={redirectTo} />;
      }

      return element;
    } catch (err) {
      localStorage.removeItem('token');
      return <Navigate to={redirectTo} />;
    }
  }

  return <Navigate to={redirectTo} />;
};

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute element={<Home />} redirectTo="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={<Profile />}
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/create-template"
          element={
            <ProtectedRoute
              element={<CreateTemplate />}
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/fillup-template/:id"
          element={
            <ProtectedRoute
              element={<FillupTemplate />}
              redirectTo="/login"
            />
          }
        />
        <Route
          path="/template/:id/responses"
          element={
            <ProtectedRoute
              element={<ViewResponses />}
              redirectTo="/login"
            />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
