import { Link } from 'react-router-dom';
import { APP_TITLE } from '../utils/constants';
import TextType from '../components/TextType';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center max-w-4xl animate-fade-in-up">
        <TextType 
          as="h1"
          text="DualityAI Detector"
          typingSpeed={80}
          pauseDuration={2000}
          deletingSpeed={50}
          loop={false}
          showCursor={false}
          cursorCharacter="|"
          cursorBlinkDuration={0.5}
          className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-cyan-300"
        />
        
        <TextType 
          as="p"
          text="Detect critical safety equipment in space environments using advanced AI. Ensure mission success with real-time orbital analysis."
          typingSpeed={30}
          pauseDuration={3000}
          deletingSpeed={15}
          loop={false}
          showCursor={false}
          cursorCharacter="|"
          cursorBlinkDuration={0.5}
          className="text-lg md:text-xl text-blue-100/80 max-w-2xl mb-10 leading-relaxed animate-fade-in-up animate-delay-100"
        />

        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animate-delay-200">
          <Link 
            to="/upload" 
            className="px-8 py-4 bg-cyan-500 text-[#04060d] font-bold rounded-xl hover:bg-cyan-400 transform hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            Start Detection
          </Link>
        </div>
      </section>

      {/* ScrollStack Section */}
      <div className="w-full mt-20">
        <ScrollStack useWindowScroll={true}>
          <ScrollStackItem>
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 h-full flex items-center justify-center rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-cyan-300 mb-4">Model Used</h3>
                <p className="text-white/80 text-lg">Advanced neural architecture optimized for space equipment detection</p>
              </div>
            </div>
          </ScrollStackItem>
          <ScrollStackItem>
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 h-full flex items-center justify-center rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-purple-300 mb-4">Data 1</h3>
                <p className="text-white/80 text-lg">Training dataset with critical safety equipment annotations</p>
              </div>
            </div>
          </ScrollStackItem>
          <ScrollStackItem>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 h-full flex items-center justify-center rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-blue-300 mb-4">Data 2</h3>
                <p className="text-white/80 text-lg">Validation dataset ensuring model robustness and accuracy</p>
              </div>
            </div>
          </ScrollStackItem>
          <ScrollStackItem>
            <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 h-full flex items-center justify-center rounded-2xl p-8">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-emerald-300 mb-4">Data 3</h3>
                <p className="text-white/80 text-lg">Test dataset simulating real-world orbital detection scenarios</p>
              </div>
            </div>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </div>
  );
}
