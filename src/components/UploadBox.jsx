export default function UploadBox({ onUpload }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <section className="card upload-box max-w-xl mx-auto">
      <h2>Analyze New Image</h2>
      <p className="text-gray-400 mb-6 font-light">Drag and drop or select an orbital scan to begin safety detection.</p>
      <label className="upload-area group" htmlFor="image-upload">
        <input id="image-upload" type="file" accept="image/*" onChange={handleChange} />
        <div className="flex flex-col items-center gap-3">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">📁</span>
          <span className="px-6 py-2 bg-white/10 rounded-lg text-sm font-medium border border-white/10 group-hover:bg-white/20 transition-all">
            Select Orbital Scan
          </span>
        </div>
      </label>
    </section>
  );
}
