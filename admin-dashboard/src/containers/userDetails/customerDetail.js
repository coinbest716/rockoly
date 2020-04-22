/** @format */

import React, {Component} from 'react'
import {Button, Divider, Card, message, Rate, Icon} from 'antd'
import {connect} from 'react-redux'
import {withApollo} from 'react-apollo'
import Styles from './styles'
import {themes} from '../../themes/themes'
import CommonLabels from '../common/commonLabel'
import {createdDate} from '../../utils/dateFormat'
import {CONFIG} from '../../config/config'
import {getENVConfig} from '../../utils/common'
import {getCustomerDetails, resetPassword} from '../../actions/index'
import Loader from '../../components/loader/loader'
import CommonStyles from '../common/commonStyles'
import SendMail from '../../components/sendMail/sendMail'

export class CustomerDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userData: {},
      uid: '',
      screen: '',
      extendedProfile: {},
      customerPreference: {},
    }
  }

  componentDidMount() {
    if (this.props && this.props.location && this.props.location.state) {
      this.setState(
        {
          uid: this.props.location.state.uid,
          screen: this.props.location.state.screen,
          extraId: this.props.location.state.extraId,
        },
        () => {
          const {client} = this.props
          this.props.getCustomerDetails(client, this.state.uid)
        }
      )
    }
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.customerDetails) {
      this.setState({userData: nxtprops.customerDetails}, () => {
        if (
          this.state.userData &&
          this.state.userData.customerProfileExtendedsByCustomerId &&
          this.state.userData.customerProfileExtendedsByCustomerId.nodes &&
          this.state.userData.customerProfileExtendedsByCustomerId.nodes[0]
        ) {
          this.setState({
            extendedProfile: this.state.userData.customerProfileExtendedsByCustomerId.nodes[0],
          })
        }
        if (
          this.state.userData &&
          this.state.userData.customerPreferenceProfilesByCustomerId &&
          this.state.userData.customerPreferenceProfilesByCustomerId.nodes &&
          this.state.userData.customerPreferenceProfilesByCustomerId.nodes[0]
        ) {
          this.setState({
            customerPreference: this.state.userData.customerPreferenceProfilesByCustomerId.nodes[0],
          })
        }
      })
    }
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
      `?loggedInAs="Admin"&role="Customer"&id="${this.state.uid}"`
    console.log('editUrl', editUrl)
    window.open(editUrl)
  }

  render() {
    const {userData, extendedProfile, customerPreference} = this.state
    let allergyTypes = []
    let dietaryType = []
    let kitchenEquipment = []

    console.log('customerPreference', customerPreference)
    if (
      customerPreference &&
      customerPreference.allergyTypes &&
      customerPreference.allergyTypes.nodes
    ) {
      allergyTypes = customerPreference.allergyTypes.nodes
    }
    if (
      customerPreference &&
      customerPreference.dietaryRestrictionsTypes &&
      customerPreference.dietaryRestrictionsTypes.nodes
    ) {
      dietaryType = customerPreference.dietaryRestrictionsTypes.nodes
    }
    if (
      customerPreference &&
      customerPreference.kitchenEquipmentTypes &&
      customerPreference.kitchenEquipmentTypes.nodes
    ) {
      kitchenEquipment = customerPreference.kitchenEquipmentTypes.nodes
    }
    return (
      <div style={Styles.cardView}>
        <div className="userDetailCard">
          <div style={Styles.alignProfile}>
            <div style={Styles.profileView}>
              <img
                style={Styles.profileStyle}
                alt={CommonLabels.ALTERNATE_PIC}
                src={userData.customerPicId ? userData.customerPicId : themes.default_user}
              />
              <div style={Styles.nameView}>
                <p style={Styles.titleStyle}>{userData.fullName ? userData.fullName : '-'}</p>
                <p style={Styles.nameValue}>
                  {userData.customerEmail ? userData.customerEmail : '-'}
                </p>
                <div style={Styles.starStyle}>
                  {userData.averageRating && userData.totalReviewCount ? (
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
                        ({userData.totalReviewCount ? userData.totalReviewCount : '0'}
                        {userData.totalReviewCount > 1
                          ? CommonLabels.REVIEWS_LABEL
                          : CommonLabels.REVIEW_LABEL}
                        )
                      </div>
                    </div>
                  ) : (
                    <p style={Styles.noReviewStyle}>{CommonLabels.NO_REVIEWS}</p>
                  )}
                </div>
                {userData.customerEmail && (
                  <div style={Styles.passwordbuttonView}>
                    <Icon
                      type={CommonLabels.EDIT_ICON}
                      theme={CommonLabels.THEME}
                      style={Styles.editIconStyle}
                      onClick={() => this.onClickEditProfile()}
                    />
                    <Button
                      style={Styles.updatePasswordBotton}
                      onClick={() => this.onClickUpdate(userData.customerEmail)}>
                      {CommonLabels.RESET_PASSWORD}
                    </Button>
                    <SendMail emailId={userData.customerEmail} />
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
            <Loader loader={this.props.customerDetailsLoading} />
          </div>

          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.CONTACT_LABEL} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.PHONE_NUMBER_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {userData.customerMobileNumber ? userData.customerMobileNumber : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.LOCATION_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {extendedProfile.customerLocationAddress
                    ? extendedProfile.customerLocationAddress
                    : '-'}
                </p>
              </div>
            </Card>
          </div>

          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.PERSONAL_LABEL} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.REGISTERED_DATE_LABEL}</p>
                <p style={Styles.valueStyle}>{createdDate(userData.createdAt)}</p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.GENDER_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {userData.customerGender ? userData.customerGender : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLabels.DOB_LABEL}</p>
                <p style={Styles.valueStyle}>
                  {userData.customerDob ? createdDate(userData.customerDob) : '-'}
                </p>
              </div>
            </Card>
          </div>

          {/* Allergy Types */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.ALLERGY_TYPE} style={Styles.innerCardWidth}>
              <div
                style={
                  allergyTypes && allergyTypes.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.ALLERGY_LIST}</p>
                {allergyTypes && allergyTypes.length > 0 ? (
                  allergyTypes.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.additionalServiceValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.allergyTypeName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
            </Card>
          </div>
          {/* Dietary Types */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.DIETARY_TYPE} style={Styles.innerCardWidth}>
              <div
                style={
                  dietaryType && dietaryType.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.DIETARY_LIST}</p>
                {dietaryType && dietaryType.length > 0 ? (
                  dietaryType.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.additionalServiceValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.dietaryRestrictionsTypeName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
            </Card>
          </div>
          {/* Kitchen Types */}
          <div style={Styles.innerCardView}>
            <Card title={CommonLabels.KITCHEN_TYPE} style={Styles.innerCardWidth}>
              <div
                style={
                  kitchenEquipment && kitchenEquipment.length > 0
                    ? Styles.spetializationFieldView
                    : Styles.fieldView
                }>
                <p style={Styles.titleStyle}>{CommonLabels.KITCHEN_EQUIPMENT}</p>
                {kitchenEquipment && kitchenEquipment.length > 0 ? (
                  kitchenEquipment.map((val, index) => (
                    <div style={Styles.dishView}>
                      <p style={Styles.additionalServiceValueStyle}>
                        {index + 1}
                        {'.'}
                        {val.kitchenEquipmentTypeName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={Styles.valueStyle}>{'-'}</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {customerDetails, customerDetailsLoading} = state.customerDetail
  const {resetpassword, resetpasswordLoading, resetpasswordError} = state.resetPassword
  return {
    customerDetails,
    customerDetailsLoading,
    resetpassword,
    resetpasswordLoading,
    resetpasswordError,
  }
}

const mapDispatchToProps = {
  getCustomerDetails,
  resetPassword,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomerDetail)
)
