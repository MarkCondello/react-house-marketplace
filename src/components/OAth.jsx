import { useLocation, useNavigate } from 'react-router-dom'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toast } from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate(),
  location = useLocation(),
  onGoogleClick = async (ev) => {
    try {
      const auth = getAuth(),
      provider = new GoogleAuthProvider(),
      result = await signInWithPopup(auth, provider),
      user = result.user,
      //check for user in firebase
      docRef = doc(db, 'users', user.uid),
      docSnapshot = await getDoc(docRef)
      // if user doesn't exist, create user
      if (!docSnapshot.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        })
      }
      navigate('/')
    } catch(error) {
      console.error()
      toast.error('Could not authorize with Google.')
    }
  }

  return <div className='socialLogin'>
    <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with</p>
    <button className="socialIconDiv" onClick={onGoogleClick}>
      <img src={googleIcon} alt="Google icon." className="socialIconImg"/>
    </button>
  </div>;
}

export default OAuth;