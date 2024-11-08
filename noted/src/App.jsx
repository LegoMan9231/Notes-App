import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();

  const goToLoginPage = () => {
    navigate('/login'); // Navigate to the Login page
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the homepage!</p>
      <button onClick={goToLoginPage}>Go to Login Page</button>
    </div>
  );
};

export default App;



