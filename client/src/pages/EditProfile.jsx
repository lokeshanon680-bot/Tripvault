import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

function EditProfile() {
  const [form, setForm] = useState({ name: '', username: '', bio: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/auth/me');
        const { name, username, bio } = res.data.user;
        setForm({ name, username, bio: bio || '' });
      } catch (err) {
        navigate('/login');
      }
    };
    load();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await api.put('/users/profile', form);
      setMessage('Profile updated!');
      navigate(`/profile/${res.data.user.username}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase() })} required />
        <textarea placeholder="Bio (tell travellers about yourself)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={300} />
        <button type="submit">Save Changes</button>
      </form>
      {message && <p className="message">{message}</p>}
      <p className="switch-link"><Link to="/dashboard">Back to Dashboard</Link></p>
    </div>
  );
}

export default EditProfile;
