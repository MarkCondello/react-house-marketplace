import { useState, useEffect } from 'react'
import { useSearchParams, useParams } from 'react-router-dom'

import { getAuth } from 'firebase/auth'

import { getDoc, addDoc, doc, serverTimestamp, collection } from 'firebase/firestore'
import { db } from '../firebase.config'

import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

import { toast } from 'react-toastify'

function Contact() {
  // eslint-disable-next-line
  const [formData, setFormData] = useState({
    senderEmail: '',
    message: '',
  }),
  [landlord, setLandlord] = useState(null),
  [loading, setLoading] = useState(false),
  // eslint-disable-next-line
  [searchParams, setSearchParams] = useSearchParams(),
  auth = getAuth(),
  params = useParams(),
  navigate = useNavigate(),
  onMutate = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value
    })
    )
  },
  handleSendMessage = async () => {
    try {
      setLoading(true)
      const messageDetails = {
        listing: searchParams.get('listingName'),
        userRef: landlord.userRef,
        timestamp: serverTimestamp(),
        ...formData
      }
      console.log({ messageDetails })
      await addDoc(collection(db, 'messages'), messageDetails)
      toast.success('Message sent')
     } catch(err) {
      toast.error('There was an issue sending your message')
    }
    setLoading(false)
    navigate('/')
    // Handle the sending of the messageDetails with firebase instead of the below:
    //`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${formData.message}`
  }

  useEffect(()=>{
    const getLandlord = async () => {
      const docRef = doc(db, 'users', params.landlordId),
      docSnapshot = await getDoc(docRef)

      if (docSnapshot.exists()) {
        // console.log(docSnapshot.data())
        setLandlord({...docSnapshot.data(), userRef: docRef.id})
      } else {
        toast.error('Could not get landlord.')
      }
    }
    getLandlord()
  }, [params.landlordId])
  if (loading) {
    return <Spinner />
  }

return <div className="pageContainer">
    <header>
      <p className="pageHeader">
        { searchParams.get('replyMessage') && searchParams.get('replyMessage') !== 'yes' ? 'Contact landlord' : `Reply to ${landlord?.name}` }
      </p>
    </header>
    {landlord !== null && (
      <main>
        { !searchParams.get('replyMessage') &&
        <div className="contactLandlord">
          <p className="landlordName">Contact: {landlord?.name}</p>
        </div>
        }
        <form className="messageForm">
          <label htmlFor="senderEmail" className="formLabel">Your email:</label>
          <input
            className='formInputName'
            type="email"
            id='senderEmail'
            value={formData.senderEmail}
            onChange={onMutate}
            minLength='10'
            maxLength='32'
            required
          />
          <div className="messageDiv">
            <label htmlFor="message" className="messageLabel">Message</label>
            <textarea onChange={onMutate} value={formData.message} className="textarea" name="message" id="message">
            </textarea>
          </div>
          {formData.message.length > 10 && formData.senderEmail ? (
            <button type="button" className="primaryButton" onClick={handleSendMessage}
            >Send message.
              {/* <a
                onClick={handleSendMessage}
                href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${formData.message}`}
              >Send message!</a> */}
            </button>
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