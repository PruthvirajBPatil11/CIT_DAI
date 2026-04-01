export default function DetectionCard({ title, confidence }) {
  const percentage = (confidence * 100).toFixed(1);
  
  return (
    <article className="card detection-card flex flex-col gap-3 group translate-y-0 hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
        <span className="text-xs font-bold px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md border border-cyan-500/20">
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </article>
  );
}
