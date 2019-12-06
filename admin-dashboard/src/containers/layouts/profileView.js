/** @format */

import React, {Component} from 'react'
import {connect} from 'react-redux'
import {message} from 'antd'
import {withApollo} from 'react-apollo'
import Styles from './styles'
import Strings from './labels'
import {getAdminProfile} from '../../actions/index'
import {GetValueFromLocal} from '../../utils/localStorage'

export class ProfileView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      profileData: {},
    }
  }
  componentWillMount() {
    GetValueFromLocal('uid')
      .then(async uid => {
        const {client} = this.props
        await this.props.getAdminProfile(client, uid)
      })
      .catch(err => {
        message.error(err)
      })
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.adminProfile) {
      this.setState({profileData: nxtprops.adminProfile})
    }
  }

  render() {
    const {profileData} = this.state
    return (
      <div style={Styles.profileView}>
        <img
          style={Styles.imageStyle}
          alt={Strings.ALTERNATE_PIC}
          src={
            profileData.adminPicId
              ? profileData.adminPicId
              : require('../../themes/images/user.png')
          }
        />
        <div style={Styles.mailStyle}>
          <p style={Styles.nameText}>{profileData.fullName ? profileData.fullName : '-'}</p>
          <p style={Styles.emailText}>{profileData.adminEmail ? profileData.adminEmail : '-'}</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {adminProfile, adminProfileLoading} = state.adminData
  return {
    adminProfile,
    adminProfileLoading,
  }
}

const mapDispatchToProps = {
  getAdminProfile,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ProfileView)
)
