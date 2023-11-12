import axios from 'axios'
import { UserContextProvider } from './UserContext';
import Routes from './Routes';

function App() {
  // Settint axios defaults
  axios.defaults.baseURL = "http://localhost:4000"

  // This is done so we can set cokkies from our api
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
