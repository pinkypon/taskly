import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { csrf } from '../lib/axios';
import InputLayout from '../components/taskcomponents/input';
import { useAuth } from '../context/AuthContext'; // ✅ Make sure the path is correct

export default function Login() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth(); // ✅ renamed refreshUser to match your context

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await csrf(); // ✅ Make sure this sets the CSRF token cookie
      await axios.post('/login', form); // ✅ Sends login request
      await fetchUser(); // ✅ Refresh the auth context
      navigate('/home'); // ✅ Redirect after login
    } catch (err: any) {
      const res = err.response;

      if (res?.status === 422 && res.data?.errors) {
        // ✅ Get the first validation error message
        const firstKey = Object.keys(res.data.errors)[0];
        const firstMessage = res.data.errors[firstKey][0];
        setError(firstMessage);
      } else if (res?.status === 401 && res.data?.message) {
        // ✅ Show auth failure message
        setError(res.data.message); // e.g. "Invalid login credentials"
      } else {
        setError('Login failed. Please try again.');
      }

      console.error('Login error:', res?.data || err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        Login to TaskManager
      </h2>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputLayout
            type="email"
            name="email"
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />

          <InputLayout
            type="password"
            name="password"
            label="Password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
