import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { csrf } from '../lib/axios'; // adjust the path if needed
import InputLayout from '../components/taskcomponents/input';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '', // for confirmed rule
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await csrf(); // get CSRF token
      await axios.post('/register', form);
      navigate('/home'); // ✅ redirect on success
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        Create your TaskManager account
      </h2>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputLayout label="Full Name" name="name" type="text" value={form.name} onChange={handleChange} error={errors.name?.[0]} required/>

          <InputLayout label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} required/>

          <InputLayout label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password?.[0]} required/>

          <InputLayout label="Confirm Password" name="password_confirmation" type="password" value={form.password_confirmation} onChange={handleChange} required/>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
