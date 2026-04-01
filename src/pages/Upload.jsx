import { useState } from 'react';
import UploadBox from '../components/UploadBox';
import DetectionCard from '../components/DetectionCard';

export default function Upload() {
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      simulateDetection();
    };
    reader.readAsDataURL(file);
  };

  const simulateDetection = () => {
    setIsAnalyzing(true);
    setResults([]);
    
    // Simulate processing time
    setTimeout(() => {
      setResults([
        { id: 1, title: 'Bio-hazard Shield', confidence: 0.98 },
        { id: 2, title: 'Oxidation Ventilator', confidence: 0.85 },
        { id: 3, title: 'Thermal Regulators', confidence: 0.92 }
      ]);
      setIsAnalyzing(false);
    }, 1500);
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

      {preview && (
        <div className="flex flex-col gap-12 animate-fade-in-up">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-semibold text-white/90">Scan Preview</h2>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/40">
                <img 
                  src={preview} 
                  alt="Scan preview" 
                  className="max-h-[500px] w-auto object-contain" 
                />
              </div>
            </div>
            <button 
              onClick={() => { setPreview(null); setResults([]); }}
              className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"
            >
              Clear Scan
            </button>
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
            ) : !isAnalyzing && preview ? (
              <p className="text-center text-gray-500 py-10">Analysis complete. Check the report markers above.</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
