/** @format */

import React, {PureComponent} from 'react'
import {View, Image, TouchableOpacity} from 'react-native'
import {Icon, Text} from 'native-base'
import StarRating from 'react-native-star-rating'
import {FavouriteChefService, FAV_CHEF_LIST_EVENT, COMMON_LIST_NAME, CommonService} from '@services'
import {Images} from '@images'
import {Header, CommonList} from '@components'
import {AuthContext} from '../../../AuthContext'
import RouteNames from '../../../navigation/config/RouteNames'
import {Languages} from '@translations'
import styles from './styles'
import {Theme} from '@theme'

class Favourite extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      first: 50,
      offset: 0,
      favList: [],
      isFetching: false,
      isFetchingMore: false,
      totalCount: 0,
      canLoadMore: false,
    }
  }

  componentDidMount() {
    FavouriteChefService.on(FAV_CHEF_LIST_EVENT.FAV_CHEF_LIST, this.setList)
    FavouriteChefService.on(FAV_CHEF_LIST_EVENT.FOLLOW_OR_UNFOLLOW_UPDATING, this.reload)
    const {isLoggedIn, isChef, currentUser} = this.context
    if (isLoggedIn === true && !isChef) {
      FavouriteChefService.favoriteChefSubscription(currentUser.customerId)
      this.setState(
        {
          isFetching: true,
        },
        () => {
          this.fetchFavCount()
        }
      )
    }
  }

  componentWillUnmount() {
    FavouriteChefService.off(FAV_CHEF_LIST_EVENT.FAV_CHEF_LIST, this.setList)
    FavouriteChefService.off(FAV_CHEF_LIST_EVENT.FOLLOW_OR_UNFOLLOW_UPDATING, this.reload)
  }

  // Click the card
  onCardCLick(chefData) {
    const {navigation} = this.props
    navigation.navigate(RouteNames.CHEF_PROFILE_SCREEN, {chefId: chefData.chefId})
  }

  reload = () => {
    this.setState(
      {
        first: 50,
        offset: 0,
        favList: [],
        totalCount: 0,
        isFetching: true,
      },
      () => {
        this.fetchFavCount()
      }
    )
  }

  fetchFavCount = () => {
    const {currentUser} = this.context
    CommonService.getTotalCount(COMMON_LIST_NAME.CUSTOMER_FOLLOW_CHEF, {
      customerId: currentUser.customerId,
    })
      .then(totalCount => {
        this.setState(
          {
            totalCount,
          },
          () => {
            this.fetchList()
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

  fetchList = () => {
    const {first, offset} = this.state
    const {currentUser} = this.context
    FavouriteChefService.getFavChefList(first, offset, currentUser.customerId)
  }

  onUnFollowPress = data => {
    const {currentUser} = this.context
    FavouriteChefService.followOrUnfollowChef(data.chefId, currentUser.customerId, 'UNFOLLOW')
  }

  onLoadMore = async () => {
    const {first, favList, canLoadMore} = this.state
    // const newOffset = favList.length
    const newFirst = favList.length + first
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
        this.fetchList()
      }
    )
  }

  // set the favourite chefs data
  setList = ({newFavChefList}) => {
    const {favList, totalCount} = this.state
    // const updatedList = [...favList, ...newFavChefList]

    this.setState({
      isFetching: false,
      isFetchingMore: false,
      // favList: updatedList,
      // canLoadMore: updatedList.length < totalCount,
      favList: newFavChefList,
      canLoadMore: newFavChefList.length < totalCount,
    })
  }

  // listing the favourite chefs data
  renderRow = ({item: eachItem, index}) => {
    let location = 'No Location'
    let fullName = 'No Name'
    let price = '-'
    let averageRating = 0
    let reviewCount = 0
    let distance
    let units
    if (
      eachItem &&
      eachItem.chefProfileByChefId.chefProfileExtendedsByChefId &&
      eachItem.chefProfileByChefId.chefProfileExtendedsByChefId.nodes &&
      eachItem.chefProfileByChefId.chefProfileExtendedsByChefId.nodes.length > 0
    ) {
      const chefProfile = eachItem.chefProfileByChefId
      if (chefProfile.fullName) {
        fullName = chefProfile.fullName
      }

      if (chefProfile.averageRating) {
        averageRating = chefProfile.averageRating
      }
      if (chefProfile.totalReviewCount) {
        reviewCount = chefProfile.totalReviewCount
      }

      console.log('debggingdata ', averageRating, reviewCount)

      if (
        chefProfile &&
        chefProfile.chefProfileExtendedsByChefId &&
        chefProfile.chefProfileExtendedsByChefId.nodes &&
        chefProfile.chefProfileExtendedsByChefId.nodes.length
      ) {
        if (
          chefProfile &&
          chefProfile.chefProfileExtendedsByChefId.nodes[0].chefAvailableAroundRadiusInValue
        ) {
          distance =
            chefProfile.chefProfileExtendedsByChefId.nodes[0].chefAvailableAroundRadiusInValue
        }
        if (chefProfile.chefProfileExtendedsByChefId.nodes[0].chefAvailableAroundRadiusInUnit) {
          units = chefProfile.chefProfileExtendedsByChefId.nodes[0].chefAvailableAroundRadiusInUnit
        }
        if (chefProfile.chefProfileExtendedsByChefId.nodes[0].chefCity) {
          location = chefProfile.chefProfileExtendedsByChefId.nodes[0].chefCity
        }
        if (chefProfile.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour) {
          price = chefProfile.chefProfileExtendedsByChefId.nodes[0].chefPricePerHour
        }
      }
    }
    return (
      <TouchableOpacity
        onPress={() => this.onCardCLick(eachItem)}
        activeOpacity={0.9}
        style={styles.cardList}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.chefImage}
            source={
              eachItem.chefProfileByChefId.chefPicId !== null
                ? {uri: eachItem.chefProfileByChefId.chefPicId}
                : Images.common.defaultChefProfile
            }
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.nameStyling}>
            {eachItem.chefProfileByChefId.fullName || Languages.FavouriteChef.options.no_name}
          </Text>
          <View style={styles.locationView}>
            <Icon name="map-marker" type="MaterialCommunityIcons" style={styles.locationIcon} />
            <Text style={styles.locationStyling} numberOfLines={1}>
              {location}
            </Text>
          </View>
          <Text style={styles.messageDescription}>
            {price
              ? `${Languages.ChefList.buttonLabels.dollar}${price}`
              : Languages.ChefList.buttonLabels.no_price}
          </Text>
          {distance && (
            <Text style={styles.messageDescription}>
              {`${Languages.ChefList.buttonLabels.distance_statement} ${distance}${' '}${units}`}
            </Text>
          )}
          {averageRating && averageRating !== null ? (
            <View style={styles.starView}>
              <StarRating
                halfStarEnabled
                disabled
                maxStars={5}
                rating={averageRating}
                starSize={18}
                fullStarColor={Theme.Colors.primary}
                halfStarColor={Theme.Colors.primary}
                starStyle={styles.starCounttext}
              />
              <Text style={styles.avgText}>
                {averageRating && parseFloat(averageRating).toFixed(1)}
              </Text>
              {reviewCount && reviewCount > 0 ? (
                <Text style={styles.avgText}> ({reviewCount} reviews)</Text>
              ) : null}
            </View>
          ) : (
            <Text style={styles.messageDescription}>
              {Languages.ChefList.buttonLabels.no_reviews}
            </Text>
          )}
        </View>
        <Icon
          name="heart"
          style={[styles.buttonStyle]}
          onPress={() => this.onUnFollowPress(eachItem)}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const {navigation} = this.props
    const {favList, isFetching, isFetchingMore, canLoadMore} = this.state
    return (
      <View style={[styles.container]}>
        <Header showBack navigation={navigation} title={Languages.FavouriteChef.title} />
        <CommonList
          keyExtractor="chefId"
          data={favList}
          renderItem={this.renderRow}
          isFetching={isFetching}
          isFetchingMore={isFetchingMore}
          canLoadMore={canLoadMore}
          loadMore={this.onLoadMore}
          reload={this.reload}
          emptyDataMessage={Languages.FavouriteChef.options.chef_empty_msg}
        />
      </View>
    )
  }
}

export default Favourite
Favourite.contextType = AuthContext
