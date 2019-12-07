import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import Link from 'next/link';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import ImgsViewer from 'react-images-viewer';
import { firebase } from '../../../config/firebaseConfig';
import * as gqlTag from '../../../common/gql';
import { toastMessage } from '../../../utils/Toast';
import Loader from '../../Common/loader';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../utils/checkEmptycondition';
import { getChefId, chefId } from '../../../utils/UserType';

// Create a root reference
const storageRef = firebase.storage().ref();

const updateAttachmentGQLTag = gqlTag.mutation.chef.updateAttachmentGQLTag;
const updateAttachmentGQL = gql`
  ${updateAttachmentGQLTag}
`;

const profileGQLTag = gqlTag.query.chef.profileByIdGQLTAG;
const profileGQL = gql`
  ${profileGQLTag}
`;

const attachmentSubscriptionGQLTag = gqlTag.subscription.chef.attachmentGQLTAG;
const attachmentSubscriptionGQL = gql`
  ${attachmentSubscriptionGQLTag}
`;

const UploadFile = props => {
  let attachmentSectionArray = ['LICENSE', 'CERTIFICATION', 'OTHERS', 'GALLERY'];
  // chef Id
  const [chefIdValue, setChefId] = useState();

  // image viewer
  const [Vieweropen, setViewerOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [srcURL, setSrcURL] = useState(0);

  // Documents set variables
  const [otherFiles, setOtherFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [licenseFiles, setLicenseFiles] = useState([]);
  const [certificateFiles, setCertificateFiles] = useState([]);

  // set image in image viewer
  const [currImage, setcurrImage] = useState(0);

  // loader
  const [saveLoader, setSaveLoader] = useState(false);
  const [licenseLoader, setLicenseLoader] = useState(false);
  const [certificateLoader, setCertificateLoader] = useState(false);
  const [othersLoader, setOthersLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);

  //for image carousel
  const [imageCarousel, setImageCarousel] = useState([]);

  const [getChefProfile, chefProfile] = useLazyQuery(profileGQL, {
    variables: { chefId: chefIdValue },
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  const [updateChefAttachment, { data }] = useMutation(updateAttachmentGQL, {
    onCompleted: data => {
      setSaveLoader(false);
    },
    onError: err => {
      toastMessage('error', err);
    },
  });

  const { chefAttachmentsSubs } = useSubscription(attachmentSubscriptionGQL, {
    variables: { chefId: chefIdValue },
    onSubscriptionData: res => {
      if (res.subscriptionData.data.chefAttachmentProfile) {
        getChefProfile();
      }
    },
  });

  useEffect(() => {
    // get chef id
    getChefId(chefId)
      .then(res => {
        setChefId(res);
        getChefProfile();
      })
      .catch(err => {});
  }, []);

  useEffect(() => {
    if (
      isObjectEmpty(chefProfile) &&
      hasProperty(chefProfile, 'data') &&
      isObjectEmpty(chefProfile.data) &&
      hasProperty(chefProfile.data, 'chefProfileByChefId') &&
      isObjectEmpty(chefProfile.data.chefProfileByChefId)
    ) {
      let profile = chefProfile.data.chefProfileByChefId;
      let attachementsLicense = profile.attachementsLicense
        ? JSON.parse(profile.attachementsLicense)
        : [];
      let attachementsCertification = profile.attachementsCertification
        ? JSON.parse(profile.attachementsCertification)
        : [];
      let attachementsOthers = profile.attachementsOthers
        ? JSON.parse(profile.attachementsOthers)
        : [];
      let attachementsGallery = profile.attachementsGallery
        ? JSON.parse(profile.attachementsGallery)
        : [];
      if (attachementsGallery.length != 0) {
        setImageFiles(attachementsGallery);

        let carouselObj = [];
        attachementsGallery.map(attachment => {
          carouselObj.push({
            src: attachment.url,
          });
        });

        setImageCarousel(carouselObj);
      }

      if (attachementsCertification.length != 0) {
        setCertificateFiles(attachementsCertification);
      }

      if (attachementsLicense.length != 0) {
        setLicenseFiles(attachementsLicense);
      }

      if (attachementsOthers.length != 0) {
        setOtherFiles(attachementsOthers);
      }
    }
  }, [chefProfile]);

  function removeItems(url, type) {
    let licenseArray = [],
      certificateArray = [],
      otherArray = [],
      imageArray = [],
      carouselImageArray = [];
    licenseArray = licenseArray.concat(licenseFiles);
    certificateArray = certificateArray.concat(certificateFiles);
    otherArray = otherArray.concat(otherFiles);
    imageArray = imageArray.concat(imageFiles);

    //remove license
    if (type == 'LICENSE') {
      licenseArray.forEach((data, i) => {
        if (data.url === url) {
          licenseArray.splice(i, 1);
        }
      });
      setLicenseFiles(licenseArray);
    }
    //remove  certificate
    if (type == 'CERTIFICATION') {
      certificateArray.forEach((data, i) => {
        if (data.url === url) {
          certificateArray.splice(i, 1);
        }
      });
      setCertificateFiles(certificateArray);
    }
    //remove others
    if (type == 'OTHERS') {
      otherArray.forEach((data, i) => {
        if (data.url === url) {
          otherArray.splice(i, 1);
        }
      });
      setOtherFiles(otherArray);
    }
    // remove images
    if (type == 'GALLERY') {
      imageArray.forEach((data, i) => {
        if (data.url === url) {
          imageArray.splice(i, 1);
        }
      });

      carouselImageArray = imageArray.map(({ url: src, ...data }) => ({ src, ...data }));
      setImageCarousel(carouselImageArray);
      setImageFiles(imageArray);
    }
  }

  function uploadItem(event, type) {
    let filesCount;
    let canUploadYn = false;
    if (type === 'GALLERY') {
      filesCount = imageFiles.length + event.target.files.length;
      if (filesCount > 10) {
        toastMessage('error', 'You can upload only 10 images');
      } else {
        canUploadYn = true;
      }
    } else if (type === 'CERTIFICATION' || type === 'LICENSE' || type === 'OTHERS') {
      filesCount =
        licenseFiles.length +
        otherFiles.length +
        certificateFiles.length +
        event.target.files.length;
      if (filesCount > 10) {
        toastMessage('error', 'License,Certificates and Others count should less than 10');
      } else {
        canUploadYn = true;
      }
    } else {
      canUploadYn = true;
    }

    if (canUploadYn == true) {
      if (type === 'LICENSE') {
        setLicenseLoader(true);
      } else if (type === 'CERTIFICATION') {
        setCertificateLoader(true);
      } else if (type === 'OTHERS') {
        setOthersLoader(true);
      } else if (type === 'GALLERY') {
        setImageLoader(true);
      }

      let files = Array.from(event.target.files);

      Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', ev => {
              let base64File = ev.target.result;

              // storage
              let newFile = {};
              newFile = {
                type: base64File.indexOf('data:image') >= 0 ? 'IMAGE' : 'DOCUMENT',
                url: base64File,
              };
              const randNo = Math.floor(Math.random() * 9000000000) + 1000000000
              const dateTime = new Date().getTime();
              // ref/chef_id/{CERITIFICATION/GALLERY/}/rand_datetime.format
            
              // const imageFileName = chefIdValue+ '/' + type + '/' + dateTime;
              const imageFileName = `${chefIdValue}/${type}/${dateTime}_${randNo}              `
              // console.log("imageFileName",imageFileName)
              firebase
                .storage()
                .ref()
                .child(`${chefIdValue}/${type}/${dateTime}_${randNo}`)
                .putString(newFile.url, 'data_url')
                .then(res => {
                  storageRef
                    .child(res.metadata.fullPath)
                    .getDownloadURL()
                    .then(url => {
                      newFile.url = url;
                      // license
                      if (type == 'LICENSE') {
                        setLicenseFiles(data => [...data, newFile]);
                        setLicenseLoader(false);
                      }

                      // certificate
                      if (type == 'CERTIFICATION') {
                        setCertificateFiles(data => [...data, newFile]);
                        setCertificateLoader(false);
                      }

                      // others
                      if (type == 'OTHERS') {
                        setOtherFiles(data => [...data, newFile]);
                        setOthersLoader(false);
                      }

                      // images
                      if (type == 'GALLERY') {
                        setImageFiles(data => [...data, newFile]);

                        let carouselObj = {
                          src: newFile.url,
                        };
                        setImageCarousel(data => [...data, carouselObj]);
                        setImageLoader(false);
                      }
                    });
                });

              resolve();
            });
            reader.addEventListener('error', reject);
            reader.readAsDataURL(file);
          });
        })
      )
        .then(base64Files => {})
        .catch(error => {
          console.error(error);
        });
    }
  }

  function save() {
    setSaveLoader(true);
    // changing license type an url in object to pAttachmentType,pAttachmentUrl
    let saveLicense = licenseFiles;
    saveLicense = saveLicense.map(({ type: pAttachmentType, ...data }) => ({
      pAttachmentType,
      ...data,
    }));
    saveLicense = saveLicense.map(({ url: pAttachmentUrl, ...data }) => ({
      pAttachmentUrl,
      ...data,
    }));

    // changing certificate type an url in object to pAttachmentType,pAttachmentUrl
    let saveCertificate = certificateFiles;
    saveCertificate = saveCertificate.map(({ type: pAttachmentType, ...data }) => ({
      pAttachmentType,
      ...data,
    }));
    saveCertificate = saveCertificate.map(({ url: pAttachmentUrl, ...data }) => ({
      pAttachmentUrl,
      ...data,
    }));

    // changing others type an url in object to pAttachmentType,pAttachmentUrl
    let saveOther = otherFiles;
    saveOther = saveOther.map(({ type: pAttachmentType, ...data }) => ({
      pAttachmentType,
      ...data,
    }));
    saveOther = saveOther.map(({ url: pAttachmentUrl, ...data }) => ({ pAttachmentUrl, ...data }));

    // changing image type an url in object to pAttachmentType,pAttachmentUrl
    let saveImage = imageFiles;
    saveImage = saveImage.map(({ type: pAttachmentType, ...data }) => ({
      pAttachmentType,
      ...data,
    }));
    saveImage = saveImage.map(({ url: pAttachmentUrl, ...data }) => ({ pAttachmentUrl, ...data }));

    attachmentSectionArray.map(attachmentSection => {
      let attachments = [];
      if (attachmentSection === 'LICENSE') {
        attachments = saveLicense;
      } else if (attachmentSection === 'CERTIFICATION') {
        attachments = saveCertificate;
      } else if (attachmentSection === 'OTHERS') {
        attachments = saveOther;
      } else if (attachmentSection === 'GALLERY') {
        attachments = saveImage;
      }

      attachments = JSON.stringify(attachments);

      updateChefAttachment({
        variables: {
          pChefId: chefIdValue,
          pChefAttachments: attachments,
          pAttachmentAreaSection: attachmentSection,
        },
      }).then(data => {
        if (attachmentSection === 'GALLERY') {
          toastMessage('success', 'Attachments uploaded successfully');
          setSaveLoader(false);
        }
      });
    });
  }
  function updateCurrentFetch(imageUrl) {
    setOpen(true);
    setcurrImage(imageFiles.indexOf(imageUrl));
  }
  function gotoPrevImg(index) {
    index = index - 1;
    setcurrImage(index);
  }

  function gotoNextImg(index) {
    index = index + 1;
    setcurrImage(index);
  }
  return (
    <div>
      <section className="products-collections-area ptb-60 ">
        {saveLoader && <Loader />}
        <div className="section-title">
          <h2>Upload</h2>
        </div>

        <form className="login-form">
          <div className="form-group">
            <div className="image-upload">
              <label> License (Image / Document) </label>
              {licenseLoader && <Loader />}
              <input
                type="file"
                multiple
                onChange={event => {
                  event.persist();
                  uploadItem(event, 'LICENSE');
                }}
                name="filename"
              />
            </div>
            {licenseFiles && licenseFiles.length > 0 ? (
              <div>
                {licenseFiles.map((licenseFile, index) => (
                  <div className="imageView" style={{ display: 'inline-block' }}>
                    {licenseFile.type === 'IMAGE' && (
                      <div className="container">
                        <i
                          onClick={() => {
                            removeItems(licenseFile.url, 'LICENSE');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <div className="imgResponsiveMax">
                          <img
                            className="imgResponsiveMax"
                            src={licenseFile.url}
                            alt="image"
                            onClick={() => {
                              setViewerOpen(true);
                              setSrcURL(licenseFile.url);
                            }}
                          />
                        </div>
                      </div>
                    )}
                    {licenseFile.type === 'DOCUMENT' && (
                      <div>
                        <i
                          onClick={() => {
                            removeItems(licenseFile.url, 'LICENSE');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <Link href={licenseFile.url}>
                          <a target="_blank">
                            <img
                              src={require('../../../images/mock-image/license.png')}
                              alt="image"
                            />
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div> No License</div>
            )}
            <br />
            <div className="image-upload">
              <label> Certificate (Image / Document) </label>
              {certificateLoader && <Loader />}
              <input
                type="file"
                multiple
                onChange={event => {
                  event.persist();
                  uploadItem(event, 'CERTIFICATION');
                }}
                name="filename"
              />
            </div>
            {certificateFiles && certificateFiles.length > 0 ? (
              <div>
                {certificateFiles.map(certificateFile => (
                  <div className="imageView" style={{ display: 'inline-block' }}>
                    {certificateFile.type === 'IMAGE' && (
                      <div className="container">
                        <i
                          onClick={() => {
                            removeItems(certificateFile.url, 'CERTIFICATION');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <img
                          src={certificateFile.url}
                          alt="image"
                          onClick={() => {
                            setViewerOpen(true);
                            setSrcURL(certificateFile.url);
                          }}
                        />
                      </div>
                    )}
                    {certificateFile.type === 'DOCUMENT' && (
                      <div>
                        <i
                          onClick={() => {
                            removeItems(certificateFile.url, 'CERTIFICATION');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <Link href={certificateFile.url}>
                          <a target="_blank">
                            <img
                              src={require('../../../images/mock-image/certificate.png')}
                              alt="image"
                            />
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div> No Certificates</div>
            )}
            <br />
            <div className="image-upload">
              <label> Others (Image / Document) </label>
              {othersLoader && <Loader />}
              <input
                type="file"
                multiple
                onChange={event => {
                  event.persist();
                  uploadItem(event, 'OTHERS');
                }}
                name="filename"
              />
            </div>
            {otherFiles && otherFiles.length > 0 ? (
              <div>
                {otherFiles.map(otherFile => (
                  <div className="imageView" style={{ display: 'inline-block' }}>
                    {otherFile.type === 'IMAGE' && (
                      <div className="container">
                        <i
                          onClick={() => {
                            removeItems(otherFile.url, 'OTHERS');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <img
                          src={otherFile.url}
                          alt="image"
                          onClick={() => {
                            setViewerOpen(true);
                            setSrcURL(otherFile.url);
                          }}
                        />
                      </div>
                    )}
                    {otherFile.type === 'DOCUMENT' && (
                      <div>
                        <i
                          onClick={() => {
                            removeItems(otherFile.url, 'OTHERS');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <Link href={otherFile.url}>
                          <a target="_blank">
                            <img
                              src={require('../../../images/mock-image/document.png')}
                              alt="image"
                            />
                          </a>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div> No Certificates</div>
            )}
            <br />
            {/* <div className="image-upload">
              <label> Gallery (Showcase your image gallery) </label>
              {imageLoader && <Loader />}
              <input
                type="file"
                multiple
                onChange={event => {
                  event.persist();
                  uploadItem(event, 'GALLERY');
                }}
                name="filename"
                accept="image/*"
              />
            </div>
            {imageFiles && imageFiles.length > 0 ? (
              <div>
                {imageFiles.map(imageFile => (
                  <div className="imageView" style={{ display: 'inline-block' }}>
                    {imageFile.type === 'IMAGE' && (
                      <div className="container">
                        <i
                          onClick={() => {
                            removeItems(imageFile.url, 'GALLERY');
                          }}
                          className="fa fa-times close"
                          aria-hidden="true"
                        ></i>
                        <div className="imgResponsiveMax">
                          <img
                            src={imageFile.url}
                            alt="image"
                            className="imgResponsiveMax"
                            onClick={() => {
                              // setViewerOpen(true);
                              updateCurrentFetch(imageFile);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div> No Images</div>
            )} */}
            <br />
          </div>

          <ImgsViewer
            imgs={[{ src: srcURL }]}
            isOpen={Vieweropen}
            onClose={() => {
              setViewerOpen(false);
            }}
          />
          <ImgsViewer
            imgs={imageCarousel}
            currImg={currImage}
            isOpen={open}
            onClickPrev={() => gotoPrevImg(currImage)}
            onClickNext={() => gotoNextImg(currImage)}
            onClose={() => {
              setOpen(false);
            }}
          />
        </form>
        <div className="container">
          <div className="saveButton">
            <button
              type="button"
              className="btn btn-primary"
              onClick={event => {
                event.persist();
                save();
              }}
            >
              Save
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default UploadFile;
