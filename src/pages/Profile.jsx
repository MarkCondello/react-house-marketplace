// Depts for auth start
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
// Depts for auth end
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'

function Profile() {
  const auth = getAuth(),
  navigate = useNavigate(),
  [changeDetails, setChangeDetails] = useState(false),
  [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  }),
  onLogout = (event) => {
    event.preventDefault()
    auth.signOut()
    navigate('/')
  },
  onSubmit = async (event) => {
    // This updates firestore db
    try {
      if (auth.currentUser.displayName !== name) {
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch(error) {
      console.error()
      toast.error('Could not update profile details')
    }
  },
  onChange = (event) => {
    event.preventDefault()
    setFormData((prevState)=> (
      {
        ...prevState,
        [event.target.id]: event.target.value
      })
    )
  },
  { name, email} = formData

  return (
  <div className="profile">
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button type="button" className="logOut" onClick={onLogout}>Log out</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails"
          onClick={() => { changeDetails && onSubmit(); setChangeDetails((prevState) => !prevState) }}
        >{changeDetails ? 'done' : 'change'}</p>
      </div>
      <div className="profileCard">
        <form>
          <input
            type="text"
            id="name"
            className={ !changeDetails ? 'profileName' : 'profileNameActive' }
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
            <input
            type="text"
            id="email"
            className={ !changeDetails ? 'profileEmail' : 'profileEmailActive' }
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
          />
        </form>
      </div>
      <Link to="/create-listing" className="createListing">
        <img src={homeIcon} alt="Home icon."/>
        <p>Sell or rent your home</p>
        <img src={arrowRightIcon} alt="Arrow right icon."/>
      </Link>
    </main>
  </div>)
}

export default Profile;