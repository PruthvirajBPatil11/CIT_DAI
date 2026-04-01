import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Galaxy from './components/Galaxy';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import About from './pages/About';

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setIsFadingOut(true);
      window.setTimeout(() => {
        setIsInitialLoading(false);
      }, 700); // 0.7s to finish the fade out transition
    }, 2200);

    return () => {
      window.clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <div className="app-shell">
      <div className="galaxy-background" aria-hidden="true">
        <Galaxy
          mouseRepulsion
          mouseInteraction
          density={1}
          glowIntensity={0.25}
          saturation={0}
          hueShift={0}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          repulsionStrength={2}
          autoCenterRepulsion={0}
          starSpeed={0.5}
          speed={1}
        />
      </div>
      
      {isInitialLoading && <Loader fullScreen isFadingOut={isFadingOut} />}
      
      {(!isInitialLoading || isFadingOut) && (
        <div className="content-layer fade-in">
          <Navbar />
          <main className="page-wrap">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
