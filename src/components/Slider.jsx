import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import { db } from '../firebase.config'

import SwiperCore, {Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/swiper-bundle.min.css'

import Spinner from '../components/Spinner'
import { Formatter } from '../helpers/formatter.js'

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y])

function Slider() {
  const [loading, setLoading] = useState(true),
  [listings, setListings] = useState(null),
  navigate = useNavigate()

  useEffect(() => {
    const getListings = async () => {
      const listingsRef = collection(db, 'listings'),
      listingQuery = query(listingsRef, orderBy('timestamp', 'desc'), limit(5)),
      querySnapshot = await getDocs(listingQuery)

      let listings = []
      
      querySnapshot.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings(listings)
      // console.log(listings)
      setLoading(false)
    }
    getListings()
  }, [setLoading, setListings])

  if (loading) {
    <Spinner />
  }

  return listings && listings.length && (
    <>
      <p className="exploreHeading">Recommended</p>
      <Swiper slidesPerView={1} pagination={{clickable: true}}>
        {listings.map(({data, id}) => {
          return <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
            <div
              className="swiperSlideDiv"
              style={{backgroundImage: `url(${data.imgUrls[0]})`, backgroundSize: 'cover', backgroundPosition: 'center'}}
            >
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">
                {Formatter.formatToMoney(data.discountedPrice) ?? Formatter.formatToMoney(data.regularPrice)}
                {data.type === 'rent' && ' / month'}
              </p>
            </div>
          </SwiperSlide>
        })}
      </Swiper>
    </>
  )
}

export default Slider;