import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const emptyForm = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  description: '',
  rating: '',
};

function Dashboard() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data || []);
    } catch (error) {
      console.error(error);
      setTrips([]);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        await fetchTrips();
      } catch (error) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const uploadPhotoForTrip = async (tripId) => {
    if (!imageFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      await api.post(`/trips/${tripId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Photo upload failed');
    } finally {
      setUploading(false);
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        rating: form.rating === '' ? undefined : Number(form.rating),
      };

      let tripId = editingId;

      if (editingId) {
        await api.put(`/trips/${editingId}`, payload);
      } else {
        const res = await api.post('/trips', payload);
        tripId = res.data._id;
      }

      if (imageFile && tripId) {
        await uploadPhotoForTrip(tripId);
      }

      setForm(emptyForm);
      setEditingId(null);
      setImageFile(null);
      await fetchTrips();
    } catch (error) {
      alert(error.response?.data?.message || 'Trip action failed');
    }
  };

  const handleEdit = (trip) => {
    setEditingId(trip._id);
    setForm({
      title: trip.title || '',
      destination: trip.destination || '',
      startDate: trip.startDate ? trip.startDate.slice(0, 10) : '',
      endDate: trip.endDate ? trip.endDate.slice(0, 10) : '',
      description: trip.description || '',
      rating: trip.rating || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/trips/${id}`);
      await fetchTrips();
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="dashboard">
      {user ? (
        <>
          <div className="dashboard-header">
            <div>
              <h1>Welcome, {user.name}</h1>
              <p>@{user.username}</p>
            </div>
            <div className="header-actions">
              <Link to={`/profile/${user.username}`} className="btn-link">My Profile</Link>
              <Link to="/profile/edit" className="btn-link">Edit Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <form className="trip-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Trip' : 'Create Trip'}</h2>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input placeholder="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input type="number" min="1" max="5" placeholder="Rating" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />

            <label className="file-label">
              Trip Photo
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </label>
            {imageFile && <p className="file-hint">Selected: {imageFile.name}</p>}

            <button type="submit" disabled={uploading}>
              {uploading ? 'Uploading photo...' : editingId ? 'Update Trip' : 'Add Trip'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); setImageFile(null); }}>
                Cancel Edit
              </button>
            )}
          </form>

          <div className="trip-list">
            <h2>Your Trips</h2>
            {trips.length === 0 ? (
              <p>No trips yet. Create one to get started.</p>
            ) : (
              trips.map((trip) => (
                <div key={trip._id} className="trip-card">
                  {trip.coverImage && (
                    <img className="trip-cover" src={trip.coverImage} alt={trip.title} />
                  )}
                  <div>
                    <h3><Link to={`/trips/${trip._id}`}>{trip.title}</Link></h3>
                    <p><strong>Destination:</strong> {trip.destination}</p>
                    <p><strong>Dates:</strong> {trip.startDate ? trip.startDate.slice(0, 10) : '—'} to {trip.endDate ? trip.endDate.slice(0, 10) : '—'}</p>
                    <p><strong>Description:</strong> {trip.description || '—'}</p>
                    <p><strong>Rating:</strong> {trip.rating || '—'}</p>
                  </div>
                  <div className="trip-actions">
                    <Link to={`/trips/${trip._id}`} className="btn-link">View Photos</Link>
                    <button type="button" onClick={() => handleEdit(trip)}>Edit</button>
                    <button type="button" onClick={() => handleDelete(trip._id)}>Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Dashboard;
