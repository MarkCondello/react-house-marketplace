import { useState, useEffect } from 'react'
// depts required for auth and storage start
import { getAuth } from 'firebase/auth'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
// depts required for auth and storage end

import { v4 as uuidv4 } from 'uuid'
import { useNavigate, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'

function EditListing() {
  // eslint-disable-next-line
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true),
  [loading, setLoading] = useState(false),
  // [listing, setListing] = useState(false),
  [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    imgUrls: {},
    latitude: 0,
    longitude: 0,
  }),
  auth = getAuth(),
  navigate = useNavigate(),
  params = useParams(),
  // isMounted = useRef(true),
  {type, name, bedrooms, bathrooms, parking, furnished, address, offer, regularPrice, discountedPrice, images, latitude, longitude} = formData,
  onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    if (parseInt(discountedPrice) >= parseInt(regularPrice)) {
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price.')
    }
    //ToDo: need to check if the existing images plus images is greater than 6
    if (images.length > 6) {
      setLoading(false)
      toast.error('Max 6 images')
      return
    }
    let geolocation = {},
    location
    if (geoLocationEnabled) {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`),
      data = await response.json()
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
      location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address // not returning an address consistently
      if (location === undefined || location.includes('undefined')){
        setLoading(false)
        toast.error('Please enter a correct address.')
        return
      }
    } else {
      geolocation.lat = latitude
      geolocation.lng = longitude
      // location = address // not returning an address consistently
    }

    //store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(),
        filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`,
        storageRef = ref(storage, `images/${filename}`),
        uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log(`Upload is ${progress}% done`)
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
            default:
              console.log('Upload is running')
              break
          }
        },
        (error) => reject(error), // Handle unsuccessful uploads
        () => { // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log('File available at', downloadURL)
            resolve(downloadURL)
          })
        })
      })
    }

    console.log({images})
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(()=>{
      setLoading(false)
      toast.error('Something went wrong while uploading images.')
    })
    //const imgUrlMap = new Map()
    // Object.values(formData.imgUrls).forEach(imgUrl => {
    //   imgUrlMap.set(imgUrl)
    // })
    // Object.values(imgUrls).forEach(imgUrl => {
    //   imgUrlMap.set(imgUrl)
    // })
    // // console.log({imgURLS: Object.fromEntries(imgUrlMap)})
    // const convertedImgUrls = Object.fromEntries(imgUrlMap)
 
    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp()
    }
    
    delete formDataCopy.images
    delete formDataCopy.address
    // location && (formDataCopy.location = location)  // not returning an address consistently
    formDataCopy.location = address
    !formDataCopy.offer && delete formDataCopy.discountedPrice
    console.log({formDataCopy})
    const docRef = doc(db, 'listings', params.listingId)
    await updateDoc(docRef, formDataCopy)
    setLoading(false)
    toast.success('Listing was updated.')
    // navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  },
  onMutate = (event) => {
    let boolean = null
    // Check boolean strings
    if (event.target.value === 'true') boolean = true
    if (event.target.value === 'false') boolean = false
    //Check files included
    if (event.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: event.target.files
      })
      )
    }
    if (!event.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [event.target.id]: boolean ?? event.target.value
      })
      )
    }
  }

  //fetch listing to edit
  useEffect(() => {
    // console.log({currentUser: auth.currentUser})
    // if (listing && listing.userRef !== auth.currentUser?.uid) {
    //   toast.error('You can not edit this listing.')
    //   navigate('/')
    // }
    // if (isMounted) {
    //   onAuthStateChanged(auth, (user) => { // I think this checks if the user has logged into another account????
    //     if (user) {
    //       setFormData({...formData, userRef: user.uid})
    //     } else {
    //       navigate('/sign-in')
    //     }
    //   })
    // }

    setLoading(true)
    const fetchListing = async () => {
      const docRef = doc(db, 'listings', params.listingId),
      docSnapshot = await getDoc(docRef)

      if (docSnapshot.exists && docSnapshot.data()) {
        const listingData = docSnapshot.data()

        if (listingData.userRef !== auth.currentUser.uid) {
          toast.error('You can not edit this listing.')
          navigate('/')
        }
        console.log({listingData})
        setFormData({...listingData, address: listingData.location})
        // console.log('reached fetchListing in useEffect, data', listingData)
      } else {
        navigate('/')
        toast.error('Listing does not exist')
      }
      setLoading(false)
    }
    fetchListing()
  }, [params.listingId, auth, navigate])

  if (loading) {
    return <Spinner />
  }
  return <div className='profile'>
    <header>
      <p className="pageHeader">Edit listing</p>
    </header>
    <main>
      <form onSubmit={onSubmit}>
        <label htmlFor="" className="formLabel">Sell / Rent</label>
        <div className="formButtons">
          <button
            type="button"
            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
            id='type'
            value='sale'
            onClick={onMutate}
          >Sell</button>
          <button
            type="button"
            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
            id='type'
            value='rent'
            onClick={onMutate}
          >Rent</button>
        </div>
        <label htmlFor="name" className="formLabel">Name</label>
        <input
          className='formInputName'
          type="text"
          id='name'
          value={name}
          onChange={onMutate}
          minLength='10'
          maxLength='32'
          required
        />
        <div className="formRooms flex">
          <div>
            <label htmlFor="bedrooms" className="formLabel">Bedrooms</label>
            <input
              className='formInputSmall'
              type="number"
              id='bedrooms'
              value={bedrooms}
              onChange={onMutate}
              minLength='1'
              maxLength='50'
              required
            />
          </div>
          <div>
            <label htmlFor="bathrooms" className="formLabel">Bathrooms</label>
            <input
              className='formInputSmall'
              type="number"
              id='bathrooms'
              value={bathrooms}
              onChange={onMutate}
              minLength='1'
              maxLength='50'
              required
            />
          </div>
        </div>
        <label htmlFor="parking" className="formLabel">Parking</label>
        <div className="formButtons">
          <button
            type="button"
            className={parking ? 'formButtonActive' : 'formButton'}
            id='parking'
            value={true}
            onClick={onMutate}
          >Yes</button>
          <button
            type="button"
            className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
            id='parking'
            value={false}
            onClick={onMutate}
          >No</button>
        </div>
        <label htmlFor="furnished" className="formLabel">Furnished</label>
        <div className="formButtons">
          <button
            type="button"
            className={furnished ? 'formButtonActive' : 'formButton'}
            id='furnished'
            value={true}
            onClick={onMutate}
          >Yes</button>
          <button
            type="button"
            className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
            id='furnished'
            value={false}
            onClick={onMutate}
          >No</button>
        </div>
        <label htmlFor="address" className="formLabel">Address</label>
        <textarea
          className='formInputAddress'
          id='address'
          value={address}
          onChange={onMutate}
          required
        />
        {!geoLocationEnabled && (
        <div className="formLatLng flex">
          <div>
            <label htmlFor="latitude" className="formLabel">Latitude</label>
            <input
              className='formInputSmall'
              type="number"
              id='latitude'
              value={latitude}
              onChange={onMutate}
              required
            />
          </div>
          <div>
            <label htmlFor="longitude" className="formLabel">Longitude</label>
            <input
              className='formInputSmall'
              type="number"
              id='longitude'
              value={longitude}
              onChange={onMutate}
              required
            />
          </div>
        </div>
        )}
        <label htmlFor="offer" className="formLabel">Offer</label>
        <div className="formButtons">
          <button
            type="button"
            className={offer ? 'formButtonActive' : 'formButton'}
            id='offer'
            value={true}
            onClick={onMutate}
          >Yes</button>
          <button
            type="button"
            className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
            id='offer'
            value={false}
            onClick={onMutate}
          >No</button>
        </div>
        <label htmlFor="regularPrice" className="formLabel">Regular Price</label>
        <div className='flex'>
          <input
            className='formInputSmall'
            type="number"
            id='regularPrice'
            value={regularPrice}
            onChange={onMutate}
            minLength='50'
            maxLength='75000000'
            required
          />
        {type === 'rent' && (
          <p className='formPriceText'>$ / Month</p>
          )}
        </div>
        { offer && (
          <>
          <label htmlFor="discountedPrice" className="formLabel">Discounted Price</label>
           <input
            className='formInputSmall'
            type="number"
            id='discountedPrice'
            value={discountedPrice}
            onChange={onMutate}
            minLength='50'
            maxLength='75000000'
            required={offer}
          />
          </>
        )}
        <label htmlFor="images" className="formLabel">Images</label>
        <p className="imagesInfo">The first image will be cover (max 6).</p>
        <input
          className='formInputFile'
          type="file"
          id='images'
          onChange={onMutate}
          maxLength='6'
          accept='.jpg,.png,.jpeg'
          multiple
          required
        />
        <ul className="listingImages">
          {Object.values(formData.imgUrls).map((imgUrl, index) => (
            <li
              key={index}
              style={{height: '100px',backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
            >
              {/* Add delete icon */}
            </li>
          ))
          }
        </ul>
  
        <button
          type="submit"
          className='primaryButton createListingButton'
        >Edit Listing</button>
      </form>
    </main>
  </div>
}

export default EditListing