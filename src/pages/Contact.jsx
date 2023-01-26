import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'

import { getDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'

import { toast } from 'react-toastify'

function Contact() {
  // eslint-disable-next-line
  const [message, setMessage] = useState(''),
  [landlord, setLandlord] = useState(null)
  // eslint-disable-next-line
  const [searchParams, setSearchParams] = useSearchParams(),
  params = useParams(),
  onChange = (event) => {
    setMessage(event.target.value)
  }

  useEffect(()=>{
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId),
      docSnapshot = await getDoc(docRef)
      if (docSnapshot.exists()) {
        // console.log(docSnapshot.data())
        setLandlord(docSnapshot.data())
      } else {
        toast.error('Could not get landlord.')
      }
    }
    getLandlord()
  }, [params.landlordId])

  return <div className="pageContainer">
    <header><p className="pageHeader">Contact landlord</p></header>
    {landlord !== null && (
      <main>
        <div className="contactLandlord">
          <p className="landlordName">Contact: {landlord?.name}</p>
        </div>
        <form className="messageForm">
          <div className="messageDiv">
            <label htmlFor="message" className="messageLabel">Message</label>
            <textarea onChange={onChange} value={message} className="textarea" name="message" id="message">
            </textarea>
          </div>
          {message.length > 10 ? (
            <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
            <button type="button" className="primaryButton">Send message</button>
          </a>
          ) : (
            <button type="button" className="primaryButton" disabled>Create message</button>
          ) }
  
        </form>
      </main>
    )}
  </div>
}

export default Contact

// An add on feature worth including is creating another collection of messages which a user / landlord can view