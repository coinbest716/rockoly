import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import * as gqlTag from '../../../../../common/gql';
import { certifications } from '../../const/CertificationsData';
import * as util from '../../../../../utils/checkEmptycondition';
import { toastMessage, renderError, success, error } from '../../../../../utils/Toast';

const certificationGqlTag = gqlTag.query.master.allCertificateTypeMastersGQLTAG;

const CERTIFICATION = gql`
  ${certificationGqlTag}
`;

const Certifications = (props) => {
  
  let sampleArray = [];
  const [certificationData, setCertificationData] = useState([]);
  const [savedcertifications, setSavedCertifications] = useState([]);
  const [isvaluePresent, setIsValuePresent] = useState([]);

  const [getCertificationData, certificationDataArray] = useLazyQuery(CERTIFICATION, {
    fetchPolicy: 'network-only',
    onError: err => {
      toastMessage('renderError', err);
    },
  });

  useEffect(() => {
    getCertificationData();
  }, []);

  useEffect(() => {
    setSavedCertifications(props.savedcertifications)
  }, [props.savedcertifications])

  useEffect(() => {
    if (util.isObjectEmpty(certificationDataArray) &&
      util.hasProperty(certificationDataArray, 'data') &&
      util.isObjectEmpty(certificationDataArray.data) &&
      util.hasProperty(certificationDataArray.data, 'allCertificateTypeMasters') &&
      util.isObjectEmpty(certificationDataArray.data.allCertificateTypeMasters) &&
      util.hasProperty(certificationDataArray.data.allCertificateTypeMasters, 'nodes') &&
      util.isArrayEmpty(certificationDataArray.data.allCertificateTypeMasters.nodes)
    ) {
      let data = certificationDataArray.data.allCertificateTypeMasters.nodes;

      let certificateObj = {}, storeDate = [], checkBoxvalue = [];
     
      if (data.length > 0) {
        data.map((certificate) => {

          let isValuePresenet = savedcertifications.includes(certificate.certificateTypeId);
          checkBoxvalue.push(isValuePresenet)

          certificateObj = {
            label: certificate.certificateTypeName,
            value: certificate.certificateTypeId
          }

          storeDate.push(certificateObj)
        })
        setCertificationData(storeDate);
        setIsValuePresent(checkBoxvalue);
      } else {
        setCertificationData([])
      }

    }
  }, [certificationDataArray, savedcertifications])

  function onSelectCheckbox(label, type, index) {
    
    let deleteArray = isvaluePresent;
    deleteArray[index] = !isvaluePresent[index] 
    setIsValuePresent(deleteArray)
   
    deleteArray.map((res,index) =>{
      if(res){
        sampleArray.push(certificationData[index].value)
      }
    })
    if (props.uploadingData) {
      props.uploadingData(sampleArray, 'certificates')
    }
  }

  try {
    return (
      <section className="products-collections-area ptb-6 ProfileSetup">
        <h4>Certifications</h4>
        <div className="container">
          {certificationData &&
            certificationData.map((res, index) => {
              return (
                <div className="row" id="availabilityRow">
                  <div>
                    <div className="buy-checkbox-btn" id="checkBoxView">
                      <div className="item">
                        <input
                          className="inp-cbx"
                          id={res.value}
                          type="checkbox"
                          checked={
                            isvaluePresent[index]
                          }
                          onChange={event => {
                            onSelectCheckbox(res.value, 'certificate', index)
                          }}
                        />
                        <label className="cbx"
                          htmlFor={res.value}
                        >
                          <span>
                            <svg width="12px" height="10px" viewBox="0 0 12 10">
                              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                            </svg>
                          </span>
                          <span>{res.label}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}

        </div>
      </section>
    )
  } catch (error) {
    console.log("error", error)
  }
}

export default Certifications;