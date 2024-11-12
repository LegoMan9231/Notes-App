
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {

  const navigate = useNavigate();

  const goToQuizPage = () => {
    navigate('/quiz'); // Navigate to the Quiz page
  };

  return (
      <div>
        <h1>You have landed</h1>
        <p>Welcome Potential Hackers</p>
        <button onClick={goToQuizPage}>Go to Quiz Page</button>
      </div>
    );
  };
  
  export default LandingPage;
  
  