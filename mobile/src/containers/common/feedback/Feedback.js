/** @format */

import React, {Component} from 'react'
import {View, Text, TextInput, Alert, ScrollView, Platform, TouchableOpacity} from 'react-native'
import StarRating from 'react-native-star-rating'
// import KeyboardSpacer from 'react-native-keyboard-spacer'
// import {TouchableOpacity} from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import {Textarea} from 'native-base'
import {Theme} from '@theme'
import {CommonButton, Header, Spinner} from '@components'
import styles from './styles'
import {AuthContext} from '@services'
import FeedbackService from '../../../services/FeedbackService'
import {Languages} from '@translations'

const chefCompliment = ['Professional', 'Expertise', 'Quality Service']
const customerCompliment = ['Professional', 'Expertise', 'Quality Service']

export default class Feedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      review: '',
      starCount: 2,
      compliment: [],
      reviewDesc: '',
      role: '',
      isLoading: false,
      bookingDetail: {},
    }
  }

  // onTypeCompliment = value => {
  //   const {compliment} = this.state
  //   this.setState({
  //     review: value,
  //   })
  //   const str = value.split(',')
  //   if (str.length === 2) {
  //     const temp = compliment
  //     temp.push(str[0])
  //     this.setState({
  //       review: '',
  //       compliment: temp,
  //     })
  //   }
  // }

  // onBlurchange() {
  //   const {review, compliment} = this.state
  //   if (review !== '') {
  //     const temp = compliment
  //     temp.push(review)
  //     this.setState({
  //       review: '',
  //       compliment: temp,
  //     })
  //   }
  // }

  componentDidMount() {
    const {userRole, isLoggedIn, currentUser} = this.context
    const {navigation} = this.props
    if (isLoggedIn === true) {
      if (userRole !== '' && userRole !== undefined && userRole !== null) {
        if (userRole === 'CHEF') {
          this.setState({
            compliment: chefCompliment,
            role: userRole,
          })
        } else if (userRole === 'CUSTOMER') {
          this.setState({
            compliment: customerCompliment,
            role: userRole,
          })
        }
      }
      if (navigation.state.params !== undefined && navigation.state.params !== {}) {
        const {params} = navigation.state
        if (params.bookingDetail) {
          this.setState(
            {
              bookingDetail: params.bookingDetail,
            },
            () => {}
          )
        }
      }
    }
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    })
  }

  onSelectCompliment(val) {
    Alert.alert(
      'Confirmation',
      'Are you sure want to remove this Compliment?',
      [
        {
          text: 'Ok',
          onPress: () => this.deleteCompliment(val),
          style: 'cancel',
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: false}
    )
  }

  onReview = value => {
    this.setState({
      reviewDesc: value,
    })
  }

  onSubmit = () => {
    const {navigation} = this.props
    const {starCount, reviewDesc, compliment, role, bookingDetail} = this.state
    if (navigation.state.params !== undefined && navigation.state.params !== {}) {
      const {params} = navigation.state
      if (params.bookingHistId) {
        const variables = {
          reviewPoint: starCount,
          reviewDesc,
          reviewComplaintsDesc: JSON.stringify(compliment),
          chefId: bookingDetail.chefId,
          customerId: bookingDetail.customerId,
          isReviewedByChefYn: role === 'CHEF',
          isReviewedByCustomerYn: role === 'CUSTOMER',
          reviewRefTablePkId: params.bookingHistId,
          reviewRefTableName: 'chef_booking_history',
        }
        this.setState({
          isLoading: true,
        })
        FeedbackService.giveFeedback(variables)
          .then(data => {
            this.setState({
              isLoading: false,
            })
            navigation.goBack()
          })
          .catch(err => {
            this.setState({
              isLoading: false,
            })
          })
      }
    }
  }

  deleteCompliment(value) {
    const {compliment} = this.state
    const temp = compliment
    const index = temp.indexOf(value)

    if (index > -1) {
      temp.splice(index, 1)
      this.setState({
        compliment: temp,
      })
    }
  }

  render() {
    const {review, bookingDetail, role, starCount, compliment, reviewDesc, isLoading} = this.state
    let userData
    let fullName
    if (bookingDetail !== null && bookingDetail !== undefined && bookingDetail !== {}) {
      if (role === 'CHEF') {
        userData = bookingDetail.customerProfileByCustomerId
        if (userData.fullName) {
          fullName = userData.fullName
        }
      } else if (role === 'CUSTOMER') {
        userData = bookingDetail.chefProfileByChefId
        if (userData.fullName) {
          fullName = userData.fullName
        }
      }
    }
    if (isLoading) {
      return <Spinner mode="full" />
    }
    return (
      <View style={styles.mainView}>
        <Header showBack title={Languages.feedback.title} />
        <ScrollView>
          <View style={styles.nameView}>
            <Text style={styles.nameText}>{fullName}</Text>
          </View>
          <View style={styles.ratingView}>
            <StarRating
              disabled={false}
              halfStarEnabled
              maxStars={5}
              rating={starCount}
              starSize={40}
              fullStarColor={Theme.Colors.primary}
              starStyle={styles.starSpacing}
              selectedStar={rating => this.onStarRatingPress(rating)}
            />
          </View>
          <View style={styles.labelView}>
            <Text style={styles.label}>{Languages.feedback.label.compliment}</Text>
            {role === 'CUSTOMER' ? (
              <View style={styles.tagView}>
                {compliment && compliment.length > 0
                  ? compliment.map(val => {
                      // if (
                      //   val === 'Professional' ||
                      //   val === 'Expertise' ||
                      //   val === 'Quality Service'
                      // ) {
                      return (
                        <View style={styles.tagButton}>
                          <Text style={styles.review}>{val}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              this.onSelectCompliment(val)
                            }}>
                            <Icon name="times-circle" style={styles.closeIcon} size={15} />
                          </TouchableOpacity>
                        </View>
                      )
                      // }
                      // return (
                      //   <View style={styles.noTagButton}>
                      //     <Text style={styles.review}>{val}</Text>
                      //     <TouchableOpacity
                      //       onPress={() => {
                      //         this.onSelectCompliment(val)
                      //       }}>
                      //       <Icon name="times-circle" style={styles.closeIcon} size={15} />
                      //     </TouchableOpacity>
                      //   </View>
                      // )
                    })
                  : null}
              </View>
            ) : null}
          </View>
          {/* <View style={styles.inputView}>
              <TextInput
                underlineColorAndroid="transparent"
                placeholder="Type your Compliment here"
                onChangeText={text => this.onTypeCompliment(text)}
                onBlur={text => this.onBlurchange(text)}
                value={review}
                textAlign="center"
                style={styles.reviewStyle}
              />
            </View> */}
          <View style={styles.inputView}>
            <Textarea
              style={styles.descriptionStyle}
              placeholder={Languages.feedback.placeholders.review}
              placeholderTextColor="gray"
              underlineColorAndroid="transparent"
              value={reviewDesc}
              onChangeText={text => this.onReview(text)}
            />
          </View>
          {/* <ButtonIndex text={Languages.Submit} containerStyle={styles.submitBtn} /> */}
          <CommonButton
            containerStyle={styles.submitBtn}
            btnText={Languages.feedback.label.submit}
            onPress={this.onSubmit}
          />
          {/* {Platform.OS === 'ios' && <KeyboardSpacer />} */}
        </ScrollView>
      </View>
    )
  }
}

Feedback.contextType = AuthContext
