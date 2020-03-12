/** @format */

import React, {Component} from 'react'
import {View, Text, Alert, ScrollView} from 'react-native'
import {Button, Toast, Icon} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'

import {Header, Spinner, CommonList} from '@components'
import {
  AuthContext,
  ChefProfileService,
  PROFILE_DETAIL_EVENT,
  CommonService,
  COMMON_LIST_NAME,
} from '@services'
import styles from './styles'
import {Languages} from '@translations'
import {commonDateFormat, getRandomID} from '@utils'

class SetUnavailabilty extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDatePicker: false,
      selectedDate: new Date(),
      displayDate: null,
      unavailableDays: [],
      isFetching: true,
      isFetchingMore: false,
      canLoadMore: false,
      first: 50,
      offset: 0,
    }
  }

  componentDidMount() {
    // unAvailabilitySubscription call
    // ChefProfileService.on(PROFILE_DETAIL_EVENT.UNAVAILABILITY_UPDATING, this.loadTotalCount)
    this.loadTotalCount()
    // const {currentUser} = this.context
    // if (currentUser && currentUser.chefId) {
    //   ChefProfileService.unAvailabilitySubscription(currentUser.chefId)
    // }
  }

  loadTotalCount = () => {
    const {currentUser, isLoggedIn, isChef} = this.context
    const fromDate = moment().format(commonDateFormat)
    const futureMonth = moment()
      .startOf('month')
      .add(3, 'M')
    const toDate = moment(futureMonth)
      .endOf('month')
      .format(commonDateFormat)
    this.setState({
      fromDate,
      toDate,
    })

    if (isLoggedIn && isChef) {
      CommonService.getTotalCount(COMMON_LIST_NAME.CHEF_NOT_AVAILABILITY, {
        chefId: currentUser.chefId,
        fromDate,
        toDate,
      })
        .then(totalCount => {
          this.setState({totalCount}, () => {
            this.fetchData()
          })
        })
        .catch(() => {
          this.setLoading(false)
        })
    } else {
      this.setLoading(false)
    }
  }

  reload = () => {
    this.setState(
      {
        first: 50,
        offset: 0,
        unavailableDays: [],
        isFetching: true,
        canLoadMore: false,
      },
      () => {
        this.fetchData()
      }
    )
  }

  fetchData = () => {
    const {currentUser} = this.context
    const {totalCount, first, offset, fromDate, toDate} = this.state
    ChefProfileService.getUnAvailableCalenderList(
      first,
      offset,
      currentUser.chefId,
      fromDate,
      toDate
    )
      .then(res => {
        this.setState({
          isFetching: false,
          isFetchingMore: false,
          unavailableDays: res,
          canLoadMore: res.length < totalCount,
        })
      })
      .catch(() => {
        this.setLoading(false)
      })
  }

  setLoading = isFetching => {
    this.setState({
      isFetching,
    })
  }

  saveUnavailablity = async () => {
    const {selectedDate, displayDate} = this.state
    if (!selectedDate || !displayDate) {
      Alert.alert(
        Languages.set_unavailability.set_unavailability_alrt_msg.select,
        Languages.set_unavailability.set_unavailability_alrt_msg.select_date
      )
      return
    }
    const {isLoggedIn, currentUser} = this.context
    this.setLoading(true)
    if (isLoggedIn && currentUser && currentUser.chefId) {
      ChefProfileService.setUnavailability(currentUser.chefId, selectedDate).then(gqlRes => {
        if (gqlRes) {
          Toast.show({
            text: Languages.set_unavailability.set_unavailability_alrt_msg.saved_unavailability,
          })
          this.setState(
            {
              displayDate: null,
            },
            () => {
              this.loadTotalCount()
            }
          )
        } else {
          this.showError()
        }
      })
    } else {
      this.showError()
    }
  }

  showError = e => {
    this.setLoading(false)
    if (!e) {
      Alert.alert(
        Languages.set_unavailability.set_unavailability_alrt_msg.error,
        Languages.set_unavailability.set_unavailability_alrt_msg.error_saving
      )
    } else {
      Alert.alert(Languages.set_unavailability.set_unavailability_alrt_msg.error, e)
    }
  }

  onChangeDate = date => {
    const selectedDate = moment(date).format(commonDateFormat)
    this.setState({
      displayDate: selectedDate,
      selectedDate: new Date(selectedDate),
      showDatePicker: false,
    })
  }

  showDatePicker = () => {
    this.setState({
      showDatePicker: true,
      selectedDate: new Date(),
    })
  }

  deleteItem = item => {
    this.setLoading(true)
    const {currentUser} = this.context
    const deleteParams = {
      pChefId: currentUser.chefId,
      pDate: item.chefNotAvailDate,
      pFromTime: item.chefNotAvailFromTime,
      pToTime: item.chefNotAvailToTime,
      pType: 'DELETE',
      pChefNotAvailId: item.chefNotAvailId,
      pNotes: null,
      pFrequency: null,
    }
    ChefProfileService.deleteUnavilability(deleteParams)
      .then(gqlRes => {
        if (gqlRes) {
          Toast.show({
            text: Languages.set_unavailability.set_unavailability_alrt_msg.delete_unavailability,
          })
          this.setState(
            {
              displayDate: null,
            },
            () => {
              this.loadTotalCount()
            }
          )
        } else {
          this.showError(Languages.set_unavailability.set_unavailability_alrt_msg.cant_delete)
        }
      })
      .catch(() => {
        this.showError(Languages.set_unavailability.set_unavailability_alrt_msg.cant_delete)
      })
  }

  renderItem = ({item}) => {
    if (
      item.chefNotAvailDate !== null &&
      item.chefNotAvailDate !== undefined &&
      item.chefNotAvailDate !== ''
    ) {
      return (
        <View key={item.chefNotAvailId} style={styles.itemView}>
          <Text style={styles.dateText}>{item.chefNotAvailDate}</Text>
          <Icon
            name="delete"
            type="MaterialCommunityIcons"
            style={styles.deleteIcon}
            onPress={() => this.showDeleteAlert(item)}
          />
        </View>
      )
    }
    return null
  }

  loadMore = () => {
    const {first, unavailableDays, canLoadMore} = this.state
    // const newOffset = favList.length
    const newFirst = unavailableDays.length + first
    if (!canLoadMore) {
      return
    }
    this.setState(
      {
        // offset: newOffset,
        first: newFirst,
        isFetchingMore: true,
      },
      () => {
        this.loadTotalCount()
      }
    )
  }

  showDeleteAlert = itemToRemove => {
    Alert.alert(
      Languages.set_unavailability.set_unavailability_alrt_msg.confirmation,
      Languages.set_unavailability.set_unavailability_alrt_msg.remove_date,
      [
        {
          text: Languages.set_unavailability.set_unavailability_lable.ok,
          onPress: () => this.deleteItem(itemToRemove),
          style: 'cancel',
        },
        {text: Languages.set_unavailability.set_unavailability_lable.cancel, style: 'cancel'},
      ],
      {cancelable: false}
    )
  }

  render() {
    const {
      showDatePicker,
      selectedDate,
      maximumDate,
      displayDate,
      unavailableDays,
      isFetching,
      isFetchingMore,
      canLoadMore,
    } = this.state
    const {navigation} = this.props

    return (
      <View style={styles.container}>
        <Header
          showBack
          navigation={navigation}
          showTitle
          title={Languages.set_unavailability.title}
        />
        <Text style={styles.infoText}>
          {Languages.set_unavailability.set_unavailability_lable.add_date}
        </Text>
        <DateTimePicker
          minimumDate={new Date()}
          maximumDate={maximumDate}
          date={selectedDate}
          isVisible={showDatePicker}
          onConfirm={this.onChangeDate}
          onCancel={() => this.setState({showDatePicker: false})}
        />
        <View style={styles.viewContainer}>
          <View style={styles.buttonView}>
            <Button
              key={getRandomID()}
              style={styles.dateBtn}
              onPress={() => {
                this.showDatePicker()
              }}>
              <Text>
                {displayDate !== null
                  ? displayDate
                  : Languages.set_unavailability.set_unavailability_lable.select_date}
              </Text>
            </Button>
            <Button
              key={getRandomID()}
              style={styles.locationBtn}
              onPress={() => this.saveUnavailablity()}>
              <Text style={styles.locationText}>
                {Languages.set_unavailability.set_unavailability_lable.add}
              </Text>
            </Button>
          </View>
        </View>
        <CommonList
          keyExtractor="chefNotAvailId"
          data={unavailableDays}
          renderItem={this.renderItem}
          isFetching={isFetching}
          isFetchingMore={isFetchingMore}
          canLoadMore={canLoadMore}
          loadMore={this.loadMore}
          reload={this.reload}
          // emptyDataMessage="No Unavailability date found"
        />
      </View>
    )
  }
}

export default SetUnavailabilty
SetUnavailabilty.contextType = AuthContext
