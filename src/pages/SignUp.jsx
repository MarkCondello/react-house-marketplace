import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Depts for auth start
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config'
// Depts for auth end
// Depts for FireStore start
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 
// Depts for FireStore end

import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignUp() {
  const [showPassword, setShowPassword] = useState(false),
  [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  }),
  {name, email, password} = formData,
  navigate = useNavigate(),
  onChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value
    }))
  },
  onSubmit = async (event) => {
    event.preventDefault()
    try {
      const auth = getAuth(),
      userCredential = await createUserWithEmailAndPassword(auth, email, password),
      user = userCredential.user // user gets added to the db

      updateProfile(auth.currentUser, {
        displayName: name
      })

      const formDataCopy = {...formData}
      delete formDataCopy.password // pw should not be added to firestore
      formDataCopy.timeStamp = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), formDataCopy)

      navigate('/')
    } catch(error) {
      console.error()
      toast.error('Something went wrong.')
    }
  }

  return (<>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome back</p>
      </header>
      <form onSubmit={onSubmit}>
        <input type="text" className="nameInput" placeholder="Name" id="name" value={name} onChange={onChange}/>
        <input type="email" className="emailInput" id="email" value={email} onChange={onChange}/>
        <div className="passwordInputDiv">
          <input
            type={showPassword ? 'text' : 'password'}
            className="passwordInput"
            placeholder="Password"
            id="password"
            value={password}
            onChange={onChange}
          />
          <img
            src={visibilityIcon}
            alt="Show password."
            className="showPassword"
            onClick={() => setShowPassword((prevState) => !prevState)}
          />
        </div>
        <Link to='/forgot-password' className="forgotPasswordLink">Forgot password</Link>
        <div className="signInBar">
          <p className="signIntext">Sign up</p>
          <button className="signUpButton">
            <ArrowRightIcon fill="#fff" width="34px" height="34px"/>
          </button>
        </div>
      </form>
      {/* Google OAuth component */}
      <Link to='/sign-in' className="registerLink">Sign in instead</Link>
    </div>
  </>);
}

export default SignUp;