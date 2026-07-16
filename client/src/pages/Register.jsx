import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Create your TripVault account</h2>
      <p>Begin your journey with a secure, elegant travel planner.</p>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input
          placeholder="Username (e.g. lokesh_waran)"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })}
          required
        />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button type="submit">Register</button>
      </form>
      {message && <p className="message error">{message}</p>}
      <p className="switch-link">Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Register;
