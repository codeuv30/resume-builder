import { ReactNode } from 'react';
import { Code2, Sparkles, Zap, Shield } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-950 p-12 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Top Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">DevResume AI</span>
        </div>

        {/* Middle Section - Features */}
        <div className="relative z-10 space-y-8 max-w-md">
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Build your developer resume with{' '}
              <span className="text-emerald-400">AI-powered</span> precision
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Generate ATS-optimized resumes tailored for tech roles. From skills to projects, let AI craft the perfect narrative for your career.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Sparkles, text: 'AI-generated skill descriptions' },
              { icon: Zap, text: 'Smart project bullet points' },
              { icon: Shield, text: 'ATS-friendly formatting' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <feature.icon className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="relative z-10">
          <p className="text-sm text-slate-500">
            Trusted by 10,000+ developers worldwide
          </p>
        </div>

        {/* Decorative Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-col items-center justify-center p-6 md:p-10 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}