import './App.css';
import 'react-toastify/dist/ReactToastify.min.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Navbar from './components/NavBar'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Offers from './pages/Offers'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Explore />}></Route>
        <Route path="/offers" element={<Offers />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      </Routes>
      <Navbar />
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
