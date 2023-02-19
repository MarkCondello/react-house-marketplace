import { useEffect, useState } from 'react'
// Depts to get data start
import { collection, getDocs, query, where, orderBy, limit, startAfter, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase.config'
// Depts to get data end
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {
  const [lastFetchedListing, setLastFetchedListing] = useState(null),
  [listings, setListings] = useState(null),
  [listingCount, setListingCount] = useState(null),
  [loading, setLoading] = useState(null),
   // Pagination / load More
   onLoadMoreListings = async () => {
    try {
      const listingRef = collection(db, 'listings'), // create a reference to the entity
      queryParams = query(
        listingRef,
        where("offer", '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      ), // query to firebase
      querySnapshot = await getDocs(queryParams), // returns a collection
      lastVisible = querySnapshot.docs[querySnapshot.docs.length -1]
      setLastFetchedListing(lastVisible)
      const listings = []
      
      querySnapshot.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListings((prevState) => [...prevState, ...listings]) // appendNew listings
      setLoading(false)
    } catch(error){
      console.log(error)
      toast.error('Could not fetch listings.')
    }
  }

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = collection(db, 'listings'), // create a reference to the entity
        queryParams = query(
          listingRef,
          where("offer", '==', true),
          orderBy('timestamp', 'desc'),
          limit(10)
        ), // query to firebase
        querySnapshot = await getDocs(queryParams), // returns a collection
        lastVisible = querySnapshot.docs[querySnapshot.docs.length -1]
        // console.log({lastVisible})
        setLastFetchedListing(lastVisible)


        const countQuerySnapshot = await getCountFromServer(
          query(listingRef, where('offer', '==', true))
        )
        // console.log('listings offers listing count: ', countQuerySnapshot.data().count);
        setListingCount(countQuerySnapshot.data().count)

        const listings = []
        
        querySnapshot.forEach(doc => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListings(listings)
        setLoading(false)
      } catch(error){
        console.log(error)
        toast.error('Could not fetch listings.')
      }
    }
    fetchListing()
  }, [])

  return <div className="category">
    <header>
      <p className="pageHeader">Offers</p>
    </header>
    { loading ? <Spinner /> : listings && listings.length > 0 ? <>
    <main>
      <ul className="categoryListings">
        {listings.map(listing => (
          <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
        ))}
      </ul>
      {listings.length < listingCount && (
      <button className="loadMore" onClick={onLoadMoreListings}>Load more</button>
      )}
    </main>
    </> : <p>There are currently no offers.</p>}
    <br />
    <br />
  </div>
}

export default Offers