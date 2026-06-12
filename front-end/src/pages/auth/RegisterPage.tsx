import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { showToast } from '../../components/ui/Toast';
import { ROUTES } from '../../utils/constants';

export function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, fullName);
      showToast.success('Account created successfully!');
      navigate(ROUTES.HOME);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      showToast.error(message);
    }
  };

  return (
    <main className="flex-grow min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-container-lowest">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto px-gutter py-xl">
        {/* Logo */}
        <div className="text-center mb-xl">
          <Link
            to={ROUTES.HOME}
            className="inline-block text-[24px] font-bold tracking-tighter text-on-surface font-heading"
          >
            LUXE
          </Link>
          <h1 className="font-h3 text-h3 text-on-surface mt-md mb-sm">
            Create account
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Join LUXE and start shopping today
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-[0px_8px_40px_rgba(15,23,42,0.10)] p-xl">
          <form onSubmit={handleSubmit} className="space-y-md">
            {/* Full Name */}
            <div>
              <label
                htmlFor="reg-name"
                className="block font-label-md text-label-md text-on-surface mb-sm"
              >
                Full name
              </label>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none">
                  person
                </span>
                <input
                  id="reg-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="w-full h-[48px] bg-surface-container-low border border-outline-variant/50 rounded-xl pl-[44px] pr-md text-[15px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="reg-email"
                className="block font-label-md text-label-md text-on-surface mb-sm"
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none">
                  mail
                </span>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full h-[48px] bg-surface-container-low border border-outline-variant/50 rounded-xl pl-[44px] pr-md text-[15px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="reg-password"
                className="block font-label-md text-label-md text-on-surface mb-sm"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none">
                  lock
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full h-[48px] bg-surface-container-low border border-outline-variant/50 rounded-xl pl-[44px] pr-[48px] text-[15px] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <p className="font-caption text-caption text-on-surface-variant">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit-btn"
              disabled={isLoading}
              className="w-full h-[52px] bg-primary text-white rounded-xl font-label-md text-label-md font-semibold font-heading hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-[0px_4px_24px_rgba(0,74,198,0.28)] flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Creating account...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center mt-lg font-body-md text-body-md text-on-surface-variant">
          Already have an account?{' '}
          <Link
            to={ROUTES.LOGIN}
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}