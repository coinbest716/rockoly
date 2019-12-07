import React, { useState } from 'react';
import Page from '../shared/layout/Main';
import ChefImage from './components/ChefImage';
import ChefContent from './components/ChefContent';
import DetailsTab from './components/detailsTab/DetailsTab';
import Loader from '../Common/loader';

const ChefDetail = props => {

  const [isClickBooking, setIsClickBooking] = useState(null);
  const [isEvent,setEvent] = useState();
  
  function onClickBooking(event,clickBook){
    setIsClickBooking(clickBook);
    setEvent(event);
  }
  try {
    return (
      <React.Fragment>
        <Page>
          <section className="products-details-area pt-60">
            <div className="container">
              <div className="row">
                {/* {!props.chefIdToDisplay.chefId &&
                     setLoading(true) 
                } */}
                <ChefImage chefId={props.chefIdToDisplay.chefId} />
                <ChefContent chefId={props.chefIdToDisplay.chefId} onClickBooking={onClickBooking}/>
                <DetailsTab chefId={props.chefIdToDisplay.chefId} 
                isClickBooking={isClickBooking} 
                event = {isEvent}
                />
              </div>
            </div>
          </section>
        </Page>
      </React.Fragment>
    );
  } catch (error) {}
};
export default ChefDetail;
