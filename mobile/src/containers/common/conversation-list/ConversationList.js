/** @format */

import React, {PureComponent} from 'react'
import {ScrollView, View, TouchableOpacity, Image} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import moment from 'moment'
import {Header, CommonButton, Spinner, CommonList} from '@components'
import {
  AuthContext,
  BookingNotesService,
  BOOKING_NOTES,
  COMMON_LIST_NAME,
  CommonService,
} from '@services'
import {GMTToLocal, DATE_TYPE, displayDateFormat} from '@utils'
import {Theme} from '@theme'
import {Images} from '@images'
import styles from './styles'
import {RouteNames} from '@navigation'

const data = [
  {
    pic: Images.common.defaultAvatar,
    name: 'Nazziya',
    date: moment(new Date()).fromNow(),
    message: 'Requesting a boooking',
  },
  {
    pic: Images.common.defaultAvatar,
    name: 'Hariharan',
    date: moment(new Date()).fromNow(),
    message: 'Requesting a boooking',
  },
  {
    pic: Images.common.defaultAvatar,
    name: 'Boopathi',
    date: moment(new Date()).fromNow(),
    message: 'Requesting a boooking',
  },
  {
    pic: Images.common.defaultAvatar,
    name: 'Punitha',
    date: moment(new Date()).fromNow(),
    message: 'Requesting a boooking',
  },
  {
    pic: Images.common.defaultAvatar,
    name: 'Janani',
    date: moment(new Date()).fromNow(),
    message: 'Requesting a boooking',
  },
]

export default class ConversationList extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      first: 5,
      offset: 0,
      isFetching: false,
      conversation: [],
      isFetchingMore: false,
      totalCount: 0,
      canLoadMore: false,
    }
  }

  componentDidMount() {
    const {isLoggedIn} = this.context
    BookingNotesService.on(BOOKING_NOTES.CONVERSATION_LIST, this.setConversationList)
    BookingNotesService.on(BOOKING_NOTES.BOOKING_NOTES_DETAIL_SUBS, this.fetchConversationListCount)
    if (isLoggedIn === true) {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          this.fetchConversationListCount()
        }
      )
    }
  }

  componentWillUnmount() {
    BookingNotesService.off(BOOKING_NOTES.CONVERSATION_LIST, this.setConversationList)
    BookingNotesService.off(
      BOOKING_NOTES.BOOKING_NOTES_DETAIL_SUBS,
      this.fetchConversationListCount
    )
  }

  fetchConversationListCount = () => {
    const {currentUser} = this.context
    CommonService.getTotalCount(COMMON_LIST_NAME.CONVERSATIONS, {
      entityId: currentUser.entityId,
    })
      .then(totalCount => {
        this.setState(
          {
            totalCount,
          },
          () => {
            this.loadData()
          }
        )
      })
      .catch(e => {
        console.log('ERROR on getting total count', e)
        this.setState({
          totalCount: 0,
          isFetching: false,
        })
      })
  }

  reload = () => {
    this.setState(
      {
        first: 5,
        offset: 0,
        conversation: [],
        totalCount: 0,
        isFetching: true,
      },
      () => {
        this.fetchConversationListCount()
      }
    )
  }

  onLoadMore = async () => {
    const {first, conversation, canLoadMore} = this.state
    const newFirst = conversation.length + first
    if (!canLoadMore) {
      return
    }
    this.setState(
      {
        first: newFirst,
        isFetchingMore: true,
      },
      () => {
        this.loadData()
      }
    )
  }

  loadData = () => {
    const {currentUser} = this.context
    const {first, offset} = this.state
    if (currentUser.entityId) {
      BookingNotesService.getConversationList(currentUser.entityId, first, offset)
    }
  }

  setConversationList = ({conversationList}) => {
    const {totalCount} = this.state
    // let list = []
    // if (conversationList && conversationList.length) {
    //   list = conversationList.sort((a, b) => {
    //     return new Date(b.conversationDate).getTime() - new Date(a.conversationDate).getTime()
    //   })
    // }
    this.setState({
      conversation: conversationList,
      isFetching: false,
      isFetchingMore: false,
      canLoadMore: conversationList.length < totalCount,
    })
  }

  onBookingNotesDetail = details => {
    console.log('onBookingNotesDetail', details)
    const bookingDetails = JSON.parse(details.conversationDetails)
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHAT_DETAIL, {
      conversationId: details.conversationId,
      conversationName: details.conversationName,
      conversationPic: details.conversationPic,
      bookingStatusId: bookingDetails.chef_booking_status_id,
    })
  }

  renderRow = ({item: details, index}) => {
    let time = ''
    // let displayDate = ''
    let lastMessage = ''
    let bookingDetails = {}
    let date = ''

    if (details.conversationDate) {
      date = moment(moment.utc(details.conversationDate).local())
      // displayDate = date.format(displayDateFormat)
    }
    if (details.conversationLastMessageTimestamp) {
      const dateTime = moment(moment.utc(details.conversationLastMessageTimestamp).local())
      time = moment(dateTime).fromNow()
    }

    if (details.conversationLastMessage) {
      lastMessage = JSON.parse(details.conversationLastMessage)
    }

    if (details.conversationDetails) {
      bookingDetails = JSON.parse(details.conversationDetails)
    }

    return (
      <View>
        <TouchableOpacity
          onPress={() => this.onBookingNotesDetail(details)}
          activeOpacity={0.9}
          style={[styles.panelList]}>
          <Image
            style={styles.chefImage}
            source={
              details.conversationPic ? {uri: details.conversationPic} : Images.common.defaultAvatar
            }
          />
          <View style={styles.contentContainer}>
            <Text style={styles.nameStyling}>{details.conversationName}</Text>
            <Text style={styles.locationStyling} numberOfLines={1}>
              {lastMessage}
            </Text>
            <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 2}}>
              <Icon name="calendar" style={{color: Theme.Colors.primary, fontSize: 18}} />
              <Text style={styles.dateStyling}>
                {GMTToLocal(bookingDetails.chef_booking_from_time, DATE_TYPE.DATE)}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginHorizontal: 5, marginVertical: 2}}>
              <Icon name="clock" style={{color: Theme.Colors.primary, fontSize: 18}} />
              <Text style={styles.itemHourText}>
                {' '}
                {GMTToLocal(bookingDetails.chef_booking_from_time, DATE_TYPE.TIME)} {'-'}
                {GMTToLocal(bookingDetails.chef_booking_to_time, DATE_TYPE.TIME)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.buttonStyle}>
          <Text style={{fontSize: 14}}>{time || moment(date).fromNow()}</Text>
        </View>
      </View>
    )
  }

  render() {
    const {navigation} = this.props
    const {isChef} = this.context
    const {conversation, isFetching, isFetchingMore, canLoadMore} = this.state
    return (
      <View style={styles.container}>
        {isChef ? (
          <Header showBack navigation={navigation} showTitle title="Inbox" />
        ) : (
          <Header navigation={navigation} showTitle title="Inbox" showBell />
        )}

        <CommonList
          keyExtractor="conversationId"
          data={conversation}
          renderItem={this.renderRow}
          isFetching={isFetching}
          isFetchingMore={isFetchingMore}
          canLoadMore={canLoadMore}
          loadMore={this.onLoadMore}
          reload={this.reload}
          extraData={this.state}
          emptyDataMessage="No Booking Notes List"
        />
      </View>
    )
  }
}

ConversationList.contextType = AuthContext
