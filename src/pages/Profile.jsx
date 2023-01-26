import { useEffect } from 'react'
// Depts for auth start
import { getAuth, updateProfile } from 'firebase/auth'
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
// Depts for auth end
import { toast } from 'react-toastify'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import arrowRightIcon from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth = getAuth(),
  navigate = useNavigate(),
  [changeDetails, setChangeDetails] = useState(false),
  [listings, setListings] = useState(null),
  [loading, setLoading] = useState(true),
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
  onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Succesfully deleted listing.')
    }
  },
  onEdit = (listingId) => {
    navigate(`/edit-listing/${listingId}`)
  },
  { name, email} = formData

  useEffect(() => {
    const fetchUsersListings = async () => {
      const listingsRef = collection(db, 'listings'),
      listingsQuery = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      ),
      querySnapshot = await getDocs(listingsQuery)

      let listings = []
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings(listings)
      setLoading(false)
    }
    fetchUsersListings()
  }, [auth.currentUser.uid])

  if (loading) {
    return <Spinner />
  }
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

      {!loading && listings?.length && (
        <>
        <p className="listingText">Your listings</p>
        <ul className="listingsList">
          { listings.map((listing) => (
            <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={()=> onDelete(listing.id)} onEdit={()=> onEdit(listing.id)}/>
          ))}
        </ul>
        </>
      )}
    </main>
  </div>)
}

export default Profile;