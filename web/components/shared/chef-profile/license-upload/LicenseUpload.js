import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import Link from 'next/link';
import { useLazyQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import ImgsViewer from 'react-images-viewer';
import { firebase } from '../../../../config/firebaseConfig';
import * as gqlTag from '../../../../common/gql';
import { toastMessage } from '../../../../utils/Toast';
import Loader from '../../../Common/loader';
import {
  isObjectEmpty,
  hasProperty,
  isArrayEmpty,
  isStringEmpty,
} from '../../../../utils/checkEmptycondition';
import { getChefId, chefId } from '../../../../utils/UserType';

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

const LicenseUpload = props => {
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

      if (attachementsLicense.length != 0) {
        setLicenseFiles(attachementsLicense);
      }
    }
  }, [chefProfile]);

  function removeItems(url, type) {
    let licenseArray = [];
    licenseArray = licenseArray.concat(licenseFiles);

    //remove license
    if (type == 'LICENSE') {
      licenseArray.forEach((data, i) => {
        if (data.url === url) {
          licenseArray.splice(i, 1);
        }
      });
      setLicenseFiles(licenseArray);
    }
  }

  function uploadItem(event, type) {
    let filesCount;
    let canUploadYn = false;
    if (type === 'LICENSE') {
      filesCount = licenseFiles.length + event.target.files.length;
      if (filesCount > 3) {
        toastMessage('error', 'License count should less than 3');
      } else {
        canUploadYn = true;
      }
    } else {
      canUploadYn = true;
    }

    if (canUploadYn == true) {
      if (type === 'LICENSE') {
        setLicenseLoader(true);
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
              const randNo = Math.floor(Math.random() * 9000000000) + 1000000000;
              const dateTime = new Date().getTime();
              // ref/chef_id/{CERITIFICATION/GALLERY/}/rand_datetime.format

              // const imageFileName = chefIdValue+ '/' + type + '/' + dateTime;
              const imageFileName = `${chefIdValue}/${type}/${dateTime}_${randNo}              `;
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

    attachmentSectionArray.map(attachmentSection => {
      let attachments = [];
      if (attachmentSection === 'LICENSE') {
        attachments = saveLicense;
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

  return (
    <div>
      <section className="products-collections-area ptb-60 ">
        {saveLoader && <Loader />}
        <div className="section-title">
          <h2>License Upload</h2>
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
                        <div className="">
                          <img
                            // className="imgResponsiveMax"
                            id="license-image-view"
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
                              src={require('../../../../images/mock-image/license.png')}
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
          </div>
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
export default LicenseUpload;
