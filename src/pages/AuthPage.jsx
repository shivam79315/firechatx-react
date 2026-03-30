import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import BackgroundOrbs from '../components/BackgroundOrbs';
import { Mail, Lock, User, Eye, EyeOff, Loader2, MessageCircle } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { login, register, loginWithGoogle } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <BackgroundOrbs />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 md:p-10">
          {/* Logo & Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #0054D1 0%, #3B8BF5 100%)' }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {isLogin ? 'Sign in to continue chatting' : 'Join our chat community'}
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex p-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            {['Login', 'Register'].map((tab, idx) => (
              <motion.button
                key={tab}
                data-testid={`auth-tab-${tab.toLowerCase()}`}
                onClick={() => {
                  setIsLogin(idx === 0);
                  setError('');
                }}
                className="flex-1 py-2.5 px-4 rounded-full text-sm font-medium transition-all"
                style={{
                  background: (isLogin && idx === 0) || (!isLogin && idx === 1) 
                    ? 'var(--primary-action)' 
                    : 'transparent',
                  color: (isLogin && idx === 0) || (!isLogin && idx === 1) 
                    ? 'white' 
                    : 'var(--text-secondary)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="relative"
                    variants={inputVariants}
                    whileFocus="focus"
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      type="text"
                      name="name"
                      data-testid="auth-name-input"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none"
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div 
              className="relative"
              variants={inputVariants}
              whileFocus="focus"
            >
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="email"
                name="email"
                data-testid="auth-email-input"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="glass-input w-full pl-12 pr-4 py-3.5 rounded-xl focus:outline-none"
                required
              />
            </motion.div>

            <motion.div 
              className="relative"
              variants={inputVariants}
              whileFocus="focus"
            >
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                data-testid="auth-password-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="glass-input w-full pl-12 pr-12 py-3.5 rounded-xl focus:outline-none"
                required
              />
              <button
                type="button"
                data-testid="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-lg text-sm text-red-400"
                  style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                  data-testid="auth-error-message"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              data-testid="auth-submit-button"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          </div>

          {/* Google Login */}
          <motion.button
            type="button"
            data-testid="google-login-button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 glass-input"
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span style={{ color: 'var(--text-primary)' }}>Continue with Google</span>
          </motion.button>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AuthPage;
