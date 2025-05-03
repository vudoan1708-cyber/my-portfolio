import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutGroup } from 'framer-motion';

import Navbar from './components/Navbar';
import AnimatedHeader from './components/AnimatedHeader';
import PageWrapper from './components/PageWrapper';
import Footer from './components/Footer';

import { WebApps, Games, Utilities, AIProjects } from './pages/Portfolio';
import Blog from './pages/Blog';
import Resume from './pages/Resume';

export default function App() {
  return (
    <LayoutGroup>
      <Router>
        <Navbar />
        <AnimatedHeader />
        <PageWrapper>
          <Routes>
            <Route path="/portfolio/web-apps" element={<WebApps />} />
            <Route path="/portfolio/games" element={<Games />} />
            <Route path="/portfolio/utilities" element={<Utilities />} />
            <Route path="/portfolio/ai-projects" element={<AIProjects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/" element={<Navigate to="/portfolio/web-apps" replace />} />
            <Route path="*" element={<Navigate to="/portfolio/web-apps" replace />} />
          </Routes>
        </PageWrapper>
        <Footer />
      </Router>
    </LayoutGroup>
  );
}
