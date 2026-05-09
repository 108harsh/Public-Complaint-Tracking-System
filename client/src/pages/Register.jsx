import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { ShieldCheck, Loader2, Check } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Valid phone number is required' }).optional().or(z.literal('')),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const passwordVal = watch('password', '');
  
  // Basic password strength calculation
  const getPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length > 7) strength += 25;
    if (pass.match(/[A-Z]/)) strength += 25;
    if (pass.match(/[0-9]/)) strength += 25;
    if (pass.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const strength = getPasswordStrength(passwordVal);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Left split - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link to="/" className="inline-flex items-center text-primary lg:hidden mb-6">
              <ShieldCheck className="w-8 h-8 mr-2" />
              <span className="font-bold text-xl">CivicResolve</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Already have an account? <Link to="/login" className="font-medium text-primary hover:text-indigo-500">Sign in instead</Link>
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              {...register('fullName')}
              error={errors.fullName?.message}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Phone number (Optional)"
              type="tel"
              placeholder="+1234567890"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
              {/* Password strength meter */}
              {passwordVal.length > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div className={`h-full transition-all duration-300 ${strength <= 25 ? 'bg-rose-500 w-1/4' : strength <= 50 ? 'bg-orange-500 w-2/4' : strength <= 75 ? 'bg-yellow-400 w-3/4' : 'bg-emerald-500 w-full'}`}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>{strength <= 25 && 'Weak'}{strength === 50 && 'Fair'}{strength === 75 && 'Good'}{strength === 100 && 'Strong'}</span>
                    {strength === 100 && <span className="text-emerald-500 flex items-center"><Check className="w-3 h-3 mr-1"/> secure</span>}
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-12 text-lg mt-6" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>

      {/* Right split - Illustration */}
      <div className="hidden lg:flex w-1/2 bg-emerald-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-500 opacity-90" />
        <div className="z-10 text-center text-white px-12">
          <ShieldCheck className="w-24 h-24 mx-auto mb-8 text-emerald-200" />
          <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
          <p className="text-lg text-emerald-100">Every report makes a difference. Sign up to start making your city a better place.</p>
        </div>
        {/* Placeholder SVG Decorative */}
         <svg className="absolute top-0 left-0 right-0 text-emerald-900 opacity-20 transform rotate-180" viewBox="0 0 1440 320">
          <path fill="currentColor" d="M0,224L80,197.3C160,171,320,117,480,117.3C640,117,800,171,960,192C1120,213,1280,203,1360,197.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      
    </div>
  );
}
