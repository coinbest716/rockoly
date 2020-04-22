/** @format */

import React, {Component} from 'react'
import {Button, Divider, Rate, Card, Icon, message} from 'antd'
import {connect} from 'react-redux'
import _ from 'lodash'
import {withApollo} from 'react-apollo'
import Styles from './styles'
import {themes} from '../../themes/themes'
import CommonLabels from '../common/commonLabel'
import CommonStyles from '../common/commonStyles'
import {createdDate} from '../../utils/dateFormat'
import {availabilityTime} from '../../utils/timeFormat'
import {
  getChefDetails,
  // updateDishStatus,
  resetPassword,
  // updateCuisineStatus,
} from '../../actions/index'
import Loader from '../../components/loader/loader'
import SendMail from '../../components/sendMail/sendMail'
import {GetValueFromLocal} from '../../utils/localStorage'
import {getENVConfig} from '../../utils/common'
import {CONFIG} from '../../config/config'
import ListCuisineDishType from '../../components/listCuisineDishType/listCuisineDishType'
import PreviewImage from '../../components/previewImage/previewImage'
export class ChefDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {},
      uid: '',
      chefSpetialization: {},
      chefExtended: {},
      chefAttachment: [],
      chefReview: {},
      screen: '',
      extraId: '',
      chefDocument: [],
      token: '',
      cuisineTypes: [],
      dishTypes: [],
      attachementsCertification: [],
      certificateDucument: [],
      certificateImage: [],
      certicateAttachementsGallery: [],
      certicateGallery: [],
      attachementsGallery: [],
      workGallery: [],
      attachementsLicense: [],
      licenseDocument: [],
      licenseGallery: [],
      attachementsOthers: [],
      otherDocument: [],
      otherGallary: [],
    }
  }

  componentDidMount() {
    GetValueFromLocal('firebaseAuthToken')
      .then(async val => {
        await this.setState({token: val})
      })
      .catch(err => {
        message.error(err)
      })

    if (this.props && this.props.location && this.props.location.state) {
      this.setState(
        {
          uid: this.props.location.state.uid,
          screen: this.props.location.state.screen,
          extraId: this.props.location.state.extraId,
        },
        () => {
          const {client} = this.props
          this.props.getChefDetails(client, this.state.uid)
        }
      )
    }
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.chefDetails) {
      // if (
      //   (nxtprops.cuisineStatusUpate === 'success' &&
      //     this.props.cuisineStatusUpate !== nxtprops.cuisineStatusUpate) ||
      //   (nxtprops.disheStatusUpate === 'success' &&
      //     this.props.disheStatusUpate !== nxtprops.disheStatusUpate)
      // ) {
      //   const {client} = this.props
      //   this.props.getChefDetails(client, this.state.uid)
      // }

      this.setState({userData: nxtprops.chefDetails}, () => {
        //certificates
        if (this.state.userData && this.state.userData.attachementsCertification) {
          const data = JSON.parse(this.state.userData.attachementsCertification)
          this.splitImageDocument(data).then(values => {
            this.setState({certificateDucument: values.document})
            this.modifyData(values.image, 'certicateGallery', 'certicateAttachementsGallery')
          })
        }
        //Additional Service
        console.log('this.userdata', this.state.chefExtended)
        //work gallery
        if (this.state.userData && this.state.userData.attachementsGallery) {
          const data = JSON.parse(this.state.userData.attachementsGallery)
          this.modifyData(data, 'workGallery', 'attachementsGallery')
        }
        //licence
        if (this.state.userData && this.state.userData.attachementsLicense) {
          const data = JSON.parse(this.state.userData.attachementsLicense)
          this.splitImageDocument(data).then(values => {
            this.setState({licenseDocument: values.document})
            this.modifyData(values.image, 'licenseGallery', 'attachementsLicense')
          })
        }
        //Other attachments
        if (this.state.userData && this.state.userData.attachementsOthers) {
          const data = JSON.parse(this.state.userData.attachementsOthers)
          this.splitImageDocument(data).then(values => {
            this.setState({otherDocument: values.document})
            this.modifyData(values.image, 'otherGallary', 'attachementsOthers')
          })
        }

        if (this.state.userData.chefSpecializationProfilesByChefId) {
          this.setState({
            chefSpetialization: this.state.userData.chefSpecializationProfilesByChefId.nodes[0],
          })
        }
        if (this.state.userData.dishTypes && this.state.userData.dishTypes.nodes) {
          this.setState({
            dishTypes: this.state.userData.dishTypes.nodes,
          })
        }
        if (this.state.userData.cuisineTypes && this.state.userData.cuisineTypes.nodes) {
          const temp = this.state.userData.cuisineTypes.nodes
          const order = _.orderBy(temp, 'createdAt', 'desc')
          this.setState({cuisineTypes: order})
        }
        if (this.state.userData.chefProfileExtendedsByChefId) {
          this.setState({
            chefExtended: this.state.userData.chefProfileExtendedsByChefId.nodes[0],
          })
        }
        if (this.state.userData.reviewHistoriesByChefId) {
          this.setState({
            chefReview: this.state.userData.reviewHistoriesByChefId,
          })
        }
      })
    }
  }

  splitImageDocument = async data => {
    const image = []
    const doc = []
    await data.map(val => {
      if (val.type === 'IMAGE') {
        image.push(val)
      } else if (val.type === 'DOCUMENT') {
        doc.push(val.url)
      }
    })
    const temp = {
      image: image,
      document: doc,
    }
    return temp
  }

  modifyData = async (data, gallery, attachment) => {
    const tempGal = []
    const tempAttachment = []
    await data.map((val, index) => {
      const temp = {
        uid: index,
        url: val.url,
      }
      const tempGallery = {
        original: val.url,
        thumbnail: val.url,
      }
      tempGal.push(tempGallery)
      tempAttachment.push(temp)
    })

    this.setState({[gallery]: tempGal})
    this.setState({[attachment]: tempAttachment})
  }

  onClickBack() {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: this.state.screen,
        state: {
          bookingId: this.state.extraId,
        },
      })
    }
  }

  openInNewTab = link => {
    const url = _.startsWith(link, 'https://') ? link : 'https://' + link
    return window.open(url)
  }

  onClickUpdate = email => {
    if (email) {
      this.props.resetPassword(email, CommonLabels.USER)
    } else {
      message.error(CommonLabels.NO_MAIL)
    }
  }

  onClickEditProfile = () => {
    const editUrl =
      getENVConfig(CONFIG.EDIT_PROFILE_URL) +
      `?loggedInAs="Admin"&role="Chef"&id="${this.state.uid}"`
    console.log('editUrl', editUrl)
    window.open(editUrl)
  }

  // onClickApproveCuisine = (status, val) => {
  //   const data = {
  //     isAdminApprovedYn: status,
  //     cuisineTypeId: val,
  //   }
  //   const {client} = this.props
  //   this.props.updateCuisineStatus(data, client)
  //   this.setState({chefAttachment: [], chefDocument: []})
  // }

  // onClickApproveDish = (status, val) => {
  //   const data = {
  //     dishTypeId: val,
  //     isAdminApprovedYn: status,
  //   }
  //   const {client} = this.props
  //   this.props.updateDishStatus(data, client)
  //   this.setState({chefAttachment: [], chefDocument: []})
  // }

  renderPdf = val => {
    return (
      <div>
        {val.map(val => (
          <img
            style={Styles.pdfIconStyle}
            alt={CommonLabels.ALTERNATE_PIC}
            src={themes.pdf_icon}
            onClick={() => this.openInNewTab(val)}
          />
        ))}
      </div>
    )
  }

  render() {
    const {
      userData,
      chefExtended,
      chefReview,
      cuisineTypes,
      dishTypes,
      attachementsGallery,
      workGallery,
      certicateAttachementsGallery,
      certicateGallery,
      certificateDucument,
      licenseDocument,
      licenseGallery,
      attachementsLicense,
      attachementsOthers,
      otherGallary,
      otherDocument,
    } = this.state
    let additionalService = []
    let awards = ''
    let certificationType = []
    let complexity = []
    console.log('chefExtended', chefExtended)
    if (chefExtended && chefExtended.additionalServiceDetails) {
      additionalService = JSON.parse(chefExtended.additionalServiceDetails)
    }
    if (chefExtended && chefExtended.chefAwards) {
      awards = JSON.parse(chefExtended.chefAwards)
    }
    if (chefExtended && chefExtended.chefComplexity) {
      complexity = JSON.parse(chefExtended.chefComplexity)
    }
    if (
      chefExtended &&
      chefExtended.certificationsTypes &&
      chefExtended.certificationsTypes.nodes
    ) {
      certificationType = chefExtended.certificationsTypes.nodes
    }
    console.log('complexity', complexity)
    return (
      <div style={Styles.cardView}>
        <div className="userDetailCard">
          <div style={Styles.alignProfile}>
            <div style={Styles.profileView}>
              <img
                style={Styles.profileStyle}
                alt={CommonLabels.ALTERNATE_PIC}
                src={userData.chefPicId ? userData.chefPicId : themes.default_user}
              />
              <div style={Styles.nameView}>
                <p style={Styles.titleStyle}>{userData.fullName ? userData.fullName : '-'}</p>
                <p style={Styles.nameValue}>{userData.chefEmail ? userData.chefEmail : '-'}</p>
                <div style={Styles.starStyle}>
                  {userData.averageRating && chefReview.totalCount ? (
                    <div style={Styles.rateStyle}>
                      <Rate
                        allowHalf
                        disabled
                        value={userData.averageRating ? userData.averageRating : 0}
                      />
                      <p style={Styles.rateCoutStyle}>
                        {userData.averageRating ? userData.averageRating : '0'}
                      </p>
                      <div style={Styles.reveiwCoutStyle}>
                        ({chefReview.totalCount ? chefReview.totalCount : '0'}
                        {chefReview.totalCount > 1
                          ? CommonLabels.REVIEWS_LABEL
                          : CommonLabels.REVIEW_LABEL}
                        )
                      </div>
                    </div>
                  ) : (
                    <p style={Styles.noReviewStyle}>{CommonLabels.NO_REVIEWS}</p>
                  )}
                  {chefExtended.chefFacebookUrl && (
                    <img
                      style={Styles.iconStyle}
                      alt={CommonLabels.ALTERNATE_PIC}
                      src={themes.facebook_icon}
                      onClick={() => this.openInNewTab(chefExtended.chefFacebookUrl)}
                    />
                  )}
                  {chefExtended.chefTwitterUrl && (
                    <img
                      style={Styles.iconStyle}
                      alt={CommonLabels.ALTERNATE_PIC}
                      src={themes.twitter_icon}
                      onClick={() => this.openInNewTab(chefExtended.chefTwitterUrl)}
                    />
                  )}
                </div>
                {userData.chefEmail && (
                  <div style={Styles.passwordbuttonView}>
                    <Icon
                      type={CommonLabels.EDIT_ICON}
                      theme={CommonLabels.THEME}
                      style={Styles.editIconStyle}
                      onClick={() => this.onClickEditProfile()}
                    />
                    <Button
                      style={Styles.updatePasswordBotton}
                      onClick={() => this.onClickUpdate(userData.chefEmail)}>
                      {CommonLabels.RESET_PASSWORD}
                    </Button>
                    <SendMail emailId={userData.chefEmail} />
                    <Button style={Styles.deleteBotton} danger>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button style={Styles.backButtonStyle} onClick={() => this.onClickBack()}>
              {CommonLabels.BACK}
            </Button>
          </div>
          <Divider style={Styles.dividerStyle} />
          <div style={CommonStyles.loaderStyle}>
            <Loader loader={this.props.chefDetailsLoading} />
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.CONTACT_LABEL} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.LOCATION_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {chefExtended.chefLocationAddress ? chefExtended.chefLocationAddress : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.PHONE_NUMBER_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {userData.chefMobileNumber ? userData.chefMobileNumber : '-'}
                </p>
              </div>
            </Card>
          </div>

          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.PERSONAL_LABEL} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.DESCRIPTION_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {chefExtended.chefDesc ? chefExtended.chefDesc : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.REGISTERED_DATE_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {userData.createdAt ? createdDate(userData.createdAt) : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.DOB_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {userData.chefDob ? createdDate(userData.chefDob) : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.GENDER_LABEL}</p>
                <p style={Styles.valueStyle}>{userData.chefGender ? userData.chefGender : '-'}</p>
              </div>
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.DRIVIG_LICENSE_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {chefExtended.chefDrivingLicenseNo ? chefExtended.chefDrivingLicenseNo : '-'}
                </p>
              </div> */}
            </Card>
          </div>

          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.BUSINESS_LABEL} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BASE_RATE}</p>
                <div style={Styles.valueStyle}>
                  {'$'} {chefExtended.chefPricePerHour ? chefExtended.chefPricePerHour : '-'}{' '}
                  {CommonLabels.HOUR_LABEL}
                </div>
              </div>
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.GRATUITY}</p>
                <div style={Styles.valueStyle}>
                  {'$'} {chefExtended.chefGratuity ? chefExtended.chefGratuity : '-'}
                </div>
              </div> */}
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.NO_OF_GUESTS}</p>
                <div style={Styles.valueStyle}>
                  {CommonLabels.CHEF_COOK}{' '}
                  {chefExtended.noOfGuestsMin ? chefExtended.noOfGuestsMin : '-'} {'to '}
                  {chefExtended.noOfGuestsMax ? chefExtended.noOfGuestsMax : '-'}{' '}
                  {CommonLabels.MEMBERS}
                </div>
              </div>
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.ADDITIONAL_BASE_RATE}</p>
                <div style={Styles.valueStyle}>
                  {'$'} {chefExtended.noOfGuestsCanServe ? chefExtended.noOfGuestsCanServe : '-'}
                </div>
              </div> */}
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.DISCOUNT_FOR_GUEST}</p>
                <div style={Styles.valueStyle}>
                  {chefExtended.discount ? chefExtended.discount : '-'}
                  {'%'} {CommonLabels.FOR}{' '}
                  {chefExtended.personsCount ? chefExtended.personsCount : '-'}{' '}
                  {CommonLabels.PERSONS}
                </div>
              </div> */}
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>
                  {CommonLabels.CHEF_TRAVEL}{' '}
                  {chefExtended.chefAvailableAroundRadiusInValue
                    ? chefExtended.chefAvailableAroundRadiusInValue
                    : '-'}{' '}
                  {chefExtended.chefAvailableAroundRadiusInUnit
                    ? chefExtended.chefAvailableAroundRadiusInUnit
                    : '-'}{' '}
                  {CommonLabels.PROVIDE_SERVICE}
                </p>
              </div>
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.BUSSINESS_TIME_LABEL}</p>
                <div style={Styles.valueStyle}>
                  {chefExtended.chefBusinessHoursFromTime
                    ? availabilityTime(chefExtended.chefBusinessHoursFromTime)
                    : '-'}
                  {' - '}
                  {chefExtended.chefBusinessHoursToTime
                    ? availabilityTime(chefExtended.chefBusinessHoursToTime)
                    : '-'}
                </div>
              </div> */}
            </Card>
          </div>

          {/* Additional Service */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.ADDITIONAL_SERVICE} style={Styles.innerCardWidth}>
              <div
                style={
                  additionalService && additionalService.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.SERVICE_RATE}</p>
                {additionalService && additionalService.length > 0 ? (
                  additionalService.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.additionalServiceValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.name}
                        {':'}
                        {' $'}
                        {val.price}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
            </Card>
          </div>

          {/* Awards */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.AWARDS} style={Styles.innerCardWidth}>
              <div style={Styles.spetializationFieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.AWARDS_DES}</p>
                <div style={Styles.valueStyle}>{awards ? awards : '-'}</div>
              </div>
            </Card>
          </div>

          {/* Cuisine */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.SPECIALIZATION_LABEL} style={Styles.innerCardWidth}>
              <div
                style={
                  cuisineTypes && cuisineTypes.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.CUISINE_TYPE_LABEL}</p>
                {cuisineTypes && cuisineTypes.length > 0 ? (
                  cuisineTypes.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.spetializationValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.cusineTypeName}
                        {'.'}
                      </p>
                      {/* {val.isAdminApprovedYn === false && (
                        <Button
                          style={Styles.approveBotton}
                          onClick={() => this.onClickApproveCuisine(true, val.cuisineTypeId)}>
                          {CommonLabels.APPROVE}
                        </Button>
                      )}
                      <Button
                        style={CommonStyles.rejectBotton}
                        onClick={() => this.onClickApproveCuisine(false, val.cuisineTypeId)}>
                        {CommonLabels.REJECT}
                      </Button> */}
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
              <div
                style={
                  dishTypes && dishTypes.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.DISHES_SPECIALITY}</p>
                {dishTypes && dishTypes.length > 0 ? (
                  dishTypes.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.spetializationValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.dishTypeName}
                        {'.'}
                      </p>
                      {/* {val.isAdminApprovedYn === false && (
                        <Button
                          style={Styles.approveBotton}
                          onClick={() => this.onClickApproveCuisine(true, val.cuisineTypeId)}>
                          {CommonLabels.APPROVE}
                        </Button>
                      )}
                      <Button
                        style={CommonStyles.rejectBotton}
                        onClick={() => this.onClickApproveCuisine(false, val.cuisineTypeId)}>
                        {CommonLabels.REJECT}
                      </Button> */}
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
              {/* 
              <div
                style={
                  dishTypes && dishTypes.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.DISH_TYPE_LABEL}</p>
                {dishTypes && dishTypes.length > 0 ? (
                  dishTypes.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.spetializationValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.dishTypeName}
                        {'.'}
                      </p> */}
              {/* {val.isAdminApprovedYn === false && (
                        <Button
                          style={Styles.approveBotton}
                          onClick={() => this.onClickApproveDish(true, val.dishTypeId)}>
                          {CommonLabels.APPROVE}
                        </Button>
                      )}
                      <Button
                        style={CommonStyles.rejectBotton}
                        onClick={() => this.onClickApproveDish(false, val.dishTypeId)}>
                        {CommonLabels.REJECT}
                      </Button> */}
              {/* </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div> */}
              {/* <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.EXPERIANCE_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {chefExtended.chefExperience
                    ? `${chefExtended.chefExperience} ${
                        chefExtended.chefExperience > 1 ? 'Years' : 'Year'
                      }`
                    : '-'}
                </p>
              </div> */}
            </Card>
          </div>

          {/* Certification Types */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.CERTIFICATION_TYPE} style={Styles.innerCardWidth}>
              <div
                style={
                  certificationType && certificationType.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.CERTIFICATION_LIST}</p>
                {certificationType && certificationType.length > 0 ? (
                  certificationType.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.additionalServiceValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.certificateTypeName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
            </Card>
          </div>
          {/* complexity */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.COMPLEXITY} style={Styles.innerCardWidth}>
              {complexity && complexity.length > 0 ? (
                complexity.map((val, index) => (
                  <Card>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.COMPLEXITY_LEVEL}</p>
                      <div style={Styles.valueStyle}>
                        {val.complexcityLevel ? val.complexcityLevel : '-'}
                      </div>
                    </div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.DISHES}</p>
                      <div style={Styles.valueStyle}>{val.dishes ? val.dishes : '-'}</div>
                    </div>
                    <div style={Styles.fieldView}>
                      <p style={Styles.titleStyle}>{CommonLabels.NO_OF_ITEMS}</p>
                      <div style={Styles.valueStyle}>
                        {val.noOfItems.min ? val.noOfItems.min : '-'}
                        {' - '}
                        {val.noOfItems.max ? val.noOfItems.max : '-'}
                        {val.noOfItems.min && val.noOfItems.max && ' menu items'}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <p style={Styles.valueStyle}>{'-'}</p>
              )}
            </Card>
          </div>
          {/* certificates */}
          {((certicateAttachementsGallery &&
            certicateAttachementsGallery.length > 0 &&
            certicateGallery &&
            certicateGallery.length > 0) ||
            (certificateDucument && certificateDucument.length > 0)) && (
            <div style={Styles.innerCardView}>
              <Card title={CommonLabels.CERTIFICATE} style={Styles.innerCardWidth}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  {certicateAttachementsGallery &&
                    certicateAttachementsGallery.length > 0 &&
                    certicateGallery &&
                    certicateGallery.length > 0 && (
                      <PreviewImage
                        attachment={certicateAttachementsGallery}
                        gallery={certicateGallery}
                      />
                    )}
                  {certificateDucument &&
                    certificateDucument.length > 0 &&
                    this.renderPdf(certificateDucument)}
                </div>
              </Card>
            </div>
          )}
          {/* Licence */}
          {((licenseGallery &&
            licenseGallery.length > 0 &&
            attachementsLicense &&
            attachementsLicense.length > 0) ||
            (licenseDocument && licenseDocument.length > 0)) && (
            <div style={Styles.innerCardView}>
              <Card title={CommonLabels.LICENSE} style={Styles.innerCardWidth}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  {licenseGallery &&
                    licenseGallery.length > 0 &&
                    attachementsLicense &&
                    attachementsLicense.length > 0 && (
                      <PreviewImage attachment={attachementsLicense} gallery={licenseGallery} />
                    )}
                  {licenseDocument && licenseDocument.length > 0 && this.renderPdf(licenseDocument)}
                </div>
              </Card>
            </div>
          )}
          {/* Work gallery */}
          {attachementsGallery &&
            attachementsGallery.length > 0 &&
            workGallery &&
            workGallery.length > 0 && (
              <div style={Styles.innerCardView}>
                <Card title={CommonLabels.WORK_GALLERY_LABEL} style={Styles.innerCardWidth}>
                  <PreviewImage attachment={attachementsGallery} gallery={workGallery} />
                </Card>
              </div>
            )}
          {/* Other attachment */}
          {((attachementsOthers &&
            attachementsOthers.length > 0 &&
            otherGallary &&
            otherGallary.length > 0) ||
            (otherDocument && otherDocument.length > 0)) && (
            <div style={Styles.innerCardView}>
              <Card title={CommonLabels.OTHER_ATTACHMENT} style={Styles.innerCardWidth}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                  {attachementsOthers &&
                    attachementsOthers.length > 0 &&
                    otherGallary &&
                    otherGallary.length > 0 && (
                      <PreviewImage attachment={attachementsOthers} gallery={otherGallary} />
                    )}
                  {otherDocument && otherDocument.length > 0 && this.renderPdf(otherDocument)}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {chefDetails, chefDetailsLoading} = state.chefDetail
  const {resetpassword, resetpasswordLoading, resetpasswordError} = state.resetPassword
  // const {
  //   cuisineStatusUpate,
  //   cuisineStatusUpateLoading,
  //   cuisineStatusUpateError,
  // } = state.cuisineStatus
  // const {disheStatusUpate, disheStatusUpateLoading, disheStatusUpateError} = state.dishStatus
  return {
    chefDetails,
    chefDetailsLoading,
    resetpassword,
    resetpasswordLoading,
    resetpasswordError,
    // cuisineStatusUpateLoading,
    // cuisineStatusUpate,
    // cuisineStatusUpateError,
    // disheStatusUpate,
    // disheStatusUpateLoading,
    // disheStatusUpateError,
  }
}

const mapDispatchToProps = {
  getChefDetails,
  resetPassword,
  // updateCuisineStatus,
  // updateDishStatus,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChefDetail)
)
