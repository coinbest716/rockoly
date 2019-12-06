/** @format */

import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import CommonStyles from '../../containers/common/commonStyles'
import CommonLabels from '../../containers/common/commonLabel'
import {themes} from '../../themes/themes'

export class PicNameField extends Component {
  constructor(props) {
    super()
    this.state = {
      data: {},
    }
  }
  componentWillMount() {
    if (this.props.fieldData) {
      this.setState({data: this.props.fieldData})
    }
  }

  onClickViewDetail = value => {
    if (this.props && this.props.history) {
      this.props.history.push({
        pathname: value.navigateTo,
        state: {
          uid: value.uid,
          screen: value.screen,
          extraId: value.extraId,
        },
      })
    }
  }

  render() {
    const {data} = this.state
    return (
      <div style={CommonStyles.nameField} onClick={() => this.onClickViewDetail(data)}>
        <img
          style={CommonStyles.imageStyle}
          alt={CommonLabels.ALTERNATE_PIC}
          src={data.picUrl ? data.picUrl : themes.default_user}
        />
        {data.name ? (
          <p style={CommonStyles.nameLinkStyle}>{data.name}</p>
        ) : (
          <p style={CommonStyles.nameStyle}>{'-'}</p>
        )}
      </div>
    )
  }
}

export default withRouter(PicNameField)
