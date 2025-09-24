import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import Button from '../components/ui/button'
import Input from '../components/ui/input'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { useAuth } from '../lib/auth';

export function Login() {
  const [email, setEmail] = useState('farmer@agrilink.local');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setError('การเข้าสู่ระบบล้มเหลว กรุณาตรวจสอบอีเมลและรหัสผ่าน');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'farmer@agrilink.local', password: 'password123', role: 'FARMER', name: 'เกษตรกร' },
    { email: 'buyer@agrilink.local', password: 'password123', role: 'BUYER', name: 'ผู้ซื้อ' },
    { email: 'inspector@agrilink.local', password: 'password123', role: 'INSPECTOR', name: 'ผู้ตรวจสอบ' },
    { email: 'admin@agrilink.local', password: 'password123', role: 'ADMIN', name: 'ผู้ดูแลระบบ' }
  ]

  const loginAsDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-brand-600 hover:text-brand-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          กลับหน้าหลัก
        </Link>

        {/* Login Card */}
        <Card variant="elevated">
          <CardHeader>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-2xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">เข้าสู่ระบบ</h1>
                <p className="text-gray-600">AgriLink Smart Farm Marketplace</p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                label="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                placeholder="example@agrilink.local"
                required
              />

              <Input
                label="รหัสผ่าน"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 pointer-events-auto"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                placeholder="รหัสผ่าน"
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500" />
                  <span className="text-sm text-gray-600">จดจำการเข้าสู่ระบบ</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700">
                  ลืมรหัสผ่าน?
                </Link>
              </div>

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                size="lg"
              >
                เข้าสู่ระบบ
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ยังไม่มีบัญชี?{' '}
                <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium">
                  สมัครสมาชิก
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 text-center">
              บัญชีทดลองใช้งาน
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loginAsDemo(account.email, account.password)}
                  className="text-xs"
                >
                  {account.name}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              คลิกเพื่อใส่ข้อมูลอัตโนมัติ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Login