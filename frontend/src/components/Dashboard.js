import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatBox from './Chat/ChatBox';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard">
      <div className="user-profile">
        <h2>Student Profile</h2>
        <div className="profile-details">
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Student ID:</strong> {user?.studentId}</p>
          </div>
          <div className="profile-info">
            <p><strong>Institution:</strong> {user?.institution}</p>
            <p><strong>Course:</strong> {user?.course}</p>
            <p><strong>Year of Study:</strong> {user?.yearOfStudy}</p>
          </div>
        </div>
      </div>
      
      <div className="chatbot-section">
        <ChatBox />
      </div>
    </div>
  );
};

export default Dashboard;