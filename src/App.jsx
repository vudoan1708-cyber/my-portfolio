import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { LayoutGroup } from 'framer-motion';

import Navbar from './components/Navbar';
import AnimatedHeader from './components/AnimatedHeader';
import PageWrapper from './components/PageWrapper';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';

import Portfolio from './pages/Portfolio';
import Music from './pages/Music';
import Resume from './pages/Resume';

export default function App() {
  return (
    <LayoutGroup>
      <Router>
        <Navbar />
        <AnimatedHeader />
        <PageWrapper>
          <Routes>
            <Route path="/portfolio/:collection/:projectKey" element={<ProjectDetail />} />
            <Route path="/portfolio/:collection" element={<Portfolio />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/music" element={<Music />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/" element={<Navigate to="/portfolio" replace />} />
            <Route path="*" element={<Navigate to="/portfolio" replace />} />
          </Routes>
        </PageWrapper>
        <Footer />
      </Router>
    </LayoutGroup>
  );
}
