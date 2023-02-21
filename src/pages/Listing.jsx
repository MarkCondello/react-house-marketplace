import { useState, useEffect } from 'react'
import { Link, redirect, useNavigate, useParams } from 'react-router-dom'

import { getDoc, doc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'

import { Formatter } from '../helpers/formatter.js'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'

import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import { toast } from 'react-toastify'

// Swiper deps
import SwiperCore, {Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'
// 6.8.1 is what Brad uses
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])
function Listing() {
  const [listing, setListing] = useState(null),
  [loading, setLoading] = useState(true),
  [shareLinkCopied, setshareLinkCopied] = useState(false),
  navigate = useNavigate(),
  params = useParams(),
  auth = getAuth(),
  onEdit = () => {
    console.log('Reached onEdit in Listing.jsx', params.listingId)
    navigate(`/edit-listing/${params.listingId}`)
  },
  
  onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      redirect('/')
      toast.success('Succesfully deleted listing.')
    }
  }

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId),
      docSnapshot = await getDoc(docRef)
      if (docSnapshot.exists()) {
        // console.log(docSnapshot.data())
        setListing(docSnapshot.data())
        setLoading(false)
      } else {
        redirect('/')
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }
  return <main>

  <Swiper slidesPerView={1} pagination={{clickable: true}} className="swiperSlider">
    {Object.values(listing.imgUrls).map((url, index) =>
    <>
    <p>{url}</p>
    <SwiperSlide key={index}>
      <div
        className="swiperSlideDiv"
        style={{backgroundImage: `url(${listing.imgUrls[0]})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
        ></div>
      </SwiperSlide>
    </>
    )}
  </Swiper>

  <div className="shareIconDiv" onClick={() => {
    navigator.clipboard.writeText(window.location.href)
    setshareLinkCopied(true)
    setTimeout(()=>{
      setshareLinkCopied(false)
    }, 2000)
    }}>
      <img src={shareIcon} alt="Shar icon." />
    </div>

    { auth.currentUser?.uid === listing.userRef &&
    <>
      <div className="editIconDiv"><EditIcon onClick={() => onEdit()} /></div>
      <div className="deleteIconDiv"><DeleteIcon onClick={() => onDelete()} /></div>
    </>
    }
    
    {shareLinkCopied && <p className='linkCopied'>Link copied</p>}

    <div className="listingDetails">
      <p className="listingName">{listing.name} - {listing.offer ? Formatter.formatToMoney(listing.discountedPrice) : Formatter.formatToMoney(listing.regularPrice)}</p>
      <p className="listingLocation">{listing.location}</p>
      <p className="listingType">For {listing.type === 'rent' ? 'Rent' : 'Sale'}</p>
      {listing.offer && (
        <p className="discountPrice">{Formatter.formatToMoney(listing.regularPrice - listing.discountedPrice)} discount</p>
      )}
      <ul className="listingDetailsList">
        <li>{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : '1 bedroom'}</li>
        <li>{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : '1 bathroom'}</li>
        <li>{listing.parking && 'Parking spot'}</li>
        <li>{listing.furnished && 'Furnished'}</li>
      </ul>
      <p className="listingLocationTitle">Location</p>
      <div className="leafletContainer">
        <MapContainer
          style={{height: '100%', width: '100%'}}
          center={[listing.geolocation.lat, listing.geolocation.lng]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
          />
          <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
            <Popup>{listing.location}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {auth.currentUser?.uid !== listing.userRef && (
        <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>Contact Landlord</Link>
      )}
    </div>
  </main>
}

export default Listing;