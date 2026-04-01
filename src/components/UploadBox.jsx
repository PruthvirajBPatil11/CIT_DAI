import { useRef, useState } from 'react';

export default function UploadBox({ onUpload }) {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const streamRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const openCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      
      streamRef.current = stream;
      setIsCameraOpen(true);
      
      // Set the stream to video element after state update
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError(`Camera error: ${error.message}`);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
      if (onUpload) {
        onUpload(file);
      }
      closeCamera();
    }, 'image/jpeg');
  };

  if (isCameraOpen) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'rgba(15, 23, 42, 0.5)', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '10px' }}>📸 Camera</h2>
        
        <div style={{ marginBottom: '20px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              minHeight: '300px',
              display: 'block',
              backgroundColor: '#000'
            }}
          />
        </div>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={capturePhoto}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#0891b2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📸 Capture
          </button>
          <button
            onClick={closeCamera}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>

        {cameraError && (
          <div style={{ color: '#f87171', fontSize: '14px', padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
            {cameraError}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="card upload-box max-w-2xl mx-auto">
      <h2>Analyze New Image</h2>
      <p className="text-gray-400 mb-8 font-light">Choose one of the options below to begin safety detection.</p>
      
      <input 
        ref={fileInputRef}
        type="file" 
        accept="image/*" 
        onChange={handleChange}
        className="hidden"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Option */}
        <div 
          onClick={handleFileClick}
          className="upload-area group cursor-pointer"
        >
          <div className="flex flex-col items-center gap-3 py-8">
            <svg className="w-12 h-12 text-cyan-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6" />
            </svg>
            <span className="px-6 py-2 bg-white/10 rounded-lg text-sm font-medium border border-white/10 group-hover:bg-white/20 transition-all">
              Select Orbital Scan
            </span>
            <p className="text-xs text-gray-500 text-center mt-2">Drag and drop or click to select image</p>
          </div>
        </div>

        {/* Camera Capture Option */}
        <div 
          onClick={openCamera}
          className="upload-area group cursor-pointer border border-white/10"
        >
          <div className="flex flex-col items-center gap-3 py-8">
            <svg className="w-12 h-12 text-purple-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="px-6 py-2 bg-white/10 rounded-lg text-sm font-medium border border-white/10 group-hover:bg-white/20 transition-all">
              Take Photo
            </span>
            <p className="text-xs text-gray-500 text-center mt-2">Use device camera</p>
          </div>
        </div>
      </div>
    </section>
  );
}
