/** @format */

import React, {Component} from 'react'
import {Button, Rate, Card} from 'antd'
import {connect} from 'react-redux'
import 'react-image-gallery/styles/css/image-gallery.css'
import {withApollo} from 'react-apollo'
import Styles from './styles'
import {themes} from '../../themes/themes'
import CommonLables from '../common/commonLabel'
import CommonStyles from '../common/commonStyles'
import {createdDate} from '../../utils/dateFormat'
import n from '../routes/routesNames'
import {getReviewRatingDetail} from '../../actions/index'
import Loader from '../../components/loader/loader'
export class ReviewDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reviewData: {},
      userData: {},
      rId: '',
      chefSpetialization: {},
      chefExtended: {},
      chefAttachment: [],
      chefReview: {},
      previewVisible: false,
      previewImage: '',
      gallery: [],
      galleryIndex: 0,
      screen: '',
    }
  }

  componentDidMount() {
    if (this.props && this.props.location && this.props.location.state) {
      this.setState(
        {
          rId: this.props.location.state.reviewId,
          screen: this.props.location.state.screen,
        },
        () => {
          const {client} = this.props
          this.props.getReviewRatingDetail(client, this.state.rId)
        }
      )
    }
  }

  componentWillReceiveProps(nxtprops) {
    if (nxtprops.reviewDetails) {
      this.setState({reviewData: nxtprops.reviewDetails}, () => {})
    }
  }

  onClickBack() {
    if (this.props && this.props.history) {
      if (this.state.screen === CommonLables.CHEFMANAGEMENT) {
        this.props.history.push({
          pathname: n.CHEFMANAGEMENT,
        })
      } else if (this.state.screen === CommonLables.BOOKINGHISTORY) {
        this.props.history.push({
          pathname: n.BOOKINGHISTORY,
        })
      } else if (this.state.screen === CommonLables.REVIEWSRATINGS) {
        this.props.history.push({
          pathname: n.REVIEWSRATINGS,
        })
      }
    }
  }

  render() {
    const {reviewData} = this.state
    console.log(' render reviewDatareviewData', reviewData)
    return (
      <div style={Styles.cardView}>
        <div className="userDetailCard">
          <div style={Styles.buttonView}>
            <Button style={Styles.backButtonStyle} onClick={() => this.onClickBack()}>
              {CommonLables.BACK}
            </Button>
          </div>
          <div style={CommonStyles.loaderStyle}>
            <Loader loader={this.props.reviewDetailsLoading} />
          </div>
          <div style={Styles.innerCardView}>
            <Card title={CommonLables.REVIEW_DETAILS} style={Styles.innerCardWidth}>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLables.REVIEW_DONE_BY}</p>
                <p style={Styles.valueStyle}>
                  {reviewData.isReviewedByCustomerYn &&
                    reviewData.isReviewedByCustomerYn === true && (
                      <img
                        style={CommonStyles.imageStyle}
                        alt={CommonLables.ALTERNATE_PIC}
                        src={
                          reviewData.customerProfileByCustomerId.customerPicId
                            ? reviewData.customerProfileByCustomerId.customerPicId
                            : themes.default_user
                        }
                      />
                    )}
                  {reviewData.isReviewedByChefYn && reviewData.isReviewedByChefYn === true && (
                    <img
                      style={CommonStyles.imageStyle}
                      alt={CommonLables.ALTERNATE_PIC}
                      src={
                        reviewData.customerProfileByCustomerId.chefPicId
                          ? reviewData.customerProfileByCustomerId.chefPicId
                          : themes.default_user
                      }
                    />
                  )}
                </p>
                <p style={Styles.commonmarginLeft}>
                  {reviewData.isReviewedByCustomerYn &&
                    reviewData.isReviewedByCustomerYn === true &&
                    reviewData.customerProfileByCustomerId.fullName}
                  {reviewData.isReviewedByChefYn &&
                    reviewData.isReviewedByChefYn === true &&
                    reviewData.chefProfileByChefId.fullName}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLables.REVIEW_DONE_FOR}</p>
                <p style={Styles.valueStyle}>
                  {reviewData.isReviewedByChefYn && reviewData.isReviewedByChefYn === true && (
                    <img
                      style={CommonStyles.imageStyle}
                      alt={CommonLables.ALTERNATE_PIC}
                      src={
                        reviewData.customerProfileByCustomerId.customerPicId
                          ? reviewData.customerProfileByCustomerId.customerPicId
                          : themes.default_user
                      }
                    />
                  )}
                  {reviewData.isReviewedByCustomerYn &&
                    reviewData.isReviewedByCustomerYn === true && (
                      <img
                        style={CommonStyles.imageStyle}
                        alt={CommonLables.ALTERNATE_PIC}
                        src={
                          reviewData.customerProfileByCustomerId.chefPicId
                            ? reviewData.customerProfileByCustomerId.chefPicId
                            : themes.default_user
                        }
                      />
                    )}
                </p>
                <p style={Styles.commonmarginLeft}>
                  {reviewData.isReviewedByChefYn &&
                    reviewData.isReviewedByChefYn === true &&
                    reviewData.customerProfileByCustomerId.fullName}
                  {reviewData.isReviewedByCustomerYn &&
                    reviewData.isReviewedByCustomerYn === true &&
                    reviewData.chefProfileByChefId.fullName}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLables.REVIEW_ON}</p>
                <p style={Styles.valueStyle}>
                  {reviewData.createdAt && createdDate(reviewData.createdAt)}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLables.REVIEW_DESCRIPTION}</p>
                <p style={Styles.valueStyle}>
                  {reviewData.reviewDesc ? reviewData.reviewDesc : '-'}
                </p>
              </div>
              <div style={Styles.fieldView}>
                <p style={Styles.titleStyle}>{CommonLables.REVIEW_RATING}</p>
                <p style={Styles.valueStyle}>
                  <Rate
                    allowHalf
                    disabled
                    value={reviewData.reviewPoint ? reviewData.reviewPoint : 0}
                  />
                </p>
                <p style={Styles.rateCoutStyle}>
                  {reviewData.reviewPoint ? reviewData.reviewPoint : '0'}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const {reviewDetails, reviewDetailsLoading} = state.reviewDetail
  return {
    reviewDetails,
    reviewDetailsLoading,
  }
}

const mapDispatchToProps = {
  getReviewRatingDetail,
}

export default withApollo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ReviewDetail)
)
