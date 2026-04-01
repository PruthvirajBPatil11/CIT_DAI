export default function About() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[90vh] text-center px-4 py-12">
      {/* About Section */}
      <section className="max-w-3xl animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
          <span className="text-cyan-300">About DualityAI</span>
        </h1>

        <div className="card mb-8">
          <h2>Our Mission</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            DualityAI is dedicated to revolutionizing safety equipment detection in space environments. 
            We leverage cutting-edge artificial intelligence to provide real-time orbital analysis and ensure mission-critical safety compliance.
          </p>
        </div>

        <div className="card mb-8">
          <h2>Technology</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            Our advanced neural network architectures are specifically trained on NASA standard safety equipment datasets. 
            With sub-millisecond inference speeds and 99.9% accuracy, we deliver reliable detection when it matters most.
          </p>
        </div>

        <div className="card mb-8">
          <h2>Vision</h2>
          <p className="text-gray-300 mb-4 leading-relaxed">
            We envision a future where AI-powered safety systems are seamlessly integrated into every space mission, 
            ensuring astronaut safety and mission success through intelligent, automated detection and analysis.
          </p>
        </div>

        <div className="card">
          <h2>Why Choose Us</h2>
          <div className="text-left text-gray-300 space-y-3">
            <p>✓ Advanced neural architectures optimized for precision</p>
            <p>✓ Validated against NASA standard safety equipment datasets</p>
            <p>✓ Sub-millisecond inference for critical orbital safety checks</p>
            <p>✓ Designed for reliability in extreme space environments</p>
          </div>
        </div>
      </section>
    </div>
  );
}
