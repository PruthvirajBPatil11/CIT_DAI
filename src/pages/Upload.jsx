import { useState, useRef, useEffect } from 'react';
import UploadBox from '../components/UploadBox';
import DetectionCard from '../components/DetectionCard';

// Safety Equipment Class Labels
const CLASS_LABELS = {
  0: 'Oxygen Tank',
  1: 'Nitrogen Tank',
  2: 'First Aid Box',
  3: 'Fire Alarm',
  4: 'Safety Switch Panel',
  5: 'Emergency Phone',
  6: 'Fire Extinguisher'
};

// Roboflow API Configuration
const ROBOFLOW_API_KEY = 'r5DwvZgX7t9X3zmkaaY4';
const MODEL_ID = 'my-first-project-qvd8s/2';
const ROBOFLOW_API_URL = 'https://serverless.roboflow.com';

export default function Upload() {
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  // Redraw when predictions change
  useEffect(() => {
    if (predictions.length > 0 && preview && canvasRef.current) {
      drawDetections(predictions);
    }
  }, [predictions, preview]);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      performDetection(file);
    };
    reader.readAsDataURL(file);
  };

  const performDetection = async (file) => {
    setIsAnalyzing(true);
    setResults([]);
    setPredictions([]);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending detection request...');
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
      console.log('API Response:', data);

      // Map predictions to results format
      if (data.predictions && data.predictions.length > 0) {
        console.log('Predictions found:', data.predictions.length);
        setPredictions(data.predictions);
        const mappedResults = data.predictions.map((pred, idx) => ({
          id: idx,
          title: CLASS_LABELS[pred.class] || `Class ${pred.class}`,
          confidence: pred.confidence,
          rawClass: pred.class
        }));
        setResults(mappedResults);
      } else {
        console.log('No predictions found');
        setResults([]);
        setPredictions([]);
      }
    } catch (err) {
      console.error('Detection error:', err);
      setError(`Detection failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const drawDetections = (detections) => {
    if (!canvasRef.current || !preview) {
      console.log('Canvas or preview not ready');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      console.log('Image loaded, drawing to canvas');
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Draw bounding boxes and labels
      detections.forEach((pred) => {
        const { x, y, width, height, confidence, class: classVal } = pred;

        // Define colors
        const colors = ['#00ff00', '#00ffff', '#ff00ff', '#ffff00', '#ff6600', '#00ff66', '#ff0066'];
        const color = colors[classVal % colors.length];

        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(
          x - width / 2,
          y - height / 2,
          width,
          height
        );

        // Draw label background
        const label = CLASS_LABELS[classVal] || `Class ${classVal}`;
        const text = `${label} ${(confidence * 100).toFixed(1)}%`;
        
        ctx.font = 'bold 16px Arial';
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;
        const textHeight = 24;

        // Label background
        ctx.fillStyle = color;
        ctx.fillRect(
          x - width / 2,
          y - height / 2 - textHeight - 4,
          textWidth + 8,
          textHeight
        );

        // Label text
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(text, x - width / 2 + 4, y - height / 2 - 8);
      });
      console.log('Drawing complete');
    };

    img.onerror = () => {
      console.error('Failed to load image');
    };

    img.src = preview;
  };

  return (
    <div className="flex flex-col gap-10 max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <section className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Orbital Detection Hub
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Upload a high-resolution orbital scan to identify critical safety equipment and ship integrity markers.
        </p>
      </section>

      <UploadBox onUpload={handleUpload} />

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {preview && (
        <div className="flex flex-col gap-12 animate-fade-in-up">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold text-white/90">Detection Analysis</h2>
            <div className="relative group w-full flex justify-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40 flex justify-center p-4">
                {predictions.length > 0 ? (
                  <canvas
                    ref={canvasRef}
                    style={{
                      maxHeight: '600px',
                      maxWidth: '100%',
                      height: 'auto',
                      width: 'auto',
                      display: 'block'
                    }}
                    className="rounded-xl"
                  />
                ) : (
                  <img
                    src={preview}
                    alt="Original image"
                    style={{
                      maxHeight: '600px',
                      maxWidth: '100%',
                      height: 'auto',
                      width: 'auto'
                    }}
                    className="rounded-xl"
                  />
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => { setPreview(null); setResults([]); setPredictions([]); setError(null); }}
                className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
              >
                Clear Scan
              </button>
              {results.length > 0 && (
                <button 
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) {
                      const link = document.createElement('a');
                      link.href = canvas.toDataURL('image/png');
                      link.download = 'detection-result.png';
                      link.click();
                    }
                  }}
                  className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm hover:bg-cyan-500/30 transition-colors text-cyan-400"
                >
                  ⬇️ Download Result
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-semibold text-white/90">Intelligence Report</h2>
              {isAnalyzing && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium uppercase tracking-widest">Processing...</span>
                </div>
              )}
            </div>

            {!isAnalyzing && results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((res) => (
                  <DetectionCard 
                    key={res.id} 
                    title={res.title} 
                    confidence={res.confidence} 
                  />
                ))}
              </div>
            ) : !isAnalyzing && preview && !error ? (
              <p className="text-center text-gray-500 py-10">Analysis complete. Check the report markers above.</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
