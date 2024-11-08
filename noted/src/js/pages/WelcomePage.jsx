
import { useNavigate } from 'react-router-dom';
const WelcomePage = () => {

  const navigate = useNavigate();
  const [username, updateUsername] = useState('');
  const [email, updateEmail] = useState('');
  const [firstName, updateFirstName] = useState('');
  const [lastName, updateLastName] = useState('');

  const goToHomePage = () => {
    navigate('/'); // Navigate to the home page
  };
 
    return (
      <div>
        <h1>Welcome to HackerCon</h1>
        <p>Welcome SuperHacker You Are Inz</p>
        <h2>Registration</h2>
        <input
        type="text"
        value={username}
        onChange={(e) => updateUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="text"
        value={email}
        onChange={(e) => updateEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="text"
        value={firstName}
        onChange={(e) => updateFirstName(e.target.value)}
        placeholder="First Name"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => updateLastName(e.target.value)}
        placeholder="Last Name"
      />
        <button onClick={goToHomePage}>HOME</button>
      </div>
    );
  };
  
  export default WelcomePage;
  