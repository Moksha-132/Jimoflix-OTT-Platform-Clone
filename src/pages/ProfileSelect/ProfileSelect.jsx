import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import './ProfileSelect.css';

const profiles = [
    { id: 1, name: 'User 1', initial: 'U', gradient: 'gradient-1' },
    { id: 2, name: 'Kids', initial: 'K', gradient: 'gradient-2' },
    { id: 3, name: 'Guest', initial: 'G', gradient: 'gradient-3' },
];

const ProfileSelect = () => {
    const navigate = useNavigate();

    const handleProfileSelect = (profile) => {
        // In a real app, this would set the active profile
        navigate('/');
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1 className="profile-title">Who's watching?</h1>

                <div className="profile-grid">
                    {profiles.map((profile) => (
                        <div
                            key={profile.id}
                            className="profile-card"
                            onClick={() => handleProfileSelect(profile)}
                        >
                            <div className={`profile-avatar ${profile.gradient}`}>
                                {profile.initial}
                            </div>
                            <span className="profile-name">{profile.name}</span>
                        </div>
                    ))}

                    <div className="profile-card">
                        <div className="profile-avatar add-profile">
                            <FiPlus />
                        </div>
                        <span className="profile-name">Add Profile</span>
                    </div>
                </div>

                <button className="manage-profiles-btn">Manage Profiles</button>
            </div>
        </div>
    );
};

export default ProfileSelect;
