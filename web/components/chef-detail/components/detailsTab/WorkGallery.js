import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ImgsViewer from 'react-images-viewer';
import * as util from '../../../../utils/checkEmptycondition';
import { toastMessage } from '../../../../utils/Toast';

let URLOfImages = [],
  imageUrl = {},
  count = 0,
  imageCarouselSrcToDisplay = [];

const WorkGallery = props => {
  const [currImage, setcurrImage] = useState(0);
  const [open, setOpen] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);
  const [CarouselDisplay, setCarouselDisplay] = useState([]);

  useEffect(() => {
    URLOfImages = [];
    imageCarouselSrcToDisplay = [];
    if (
      props.chefDetails &&
      util.hasProperty(props.chefDetails, 'chefAttachmentProfilesByChefId') &&
      util.hasProperty(props.chefDetails.chefAttachmentProfilesByChefId, 'nodes') &&
      util.isArrayEmpty(props.chefDetails.chefAttachmentProfilesByChefId.nodes)
    ) {
      props.chefDetails.chefAttachmentProfilesByChefId.nodes.map(node => {
        if (node.chefAttachmentType === 'IMAGE' && node.chefAttachmentsAreaSection === 'GALLERY') {
          imageUrl = {
            src: node.chefAttachmentUrl,
          };
          URLOfImages.push(node.chefAttachmentUrl);
          imageCarouselSrcToDisplay.push(imageUrl);
        }
      });
      setImageGallery(URLOfImages);
      setCarouselDisplay(imageCarouselSrcToDisplay);
    }
  }, [props]);

  function setImageCarouselValue(imageArrayURL) {
    setOpen(true);
    setcurrImage(imageGallery.indexOf(imageArrayURL));
  }
  function gotoPrevImg(index) {
    index = index - 1;
    setcurrImage(index);
  }

  function gotoNextImg(index) {
    index = index + 1;
    setcurrImage(index);
  }
  function onStateEmpty() {
    setOpen(false);
  }
  try {
    return (
      <div
        className="products-details-tab-content chefDetail container"
        style={{ paddingBottom: '3%' }}
      >
        {props.chefDetails &&
          util.hasProperty(props.chefDetails, 'chefAttachmentProfilesByChefId') &&
          util.hasProperty(props.chefDetails.chefAttachmentProfilesByChefId, 'nodes') &&
          props.chefDetails.chefAttachmentProfilesByChefId.nodes.map(node => {
            if (
              node.chefAttachmentType === 'IMAGE' &&
              node.chefAttachmentsAreaSection === 'GALLERY'
            ) {
              return (
                <img
                  className="imgView"
                  style={{ cursor: 'pointer' }}
                  src={node.chefAttachmentUrl}
                  onClick={() => {
                    setImageCarouselValue(node.chefAttachmentUrl);
                  }}
                />
              );
            }
          })}
        {imageGallery.length === 0 && (
          <div>
            <h5 style={{ textAlign: 'center', color: '#08AB93', fontweight: 'bolder' }}>
              No Data!
            </h5>
            {/* <p>Chef doesn't upload and images</p> */}
          </div>
        )}
        {/* <h5 className="hclass">Document Gallery</h5>
        {props.chefDetails &&
          util.hasProperty(props.chefDetails, 'chefAttachmentProfilesByChefId') &&
          util.hasProperty(props.chefDetails.chefAttachmentProfilesByChefId, 'nodes') &&
          props.chefDetails.chefAttachmentProfilesByChefId.nodes.map(node => {
            if (node.chefAttachmentType === 'DOCUMENT') {
              return (
                <div style={{ display: 'inline-block' }}>
                  <Link href={node.chefAttachmentUrl}>
                    <a target="_blank">
                      <img
                        className="docView"
                        src={require('../../../../images/mock-image/pdf.png')}
                      />
                    </a>
                  </Link>
                </div>
              );
            }
          })} */}
        {/* {console.log("value",currImage)} */}
        <ImgsViewer
          imgs={CarouselDisplay}
          currImg={currImage}
          isOpen={open}
          onClickPrev={() => gotoPrevImg(currImage)}
          onClickNext={() => gotoNextImg(currImage)}
          onClose={() => {
            onStateEmpty();
          }}
        />
      </div>
    );
  } catch (error) {
    const errorMessage = error.message;
    toastMessage('renderError', errorMessage);
  }
};
export default WorkGallery;
