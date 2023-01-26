import { Link } from 'react-router-dom'
import { Formatter } from '../helpers/formatter'
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg'
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg'
import bedIcon from '../assets/svg/bedIcon.svg'
import bathtubIcon from '../assets/svg/bathtubIcon.svg'

function ListingItem({listing, id, onDelete, onEdit}) {
  // console.log(listing)
  return (
    <li className="categoryListing">
      <Link
        to={`/category/${listing.type}/${id}`}
        className="categoryListingLink">
          <img src={listing.imgUrls[0]} alt={listing.name} className="categoryListingImg" />
          <div className="categoryListingDetails">
            <p className="categoryListingLocation">{listing.location}</p>
            <p className="categoryListingName">{listing.name}</p>
            <p className="categoryListingPrice">
              {listing.offer ? Formatter.formatToMoney(listing.discountedPrice) : Formatter.formatToMoney(listing.regularPrice)}
              {listing.type === 'rent' && ' / Month'}
            </p>
            <div className="categoryListingInfoDiv">
              <img src={bedIcon} alt="Bed icon." />
              <p className="categoryListingInfoText">{listing.bedrooms > 1 ? `${listing.bedrooms} bedrooms` : `${listing.bedrooms} bedroom`}</p>
              <img src={bathtubIcon} alt="Bath icon." />
              <p className="categoryListingInfoText">{listing.bathrooms > 1 ? `${listing.bathrooms} bathrooms` : `${listing.bathrooms} bathroom`}</p>

            </div>
          </div>
      </Link>
      {/* Need to add the onDelete from Category */}
      {onDelete && (
        <DeleteIcon className="removeIcon" fill="rgb(321, 76, 60)" onClick={()=> onDelete(id, listing.name)}/>
      )}
      {/* Need to add the onEdit  */}
        {onDelete && (
        <EditIcon className="editIcon" onClick={()=> onEdit(id)}/>
      )}
    </li>
  );
}

export default ListingItem;