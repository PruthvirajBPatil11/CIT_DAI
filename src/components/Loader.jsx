function Loader({ fullScreen = true, isFadingOut = false }) {
  return (
    <div
      className={`${fullScreen ? 'loader-overlay' : 'loader-wrap'} ${isFadingOut ? 'fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="space-loader">
        <div className="central-star" />
        <div className="orbit orbit-1">
          <div className="planet planet-1" />
        </div>
        <div className="orbit orbit-2">
          <div className="planet planet-2">
            <div className="moon-orbit">
              <div className="moon" />
            </div>
          </div>
        </div>
        <div className="orbit orbit-3">
          <div className="planet planet-3" />
        </div>
      </div>
    </div>
  );
}

export default Loader;