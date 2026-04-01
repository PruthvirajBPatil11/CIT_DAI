import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSessionData,
  saveSessionResults,
  listenToSessionUpdates
} from '../utils/qrSession';
import DetectionCard from '../components/DetectionCard';
import Loader from '../components/Loader';

// Safety Equipment Class Labels (same as desktop)
const CLASS_LABELS = {
  0: 'Oxygen Tank',
  1: 'Nitrogen Tank',
  2: 'First Aid Box',
  3: 'Fire Alarm',
  4: 'Safety Switch Panel',
  5: 'Emergency Phone',
  6: 'Fire Extinguisher'
};

const ROBOFLOW_API_KEY = 'r5DwvZgX7t9X3zmkaaY4';
const MODEL_ID = 'my-first-project-qvd8s/2';
const ROBOFLOW_API_URL = 'https://serverless.roboflow.com';

export default function MobileUpload() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [sessionValid, setSessionValid] = useState(null);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Validate session on mount
  useEffect(() => {
    const session = getSessionData(sessionId);
    if (session && !session.expiresAt || session.expiresAt > Date.now()) {
      setSessionValid(true);
    } else {
      setSessionValid(false);
    }
  }, [sessionId]);

  // Listen for session updates
  useEffect(() => {
    if (!sessionValid) return;

    const unsubscribe = listenToSessionUpdates(sessionId, (updatedSession) => {
      // Could use this for desktop-to-mobile updates in future
      console.log('Session updated:', updatedSession);
    });

    return unsubscribe;
  }, [sessionId, sessionValid]);

  const drawDetections = (predictions, imageElement) => {
    if (!canvasRef.current || !imageElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    ctx.drawImage(imageElement, 0, 0);

    // Draw bounding boxes
    predictions.forEach((pred) => {
      if (pred.x && pred.y && pred.width && pred.height) {
        const x = pred.x - pred.width / 2;
        const y = pred.y - pred.height / 2;

        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, pred.width, pred.height);

        ctx.fillStyle = '#00ff00';
        ctx.font = '16px Arial';
        ctx.fillText(
          `${CLASS_LABELS[pred.class]} (${(pred.confidence * 100).toFixed(1)}%)`,
          x,
          y - 10
        );
      }
    });
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setUploadedImage(file);
      performDetection(file);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const performDetection = async (file) => {
    setIsAnalyzing(true);
    setResults([]);
    setPredictions([]);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(
        `${ROBOFLOW_API_URL}/${MODEL_ID}?api_key=${ROBOFLOW_API_KEY}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.predictions && data.predictions.length > 0) {
        setPredictions(data.predictions);
        const mappedResults = data.predictions.map((pred, idx) => ({
          id: idx,
          title: CLASS_LABELS[pred.class] || `Class ${pred.class}`,
          confidence: pred.confidence,
          rawClass: pred.class
        }));

        setResults(mappedResults);
        
        // Save results to session for desktop to access
        saveSessionResults(sessionId, {
          image: preview,
          results: mappedResults,
          predictions: data.predictions,
          timestamp: new Date().toISOString()
        });

        setShowResults(true);
      } else {
        setResults([]);
        setError('No objects detected in the image. Please try another image.');
      }
    } catch (err) {
      console.error('Detection error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Session Invalid State
  if (sessionValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Session Expired</h1>
          <p className="text-slate-300 mb-8">This QR code session is no longer valid. Please scan a new QR code from the upload page.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Loading State
  if (sessionValid === null) {
    return <Loader fullScreen />;
  }

  // Results View
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6 mt-4">
            <h1 className="text-2xl font-bold text-white text-center">📊 Detection Results</h1>
          </div>

          {/* Uploaded Image */}
          {preview && (
            <div className="mb-6 rounded-lg overflow-hidden bg-slate-800">
              <img
                src={preview}
                alt="Uploaded"
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Canvas for annotated image */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />

          {/* Results Cards */}
          {results.length > 0 ? (
            <div className="space-y-3 mb-6">
              {results.map((result) => (
                <DetectionCard
                  key={result.id}
                  title={result.title}
                  confidence={result.confidence}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-300">No objects detected</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setShowResults(false);
                setPreview(null);
                setResults([]);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              📸 Upload Another
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              🏠 Back to Home
            </button>
          </div>

          {/* Session Info */}
          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-400">
              Session: {sessionId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Upload View
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold text-white text-center">📱 Upload from Phone</h1>
          <p className="text-slate-400 text-center text-sm mt-2">Choose an image to detect safety equipment</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="mb-6 text-center">
            <Loader />
            <p className="text-slate-300 mt-4">Analyzing image...</p>
          </div>
        )}

        {/* Preview */}
        {preview && !isAnalyzing && (
          <div className="mb-6 rounded-lg overflow-hidden bg-slate-800">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Upload Buttons */}
        {!isAnalyzing && (
          <div className="space-y-3">
            <div>
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                📷 Take Photo
              </button>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                📂 Choose from Gallery
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          🏠 Back to Home
        </button>

        {/* Session Info */}
        <div className="mt-8 pt-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-400">
            Session: {sessionId}
          </p>
        </div>
      </div>
    </div>
  );
}
