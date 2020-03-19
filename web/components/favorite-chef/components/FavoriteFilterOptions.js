import Link from 'next/link';
const FavoriteFilterOptions = props => {
  function handleGrid(evt, e) {
    // getting grid displays
    try {
      props.handleGrid(e);
      let i, aLinks;

      aLinks = document.getElementsByTagName('a');
      for (i = 0; i < aLinks.length; i++) {
        aLinks[i].className = aLinks[i].className.replace('active', '');
      }

      evt.currentTarget.className += ' active';
    } catch (error) {
      //console.log(error.message);
    }
  }
  return (
    <div className="products-filter-options col-lg-2 col-md-2">
      {props.resultCount && props.resultCount > 0 && props.totalCount && props.totalCount > 0 && (
        <p style={{ fontSize: '16px', fontWeight: 'bolder', color: '#08AB93' }}>
          Showing {props.totalCount} of {props.resultCount} reults
        </p>
      )}
      {/* <div className="row align-items-center">
        <div className="col d-flex">
        

          <div className="view-list-row">
            <div className="view-column">
              <Link href="#">
                <a
                  className="icon-view-two"
                  onClick={e => {
                    e.preventDefault();
                    handleGrid(e, 'products-col-two');
                  }}
                >
                  <span></span>
                  <span></span>
                </a>
              </Link>

              <Link href="#">
                <a
                  className="icon-view-three active"
                  onClick={e => {
                    e.preventDefault();
                    handleGrid(e, 'products-col-three');
                  }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </Link>

              <Link href="#">
                <a
                  className="icon-view-four active"
                  onClick={e => {
                    e.preventDefault();
                    handleGrid(e, 'products-col-four');
                  }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </a>
              </Link>

            </div>
          </div>
          <div className="col d-flex">
            

            <div className="products-ordering-list">
              <div className="cheflist">
               
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default FavoriteFilterOptions;
