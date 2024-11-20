import React, { useState } from 'react';
import axios from 'axios';
import './css/styles.css'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLogin, setIsLogin] = useState(true); // Flag to switch between login and register
  const [message, setMessage] = useState('');

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
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData);
      console.log('Response from server:', response);  // Log the response
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error occurred:', error);  // Log the error
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
              <div className="text-center mt-3">
                <p className="small">Forgot Password? <a href="password_reset">Reset here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
