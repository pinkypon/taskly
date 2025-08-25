import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios, { csrf } from '../lib/axios';

export default function Register() {
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setIsVisible(true), 100);

        // Mouse movement handler
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);
        setErrors({});

        try {
            await csrf();
            await axios.post('/register', form);
            await fetchUser();
            navigate('/home');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="via-indigo-80/60 to-blue-80/60 min-h-screen overflow-hidden bg-gradient-to-br from-slate-200">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
                {/* Dynamic gradient orbs */}
                <div
                    className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-indigo-400/10 via-indigo-500/8 to-blue-500/10 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
                    }}
                ></div>
                <div
                    className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-pulse rounded-full bg-gradient-to-br from-blue-400/10 via-indigo-500/8 to-indigo-600/10 blur-3xl"
                    style={{
                        transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
                    }}
                ></div>

                {/* Additional floating elements */}
                <div className="absolute top-20 right-20 h-4 w-4 animate-bounce rounded-full bg-indigo-300/20" style={{ animationDelay: '1s' }}></div>
                <div
                    className="absolute bottom-32 left-20 h-6 w-6 animate-bounce rounded-full bg-indigo-400/20"
                    style={{ animationDelay: '3s' }}
                ></div>
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <div
                    className={`w-full max-w-md transform transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}
                >
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-6 flex items-center justify-center gap-3">
                            <h1 className="text-4xl font-black text-indigo-900 md:text-4xl">Taskly</h1>
                            <img
                                src="/images/task-logo.png"
                                alt="Logo"
                                className="h-12 w-12 md:h-12 md:w-12"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                        <p className="text-lg text-gray-600 md:text-xl">Start your journey to better productivity</p>
                    </div>

                    {/* Form Container */}
                    <div className="w-full">
                        <div className="group relative rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl">
                            {/* Gradient border effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

                            <div className="relative z-10">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <User className="h-4 w-4 text-indigo-600" />
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                                                    errors.name
                                                        ? 'border-red-300 bg-red-50/50'
                                                        : 'border-gray-200 bg-white/50 focus:border-indigo-400 focus:bg-white'
                                                }`}
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="flex items-center gap-1 text-sm text-red-600">
                                                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                                                {errors.name[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Mail className="h-4 w-4 text-indigo-600" />
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                className={`w-full rounded-xl border-2 px-4 py-3 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                                                    errors.email
                                                        ? 'border-red-300 bg-red-50/50'
                                                        : 'border-gray-200 bg-white/50 focus:border-indigo-400 focus:bg-white'
                                                }`}
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="flex items-center gap-1 text-sm text-red-600">
                                                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                                                {errors.email[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Lock className="h-4 w-4 text-indigo-600" />
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={form.password}
                                                onChange={handleChange}
                                                className={`w-full rounded-xl border-2 px-4 py-3 pr-12 transition-all duration-300 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
                                                    errors.password
                                                        ? 'border-red-300 bg-red-50/50'
                                                        : 'border-gray-200 bg-white/50 focus:border-indigo-400 focus:bg-white'
                                                }`}
                                                placeholder="Create a strong password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="flex items-center gap-1 text-sm text-red-600">
                                                <span className="h-1 w-1 rounded-full bg-red-600"></span>
                                                {errors.password[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Lock className="h-4 w-4 text-indigo-600" />
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={form.password_confirmation}
                                                onChange={handleChange}
                                                className="w-full rounded-xl border-2 border-gray-200 bg-white/50 px-4 py-3 pr-12 transition-all duration-300 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-indigo-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                        <span className="relative flex items-center justify-center">
                                            {submitting ? (
                                                <>
                                                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    Create Account
                                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>

                                {/* Login Link */}
                                <div className="mt-8 text-center">
                                    <p className="text-gray-600">
                                        Already have an account?{' '}
                                        <Link
                                            to="/login"
                                            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-700 hover:underline"
                                        >
                                            Sign in here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back to Landing */}
                    <div className="mt-6 text-center">
                        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-indigo-600">
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
