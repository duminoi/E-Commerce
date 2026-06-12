import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { showToast } from '../../components/ui/Toast';
import { ROUTES } from '../../utils/constants';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      showToast.success('Đăng nhập thành công');
      navigate(ROUTES.HOME);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      showToast.error(message);
    }
  };

  return (
    <main className="flex-grow min-h-screen flex items-center justify-center relative overflow-hidden bg-surface-container-lowest">
      {/* Background decoration */}
      <div className="absolute inset-0 hero-pattern opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-[440px] mx-auto px-gutter">
        {/* Logo */}
        <div className="text-center mb-xl">
          <Link
            to={ROUTES.HOME}
            className="inline-block text-[24px] font-bold tracking-tighter text-on-surface font-heading"
          >
            LUXE
          </Link>
          <h1 className="font-h3 text-h3 text-on-surface mt-md mb-sm">
            Welcome back
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 shadow-[0px_8px_40px_rgba(15,23,42,0.10)] p-xl">
          <form onSubmit={handleSubmit} className="space-y-lg">
            {/* Email field */}
            <div>
              <label
                htmlFor="login-email"
                className="block font-label-md text-label-md text-on-surface mb-sm"
              >
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none">
                  mail
                </span>
                <input
                  id="login-email"
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

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-sm">
                <label
                  htmlFor="login-password"
                  className="block font-label-md text-label-md text-on-surface"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="font-caption text-caption text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <span className="absolute left-[14px] top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-on-surface-variant pointer-events-none">
                  lock
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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

            {/* Submit button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full h-[52px] bg-primary text-white rounded-xl font-label-md text-label-md font-semibold font-heading hover:bg-primary/90 transition-all duration-200 active:scale-[0.98] shadow-[0px_4px_24px_rgba(0,74,198,0.28)] flex items-center justify-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed mt-sm"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  Signing in...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-md my-lg">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="font-caption text-caption text-on-surface-variant px-[4px]">
              or
            </span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* Social login placeholder */}
          <button
            type="button"
            className="w-full h-[48px] bg-surface-container-low border border-outline-variant/50 rounded-xl font-body-md text-body-md font-medium text-on-surface hover:bg-surface-container hover:border-outline-variant transition-all flex items-center justify-center gap-[10px]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Register link */}
        <p className="text-center mt-lg font-body-md text-body-md text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-primary font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}