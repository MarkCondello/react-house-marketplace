import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Depts for auth start
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
// Depts for auth end

import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'

function SignIn() {
  const [showPassword, setShowPassword] = useState(false),
  [formData, setFormData] = useState({
    email: '',
    password: ''
  }),
  {email, password} = formData,
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
      userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      if(userCredential.user) {
        navigate('/')
      }
    } catch(error) {
      toast.error('Incorrect credentials.')
      console.error()
    }
  }

  return (<>
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Welcome back</p>
      </header>
      <form onSubmit={onSubmit}>
        <input
          type="email" className="emailInput" id="email" value={email} onChange={onChange}/>
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
          <p className="signIntext">Sign in</p>
          <button className="signInButton">
            <ArrowRightIcon fill="#fff" width="34px" height="34px"/>
          </button>
        </div>
      </form>
      {/* Google OAuth component */}
      <Link to='/sign-up' className="registerLink">Sign up instead</Link>
    </div>
  </>);
}

export default SignIn;