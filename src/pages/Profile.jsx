import { useEffect, useState } from 'react'
// Depts for auth start
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
// Depts for auth end


function Profile() {
  const [user, setUser] = useState(null),
  auth = getAuth()

  useEffect(()=>{
    setUser(auth.currentUser)
    console.log(auth.currentUser)
  }, [])

  return (user ? <h1>{user.displayName}</h1> : <p>Not logged in</p>)

}

export default Profile;