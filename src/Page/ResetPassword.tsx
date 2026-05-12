import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AuthService } from '../services/authService';

const HUCLogo = '/assets/HUC_logo.jpeg';

const ResetPassword: React.FC = () => {
  const { i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({ new_password: '', confirm_password: '' });
  const [errors, setErrors] = useState({ api: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const isRTL = i18n.resolvedLanguage?.startsWith('ar') || i18n.language?.startsWith('ar');
  const tr = (ar: string, en: string) => (isRTL ? ar : en);

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setErrors({ api: tr('رابط غير صالح أو منتهي الصلاحية', 'Invalid or expired link') });
    }
  }, [isRTL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ api: '' });
    setSuccessMessage('');

    if (!token) {
      setErrors({ api: tr('رابط غير صالح أو منتهي الصلاحية', 'Invalid or expired link') });
      return;
    }

    if (!formData.new_password || !formData.confirm_password) {
      setErrors({ api: tr('جميع الحقول مطلوبة', 'All fields are required') });
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setErrors({ api: tr('كلمتا المرور غير متطابقتين', 'Passwords do not match') });
      return;
    }

    if (formData.new_password.length < 6) {
      setErrors({ api: tr('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'Password must be at least 6 characters') });
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.resetPassword({
        token,
        new_password: formData.new_password,
      });

      if (response.success) {
        setSuccessMessage(tr('تمت إعادة تعيين كلمة المرور بنجاح. سيتم توجيهك لتسجيل الدخول...', 'Password reset successfully. Redirecting to login...'));
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : tr('فشل إعادة تعيين كلمة المرور. قد يكون الرابط منتهي الصلاحية.', 'Failed to reset password. The link might be expired.');
      setErrors({ api: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen w-full flex items-center justify-center bg-gray-50 font-['Cairo'] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center flex flex-col items-center mb-8">
            <img src={HUCLogo} alt="HUC Logo" className="w-20 h-20 object-contain mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{tr('إعادة تعيين كلمة المرور', 'Reset Password')}</h1>
            <p className="text-gray-500 text-sm">{tr('أدخل كلمة المرور الجديدة', 'Enter your new password')}</p>
          </div>

          {successMessage ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.api && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">{errors.api}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr('كلمة المرور الجديدة', 'New Password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    className="w-full text-left border border-gray-200 rounded-xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tr('تأكيد كلمة المرور', 'Confirm Password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    className="w-full text-left border border-gray-200 rounded-xl py-3 pr-10 pl-10 focus:outline-none focus:ring-2 focus:ring-[#2596be] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full bg-[#2596be] hover:bg-[#1e7e9e] disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex justify-center items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {tr('جاري التحميل...', 'Loading...')}
                  </>
                ) : (
                  tr('إعادة تعيين', 'Reset Password')
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <a href="/" className="text-[#2596be] hover:underline text-sm font-medium">
              {tr('العودة لتسجيل الدخول', 'Back to Login')}
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
