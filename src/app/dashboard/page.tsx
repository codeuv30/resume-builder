import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | DevResume AI',
};

export default function DashboardPage() {
  return (
    <div className="min-h-svh flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome to your DevResume AI dashboard!</p>
        <p className="text-sm text-slate-400">
          Resume builder flow coming next...
        </p>
      </div>
    </div>
  );
}