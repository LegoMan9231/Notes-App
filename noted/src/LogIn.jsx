import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/styles.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);

      // Handle login success
      if (isLogin && response.status === 200) {
        const token = response.data.token; // Get the JWT token from the response
        localStorage.setItem('token', token); // Store the token in localStorage

        // Redirect to the home page or dashboard
        navigate('/');
      }

      // Show message (success or error)
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error occurred:', error);
      setMessage(error.response ? error.response.data.message : 'An error occurred');
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  <label htmlFor="username">Username</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-block">
                    {isLogin ? 'Log In' : 'Register'}
                  </button>
                </div>
              </form>
              {message && (
                <div className="alert alert-info mt-3">
                  <p>{message}</p>
                </div>
              )}
              <hr />
              <div className="text-center">
                <a href="#" className="small" onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Create an Account' : 'Already have an account? Log In'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
