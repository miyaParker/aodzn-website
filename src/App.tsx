import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WorksPage from './pages/WorksPage';
import CaseStudyPage from './pages/CaseStudyPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/works/:id" element={<CaseStudyPage />} />
      </Routes>
    </BrowserRouter>
  );
}
