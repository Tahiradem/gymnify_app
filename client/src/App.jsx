import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainNavigationPage from './pages/MainNavigationPage';
import ExercisePage from './pages/ExercisePage';
import EachExercise from './pages/EachExercise';
import ProfilePage from './pages/ProfilePage';
import ReportPage from './pages/ReportPage';
import NutrationPage from "./pages/NutrationPage";
import SettingPage from "./pages/SettingPage";
import "./App.css"

function App() {
  return (
    <Router basename="/Gimnify-App">
      <Routes>
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<MainNavigationPage />} />
        <Route path="/Exercise_Review" element={<ExercisePage />} />
        <Route path="/Exercise" element={<EachExercise/>}/>
        <Route path="/Profile" element={<ProfilePage/>}/>
        <Route path='/report' element={<ReportPage/>}/>
        <Route path='/nutration' element={<NutrationPage/>}/>
        <Route path='/settings' element={<SettingPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;