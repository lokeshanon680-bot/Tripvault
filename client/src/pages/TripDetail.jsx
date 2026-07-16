import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const loadTrip = async () => {
    try {
      const res = await api.get(`/trips/${id}`);
      setTrip(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load trip');
    }
  };

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      await api.post(`/trips/${id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageFile(null);
      await loadTrip();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (error) return <p className="message error">{error}</p>;
  if (!trip) return <p>Loading...</p>;

  return (
    <div className="trip-detail">
      <Link to="/dashboard" className="btn-link">&larr; Back to Dashboard</Link>
      <h1>{trip.title}</h1>
      <p><strong>Destination:</strong> {trip.destination}</p>
      <p><strong>Dates:</strong> {trip.startDate ? trip.startDate.slice(0, 10) : '—'} to {trip.endDate ? trip.endDate.slice(0, 10) : '—'}</p>
      <p><strong>Description:</strong> {trip.description || '—'}</p>
      <p><strong>Rating:</strong> {trip.rating || '—'}</p>

      <form className="upload-form" onSubmit={handleUpload}>
        <label className="file-label">
          Add a photo
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        </label>
        <button type="submit" disabled={!imageFile || uploading}>
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>

      <h2>Photos</h2>
      {trip.photos && trip.photos.length > 0 ? (
        <div className="photo-grid">
          {trip.photos.map((url, i) => (
            <img key={i} src={url} alt={`${trip.title} photo ${i + 1}`} />
          ))}
        </div>
      ) : (
        <p>No photos yet. Upload one above.</p>
      )}
    </div>
  );
}

export default TripDetail;
