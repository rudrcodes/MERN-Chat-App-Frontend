import axios from 'axios'
import { UserContextProvider } from './UserContext';
import Routes from './Routes';


function App() {
  // Settint axios defaults
  // axios.defaults.baseURL = "http://localhost:4000"
  axios.defaults.baseURL = import.meta.env.VITE_AXIOS_DEFAULTS_BASEURL

  console.log(import.meta.env.VITE_AXIOS_DEFAULTS_BASEURL)
  // This is done so we can set cokkies from our api
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}

export default App
