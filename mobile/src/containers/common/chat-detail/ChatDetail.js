/** @format */

import React, {PureComponent} from 'react'
import {ScrollView, View, TouchableOpacity, Platform, Image} from 'react-native'
import {GiftedChat, Actions, Bubble, Send} from 'react-native-gifted-chat'
import {Text, Icon, Button, Textarea, Form} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {Header, CommonButton, Spinner, CommonList} from '@components'
import {
  AuthContext,
  BookingNotesService,
  BOOKING_NOTES,
  COMMON_LIST_NAME,
  CommonService,
} from '@services'
import {dbDateFormat} from '@utils'
import {Theme} from '@theme'
import {Images} from '@images'
import styles from './styles'

export default class ChatDetail extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      loadEarlier: true,
      isLoadingEarlier: false,
      isFetching: false,
      conversationId: '',
      conversationPic: '',
      userDetails: {},
      conversationName: '',
      first: 5,
      offset: 0,
      totalCount: 0,
      bookingStatusId: '',
      bookingHisId: '',
      bookingFromTime: '',
      bookingToTime: '',
    }
    this.onSend = this.onSend.bind(this)
    this.onLoadMore = this.onLoadMore.bind(this)
  }

  componentWillMount() {
    // this._isMounted = true
  }

  componentDidMount() {
    const {currentUser} = this.context
    BookingNotesService.on(BOOKING_NOTES.BOOKING_NOTES_DETAIL_SUBS, this.updateNewNotesDetail)
    BookingNotesService.on(BOOKING_NOTES.BOOKING_NOTES_DETAIL, this.setNotesDetail)
    const {navigation} = this.props
    console.log('navigation.state.params', navigation.state.params)

    if (navigation && navigation.state.params && navigation.state.params.conversationId) {
      this.setState(
        {
          conversationId: navigation.state.params.conversationId,
          conversationName: navigation.state.params.conversationName,
          conversationPic: navigation.state.params.conversationPic,
          bookingStatusId: navigation.state.params.bookingStatusId,
          bookingHisId: navigation.state.params.bookingHistId,
          bookingFromTime: navigation.state.params.bookingFromTime,
          bookingToTime: navigation.state.params.bookingToTime,
        },
        () => {
          BookingNotesService.fetchNotesSubscription(this.state.conversationId)
          this.loadInitialData()
        }
      )
    } else if (
      navigation &&
      navigation.state.params &&
      navigation.state.params.userDetails.conversationHistId === null
    ) {
      this.setState({
        conversationName: navigation.state.params.conversationName,
        conversationPic: navigation.state.params.conversationPic,
        userDetails: navigation.state.params.userDetails,
      })
    }
  }

  componentWillUnmount() {
    BookingNotesService.off(BOOKING_NOTES.BOOKING_NOTES_DETAIL, this.setNotesDetail)
    BookingNotesService.off(BOOKING_NOTES.BOOKING_NOTES_ADDED, this.updatedNotesDetail)
    BookingNotesService.off(BOOKING_NOTES.BOOKING_NOTES_DETAIL_SUBS, this.updateNewNotesDetail)
  }

  onLoadMore = async () => {
    const {messages, loadEarlier} = this.state
    const newFirst = messages.length + 5

    if (!loadEarlier) {
      return
    }
    this.setState(
      {
        first: newFirst,
        isLoadingEarlier: true,
      },
      () => {
        this.fetchData()
      }
    )
  }

  updateNewNotesDetail = () => {
    this.fetchMessageListCount()
  }

  setChatList = chatNotes => {
    console.log('chatNotes', chatNotes)
  }

  onSend = (messages = []) => {
    const {conversationId, userDetails} = this.state
    const {currentUser} = this.context
    console.log(currentUser.customerId)
    if (userDetails.conversationHistId === null) {
      const message = messages[0].text ? JSON.stringify(messages[0].text) : null
      BookingNotesService.on(BOOKING_NOTES.CREATE_CHAT, this.setChatList)
      BookingNotesService.createChat(userDetails.chefId, currentUser.customerId, message)
    } else if (conversationId) {
      console.log(conversationId)
      const obj = {
        fromEntityId: messages[0].user._id,
        conversationHistId: conversationId,
        msgText: messages[0].text ? JSON.stringify(messages[0].text) : null,
      }
      BookingNotesService.on(BOOKING_NOTES.BOOKING_NOTES_ADDED, this.updatedNotesDetail)
      BookingNotesService.addBookingNotes(obj)
    }
  }

  updatedNotesDetail = ({newNotes}) => {
    this.fetchData()
  }

  loadInitialData = () => {
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.fetchMessageListCount()
      }
    )
  }

  fetchMessageListCount = () => {
    const {conversationId} = this.state
    CommonService.getTotalCount(COMMON_LIST_NAME.CONVERSATION_MESSAGES, {
      conversationHistId: conversationId,
    })
      .then(totalCount => {
        this.setState(
          {
            totalCount,
          },
          () => {
            this.fetchData()
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

  fetchData = () => {
    const {conversationId, first, offset} = this.state
    BookingNotesService.getBookingNotesDetail(conversationId, first, offset)
  }

  setNotesDetail = ({bookingNotesDetail}) => {
    const {conversationName, conversationPic, totalCount} = this.state
    this.setState({
      isFetching: false,
      isLoadingEarlier: false,
      loadEarlier: bookingNotesDetail.length < totalCount,
    })

    let picId

    if (conversationPic !== '' && conversationPic !== null) {
      picId = conversationPic
    }

    if (bookingNotesDetail && bookingNotesDetail.length > 0) {
      const temp = []
      bookingNotesDetail.map((item, key) => {
        const obj = {
          _id: item.messageHistoryId,
          text: item.msgText ? JSON.parse(item.msgText) : null,
          createdAt: new Date(moment.utc(item.createdAt).local()),
          user: {
            _id: item.fromEntityId,
            name: conversationName,
            avatar: picId || Images.common.defaultAvatar,
          },
        }
        temp.push(obj)
      })
      this.setState({
        messages: temp,
      })
    } else {
      this.setState({
        messages: [],
      })
    }
  }

  renderCustomActions = props => {
    const options = {
      'Action 1': props => {
        alert('option 1')
      },
      'Action 2': props => {
        alert('option 2')
      },
      Cancel: () => {},
    }
    return <Actions {...props} options={options} />
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    )
  }

  renderSend = props => {
    console.log('props', props)
    // const {conversationId} = this.state

    // const obj = {
    //   fromEntityId: messages[0].user._id,
    //   conversationHistId: conversationId,
    //   msgText: messages[0].text ? JSON.stringify(messages[0].text) : null,
    // }
    // BookingNotesService.on(BOOKING_NOTES.BOOKING_NOTES_ADDED, this.updatedNotesDetail)
    // BookingNotesService.addBookingNotes(obj)
    return (
      <Send {...props}>
        <Icon
          name="send"
          type="MaterialCommunityIcons"
          style={{fontSize: 25, color: Theme.Colors.primary, marginBottom: 10, marginRight: 10}}
        />
      </Send>
    )
  }

  renderChat = () => {
    const {
      messages,
      isFetching,
      isLoadingEarlier,
      loadEarlier,
      bookingStatusId,
      bookingHisId,
      bookingFromTime,
      bookingToTime,
    } = this.state
    console.log('bookingHisId', bookingHisId)

    const bookingEndTime = moment(bookingToTime)
      .add(3, 'days')
      .format(dbDateFormat)

    const now = moment(new Date()).format(dbDateFormat)

    console.log('bookingEndTime', bookingEndTime, now)

    const {currentUser} = this.context
    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <GiftedChat
        messages={messages}
        onSend={this.onSend}
        renderSend={this.renderSend}
        user={{
          _id: currentUser.entityId,
        }}
        loadEarlier={loadEarlier}
        onLoadEarlier={this.onLoadMore}
        isLoadingEarlier={isLoadingEarlier}
        // minComposerHeight={status ? 0 : undefined}
        // maxComposerHeight={status ? 0 : undefined}
        // minInputToolbarHeight={status ? 0 : undefined}
        renderInputToolbar={
          bookingStatusId !== '' &&
          (bookingStatusId.trim() === 'AMOUNT_TRANSFER_SUCCESS' ||
            bookingStatusId.trim() === 'AMOUNT_TRANSFER_FAILED' ||
            bookingStatusId.trim() === 'REFUND_AMOUNT_SUCCESS' ||
            bookingStatusId.trim() === 'REFUND_AMOUNT_FAILED' ||
            bookingStatusId.trim() === 'COMPLETED' ||
            bookingStatusId.trim() === 'CANCELLED_BY_CHEF' ||
            bookingStatusId.trim() === 'CANCELLED_BY_CUSTOMER' ||
            bookingStatusId.trim() === 'CHEF_REJECTED') &&
          moment(now).isSameOrAfter(bookingEndTime)
            ? () => (
                <Text style={{color: Theme.Colors.error, fontSize: 16, textAlign: 'center'}}>
                  Conversation has been closed.
                </Text>
              )
            : undefined
        }
      />
    )
  }

  render() {
    const {navigation} = this.props
    const {conversationName, bookingHisId} = this.state
    return (
      <View style={styles.container}>
        <Header
          showBack
          navigation={navigation}
          showTitle
          title={conversationName}
          showDetail
          bookingHisId={bookingHisId}
        />
        {this.renderChat()}
      </View>
    )
  }
}

ChatDetail.contextType = AuthContext
