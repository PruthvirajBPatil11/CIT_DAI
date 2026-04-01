import { Link } from 'react-router-dom';
import { APP_TITLE } from '../utils/constants';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center max-w-4xl animate-fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          <span className="bg-gradient-to-r from-cyan to-purple bg-clip-text text-transparent">
            {APP_TITLE}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mb-10 leading-relaxed animate-fade-in-up animate-delay-100">
          Detect critical safety equipment in space environments using advanced AI. 
          Ensure mission success with real-time orbital analysis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-200">
          <Link 
            to="/upload" 
            className="px-8 py-4 bg-cyan-500 text-[#04060d] font-bold rounded-xl hover:bg-cyan-400 transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            Start Detection
          </Link>
        </div>
      </section>

      {/* Mini Feature Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl animate-fade-in-up animate-delay-300">
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan/50 transition-colors group">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
          <h3 className="text-xl font-bold mb-2 text-cyan">Fast Detection</h3>
          <p className="text-sm text-blue-100/60">Sub-millisecond inference for critical orbital safety checks.</p>
        </div>
        
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple/50 transition-colors group">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
          <h3 className="text-xl font-bold mb-2 text-purple">High Accuracy</h3>
          <p className="text-sm text-blue-100/60">Advanced neural architectures optimized for 99.9% precision.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/50 transition-colors group">
          <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">🚀</div>
          <h3 className="text-xl font-bold mb-2 text-white">Space Ready</h3>
          <p className="text-sm text-blue-100/60">Validated against NASA standard safety equipment datasets.</p>
        </div>
      </section>
    </div>
  );
}
