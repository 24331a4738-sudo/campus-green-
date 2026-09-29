import React, { useState } from 'react';
import { Role, UserProfile } from '../types';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Lock,
  Mail,
  User,
  GraduationCap,
  School,
  Wrench,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  KeyRound,
  CheckCircle2,
  Building,
} from 'lucide-react';

interface AuthViewProps {
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  existingUsers: Record<string, UserProfile>;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onRegister,
  existingUsers,
}) => {
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('student@campus.edu');
  const [loginPassword, setLoginPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<Role>('STUDENT');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regDeptCode, setRegDeptCode] = useState('CSE');

  // Handle Demo One-Click Fill
  const selectDemoAccount = (roleKey: string) => {
    sounds.playClick();
    const demoUser = existingUsers[roleKey];
    if (demoUser) {
      setLoginEmail(demoUser.email);
      setLoginPassword('Password123!');
      setLoginError(null);
    }
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    sounds.playClick();

    setTimeout(() => {
      setIsLoading(false);
      // Find user by email
      const matched = Object.values(existingUsers).find(
        (u) => u.email.toLowerCase() === loginEmail.trim().toLowerCase()
      );

      if (!matched) {
        setLoginError('No university account found with this email. Try selecting a demo profile below or register.');
        return;
      }

      // Password verification (for seed accounts Password123! or custom password)
      if (loginPassword !== 'Password123!' && matched.password && loginPassword !== matched.password) {
        setLoginError('Incorrect password. Default password for seed accounts is Password123!');
        return;
      }

      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#f59e0b'],
      });
      onLogin(matched);
    }, 500);
  };

  // Submit Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setLoginError('Please complete all required fields.');
      return;
    }

    // Check if email already registered
    const exists = Object.values(existingUsers).some(
      (u) => u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );
    if (exists) {
      setLoginError('An account is already registered with this university email.');
      return;
    }

    sounds.playPointsChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#10b981', '#34d399', '#a855f7', '#fbbf24'],
    });

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role: regRole,
      department: regDepartment,
      departmentCode: regDeptCode,
      points: 100, // Welcome registration bonus!
      lifetimePoints: 100,
      streak: 1,
      level: {
        id: 1,
        title: 'Eco Starter',
        minPoints: 0,
        nextLevelPoints: 500,
      },
      badges: [
        {
          id: 'badge-1',
          slug: 'eco-starter',
          name: 'Eco Starter',
          description: 'Joined the platform and took your first verified campus green action.',
          icon: '🌱',
          earnedAt: 'Today',
        },
      ],
    };

    onRegister(newUser);
  };

  return (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white select-none overflow-y-auto">
      {/* Brand Hero */}
      <div className="text-center pt-2 sm:pt-4">
        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center border border-white/20 shadow-2xl mb-2 text-2xl">
          🌱
        </div>
        <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">
          CAMPUS GREEN PORTAL
        </span>
        <h1 className="text-2xl font-black mt-1 tracking-tight">University Sign In</h1>
        <p className="text-[11px] text-emerald-200/80 max-w-[260px] mx-auto font-medium">
          Access your student, faculty, or staff sustainability dashboard
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-2xl my-auto">
        {/* Toggle Mode Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-black/40 rounded-2xl mb-4 border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setMode('LOGIN');
              setLoginError(null);
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'LOGIN'
                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setMode('REGISTER');
              setLoginError(null);
            }}
            className={`py-2 rounded-xl transition ${
              mode === 'REGISTER'
                ? 'bg-emerald-500 text-slate-950 font-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {loginError && (
          <div className="bg-rose-950/80 border border-rose-600/60 p-2.5 rounded-xl text-rose-200 text-xs mb-3 flex items-start gap-2">
            <span className="text-sm">⚠️</span>
            <span className="leading-tight">{loginError}</span>
          </div>
        )}

        {mode === 'LOGIN' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1 mb-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <span>University Email</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@campus.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] uppercase font-extrabold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Password</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setLoginError('Demo seed accounts use Password123! — click any demo profile below to auto-fill.')
                  }
                  className="text-[10px] text-emerald-400 hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white pr-9 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span>Stay signed in</span>
              </label>
              <span className="text-[10px] text-emerald-400">SSL 256-bit</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-2.5 rounded-2xl shadow-xl transition active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{isLoading ? 'Verifying...' : 'SIGN IN TO CAMPUS GREEN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-3 border-t border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-400 text-center mb-2">
                ⚡ Quick 1-Click Demo Accounts:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => selectDemoAccount('STUDENT')}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-left flex items-center gap-1.5 transition"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-200 block truncate">Alex (Student)</span>
                    <span className="text-[9px] text-slate-500 block truncate">student@campus.edu</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('FACULTY')}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-left flex items-center gap-1.5 transition"
                >
                  <School className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-200 block truncate">Dr. Sharma (Faculty)</span>
                    <span className="text-[9px] text-slate-500 block truncate">faculty@campus.edu</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('STAFF')}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-left flex items-center gap-1.5 transition"
                >
                  <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-200 block truncate">Marcus (Facilities)</span>
                    <span className="text-[9px] text-slate-500 block truncate">staff@campus.edu</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => selectDemoAccount('ADMIN')}
                  className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-[11px] text-left flex items-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <div className="truncate">
                    <span className="font-bold text-slate-200 block truncate">Admin (System)</span>
                    <span className="text-[9px] text-slate-500 block truncate">admin@campus.edu</span>
                  </div>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5 text-xs">
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-2 rounded-xl text-center flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Includes +100 Welcome Eco-Points Bonus!</span>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g., Jordan Hayes"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Campus Email Address
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="jhayes@campus.edu"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Stakeholder Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as Role)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-white"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty Member</option>
                  <option value="STAFF">Facilities Staff</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Department
                </label>
                <select
                  value={regDeptCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setRegDeptCode(code);
                    const map: Record<string, string> = {
                      CSE: 'Computer Science & Engineering',
                      ENV: 'Environmental Studies',
                      FAC: 'Campus Facilities & Ops',
                      BIO: 'Biological Sciences',
                      BUS: 'School of Business',
                    };
                    setRegDepartment(map[code] || 'General Studies');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-1.5 text-white"
                >
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ENV">Environmental Studies (ENV)</option>
                  <option value="FAC">Facilities & Ops (FAC)</option>
                  <option value="BIO">Biological Sciences (BIO)</option>
                  <option value="BUS">Business & Mgmt (BUS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Create Password
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black py-2.5 rounded-2xl shadow-xl transition active:scale-95 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              <span>CREATE ACCOUNT & CLAIM +100 PTS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* University SSO EduPass Simulator */}
      <div className="text-center pt-2 pb-1">
        <button
          type="button"
          onClick={() => {
            sounds.playSuccess();
            onLogin(existingUsers.STUDENT);
          }}
          className="text-xs text-slate-400 hover:text-emerald-300 transition flex items-center justify-center gap-1.5 mx-auto"
        >
          <Building className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sign In with Campus Single Sign-On (EduPass SSO)</span>
        </button>
      </div>
    </div>
  );
};
