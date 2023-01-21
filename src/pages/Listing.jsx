import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { getDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase.config'

import { Formatter } from '../helpers/formatter.js'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'

import { MapContainer, Marker, Markerm, Popup, TileLayer } from 'react-leaflet'

function Listing() {
  const [listing, setListing] = useState(null),
  [loading, setLoading] = useState(true),
  [shareLinkCopied, setshareLinkCopied] = useState(false),
  navigate = useNavigate(),
  params = useParams(),
  auth = getAuth()

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId),
      docSnapshot = await getDoc(docRef)
      if (docSnapshot.exists()) {
        console.log(docSnapshot.data())
        setListing(docSnapshot.data())
        setLoading(false)
      }
    }
    fetchListing()
  }, [navigate, params.listingId])

  if (loading) {
    return <Spinner />
  }
  return <main>
  {/* SLideshot */}
  <div className="shareIconDiv" onClick={() => {
    navigator.clipboard.writeText(window.location.href)
    setshareLinkCopied(true)
    setTimeout(()=>{
      setshareLinkCopied(false)
    }, 2000)
    }}>
      <img src={shareIcon} alt="Shar icon." />
    </div>
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