import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// Depts to get data start
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore'
import { db } from '../firebase.config'
// Depts to get data end
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'

function Category() {
  const [listings, setListings] = useState(null),
  [loading, setLoading] = useState(null),
  params = useParams()

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingRef = collection(db, 'listings'), // create a reference to the entity
        queryParams = query(
          listingRef,
          where('type', '==', params.categoryName),
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
  }, [params.categoryName])

  return <div className="category">
    <header>
      <p className="pageHeader">
        { params.categoryName === 'rent' ? 'Places for rent' : 'Places for sale' }
      </p>
    </header>
    { loading ? <Spinner /> : listings && listings.length > 0 ? <>
    <main>
      <ul className="categoryListings">
        {listings.map(listing => (
          <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
        ))}
      </ul>
    </main>
    </> : <p>No listings for {params.categoryName}.</p>}
  </div>;
}

export default Category;