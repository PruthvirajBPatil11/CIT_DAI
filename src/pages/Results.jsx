import DetectionCard from '../components/DetectionCard';

export default function Results() {
  return (
    <section className="results-grid">
      <DetectionCard title="Object: Drone" confidence={0.973} />
      <DetectionCard title="Object: Vehicle" confidence={0.928} />
    </section>
  );
}
