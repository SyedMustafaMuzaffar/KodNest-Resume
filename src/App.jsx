import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Proof from './pages/Proof';
import { ResumeProvider } from './context/ResumeContext';

import PremiumLayout from './layouts/PremiumLayout';
import Step01Problem from './pages/Step01Problem';
import Step02Market from './pages/Step02Market';
import Step03Architecture from './pages/Step03Architecture';
import Step04HLD from './pages/Step04HLD';
import Step05LLD from './pages/Step05LLD';
import Step06Build from './pages/Step06Build';
import Step07Test from './pages/Step07Test';
import Step08Ship from './pages/Step08Ship';

function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="builder" element={<Builder />} />
            <Route path="preview" element={<Preview />} />
            <Route path="proof" element={<Proof />} />
          </Route>

          {/* Build Track Routes */}
          <Route path="/rb" element={<PremiumLayout />}>
            <Route path="01-problem" element={<Step01Problem />} />
            <Route path="02-market" element={<Step02Market />} />
            <Route path="03-architecture" element={<Step03Architecture />} />
            <Route path="04-hld" element={<Step04HLD />} />
            <Route path="05-lld" element={<Step05LLD />} />
            <Route path="06-build" element={<Step06Build />} />
            <Route path="07-test" element={<Step07Test />} />
            <Route path="08-ship" element={<Step08Ship />} />
            <Route path="proof" element={<Proof />} />
          </Route>
        </Routes>
      </ResumeProvider>
    </BrowserRouter>
  );
}

export default App;
