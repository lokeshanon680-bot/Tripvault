import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // No auth header needed — this endpoint is public
        const res = await api.get(`/users/${username}/profile`);
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Profile not found');
      }
    };
    load();
  }, [username]);

  if (error) return <p className="message error">{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="public-profile">
      <div className="profile-header">
        <h1>{profile.name}</h1>
        <p className="username">@{profile.username}</p>
        {profile.bio && <p className="bio">{profile.bio}</p>}
      </div>

      <h2>Trips</h2>
      {profile.trips && profile.trips.length > 0 ? (
        <div className="trip-grid">
          {profile.trips.map((trip) => (
            <div key={trip._id} className="trip-card public">
              {trip.coverImage && <img className="trip-cover" src={trip.coverImage} alt={trip.title} />}
              <h3>{trip.title}</h3>
              <p><strong>Destination:</strong> {trip.destination}</p>
              <p><strong>Dates:</strong> {trip.startDate ? trip.startDate.slice(0, 10) : '—'} to {trip.endDate ? trip.endDate.slice(0, 10) : '—'}</p>
              <p><strong>Rating:</strong> {trip.rating || '—'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No trips shared yet.</p>
      )}
    </div>
  );
}

export default PublicProfile;
