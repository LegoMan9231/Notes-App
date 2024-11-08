import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');

  const goToLoginPage = () => {
    if (username === "JohnSmith@live.com" && password === "GCSD1032") {
      navigate('/landing'); // Navigate to the landing page
    } else {
      alert("Invalid credentials"); // Optional: Show an alert for invalid credentials
    }
  };

  return (
    <div>
      <h1>Login Here</h1>
      <p>This is the Login Page.</p>
      <input
        type="text"
        value={username}
        onChange={(e) => updateUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => updatePassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={goToLoginPage}>Take Qualifier Quiz</button>
    </div>
  );
};

export default LoginPage;

  