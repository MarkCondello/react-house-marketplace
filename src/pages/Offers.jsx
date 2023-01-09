import { useEffect, useState } from 'react'
// Depts to get data start
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
// Depts to get data end
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Offers() {
  const [listings, setListings] = useState(null),
  [loading, setLoading] = useState(null)

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
        listings = []
        
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
    </main>
    </> : <p>There are currently no offers.</p>}
  </div>;
}

export default Offers;