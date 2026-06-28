interface Props {
  icon: string;
  value: string | number;
  label: string;
}

export default function StatCard({ icon, value, label }: Props) {
  return (
    <div className="bg-bg-card rounded-xl p-4 border border-border text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-lg font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-muted">{label}</div>
    </div>
  );
}
