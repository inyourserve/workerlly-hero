import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { register, verifyRegistration, login, verifyLogin } from '../api/auth';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type AuthMode = 'register' | 'login' | 'verifyRegister' | 'verifyLogin';

export default function AdminAuth() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    mobile: '',
    name: '',
    otp: '',
  });

  const registerMutation = useMutation(register);
  const verifyRegisterMutation = useMutation(verifyRegistration);
  const loginMutation = useMutation(login);
  const verifyLoginMutation = useMutation(verifyLogin);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'register') {
        await registerMutation.mutateAsync(formData);
        setMode('verifyRegister');
      } else if (mode === 'verifyRegister') {
        await verifyRegisterMutation.mutateAsync({ mobile: formData.mobile, otp: formData.otp });
        setMode('login');
      } else if (mode === 'login') {
        await loginMutation.mutateAsync({ email: formData.email, password: formData.password });
        setMode('verifyLogin');
      } else if (mode === 'verifyLogin') {
        const result = await verifyLoginMutation.mutateAsync({ email: formData.email, otp: formData.otp });
        // Handle successful login (e.g., store token, redirect)
        console.log('Login successful', result);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{mode === 'login' || mode === 'verifyLogin' ? 'Login' : 'Register'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'register' || mode === 'login') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          {mode === 'register' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}
          {(mode === 'verifyRegister' || mode === 'verifyLogin') && (
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                required
                value={formData.otp}
                onChange={handleInputChange}
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {mode === 'register' ? 'Register' : mode === 'login' ? 'Login' : 'Verify'}
          </Button>
        </form>
        {mode === 'login' && (
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Button variant="link" onClick={() => setMode('register')}>
              Register
            </Button>
          </p>
        )}
        {mode === 'register' && (
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Button variant="link" onClick={() => setMode('login')}>
              Login
            </Button>
          </p>
        )}
      </CardContent>
    </Card>
  );
}

