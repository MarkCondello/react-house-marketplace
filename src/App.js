import './App.css';
import 'react-toastify/dist/ReactToastify.min.css'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Navbar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'

import Category from './pages/Category'
import Contact from './pages/Contact'
import CreateListing from './pages/CreateListing'
import Explore from './pages/Explore'
import ForgotPassword from './pages/ForgotPassword'
import Listing from './pages/Listing'
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
        <Route path="/contact/:landlordId" element={<Contact />}></Route>
        <Route path="/category/:categoryName" element={<Category />}></Route>
        <Route path="/category/:categoryName/:listingId" element={<Listing />}></Route>

        <Route path="/profile" element={<PrivateRoute />}>{/* Uses the Outlet component from react-router-dom */}
          <Route path="/profile" element={<Profile />}></Route>
        </Route>

        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/create-listing" element={<CreateListing />}></Route>
      </Routes>
      <Navbar />
    </Router>
    <ToastContainer />
    </>
  );
}

export default App;
