import { useState, } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { toast } from 'react-toastify'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'

function ForgotPassword() {
  const [email, setEmail] = useState(''),
  onChange = event => setEmail(event.target.value),
  onSubmit = async (event) => {
    event.preventDefault()
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, email)
      toast.success('Email was sent.')
    } catch(error) {
      console.error()
      toast.error('Could not send reset email.')
    }
  }

  return (<div className="pageContainer">
    <header>
      <p>Forgot Password..</p>
    </header>
    <main>
      <form onSubmit={onSubmit}>
        <input type="email" className="emailInput" value={email} id="email" onChange={onChange}/>
        <Link className="forgotPasswordLink" to="/sign-in">Sign in</Link>
        <div className="signInBar">
          <div className="signInText">Send Reset Link</div>
          <button className="signInButton">
            <ArrowRightIcon fill="#fff" width="34px" height="34px" />
          </button>
        </div>
      </form>
    </main>
  </div>);
}

export default ForgotPassword;