/** @format */

import React, {PureComponent} from 'react'
import {ScrollView, View, Alert, FlatList} from 'react-native'
import {Text, Icon, Button} from 'native-base'
import stripe from 'tipsi-stripe'
import {Header, CommonButton, Spinner} from '@components'
import {AuthContext} from '@services'
import {Languages} from '@translations'
import CardManagementService, {
  CARD_MANAGEMENT_LIST_EVENT,
} from '../../../services/CardManagementService'
import styles from './styles'

stripe.setOptions({
  publishableKey: 'pk_test_0aMu8HkW68jT4m4zzaSSLlM200tcceSCDW',
})
export default class CardManagement extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cardsList: [],
      isFetching: false,
      customerStripeId: null,
      continuePayment: false,
    }
  }

  async componentDidMount() {
    CardManagementService.on(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
    this.loadData()
    try {
      const {navigation} = this.props
      if (navigation.state.params && navigation.state.params.continuePayment === true) {
        this.setState({
          continuePayment: true,
        })
      }
    } catch (e) {}
  }

  componentWillUnmount() {
    CardManagementService.off(CARD_MANAGEMENT_LIST_EVENT.CARD_MANAGEMENT_LIST, this.setCardList)
  }

  loadData = async () => {
    const {isChef, isLoggedIn, getProfile} = this.context
    const profile = await getProfile()
    if (isLoggedIn === true && !isChef) {
      if (
        profile &&
        profile.customerProfileExtendedsByCustomerId &&
        profile.customerProfileExtendedsByCustomerId.nodes.length &&
        profile.customerProfileExtendedsByCustomerId.nodes[0].customerStripeCustomerId
      ) {
        this.setState(
          {
            customerStripeId:
              profile.customerProfileExtendedsByCustomerId.nodes[0].customerStripeCustomerId,
          },
          () => {
            this.fetchData()
          }
        )
      }
    }
  }

  fetchData = () => {
    const {customerStripeId} = this.state
    this.setState(
      {
        isFetching: true,
      },
      () => {
        CardManagementService.getCardData(customerStripeId, 30)
      }
    )
  }

  setCardList = ({cardsList}) => {
    this.setState({
      isFetching: false,
    })
    if (cardsList && cardsList.hasOwnProperty('stripeGetCustomerCards')) {
      if (
        cardsList.stripeGetCustomerCards.hasOwnProperty('data') &&
        Object.keys(cardsList.stripeGetCustomerCards.data).length !== 0
      ) {
        const value = cardsList.stripeGetCustomerCards.data
        if (value.data !== [] && value.data !== undefined) {
          this.setState({
            cardsList: value.data,
          })
        } else {
          this.setState({
            cardsList: [],
          })
        }
      } else {
        this.setState({
          cardsList: [],
        })
      }
    }
  }

  stripeForm = async () => {
    const {currentUser} = this.context
    const {customerStripeId, cardsList} = this.state
    const limit = 5
    if (limit > cardsList.length) {
      const token = await stripe.paymentRequestWithCardForm()
      if (token && token !== null && token !== {}) {
        const obj = {
          tokenId: token.tokenId,
          email: currentUser.customerEmailId,
          customer: customerStripeId,
        }
        CardManagementService.addCard(obj)
          .then(data => {
            if (
              data &&
              data.stripeAttachCardToCustomer &&
              data.stripeAttachCardToCustomer.data &&
              data.stripeAttachCardToCustomer.data.customer
            ) {
              this.setState(
                {
                  customerStripeId: data.stripeAttachCardToCustomer.data.customer,
                },
                () => {
                  this.loadData()
                  const {navigation} = this.props
                  const {continuePayment} = this.state
                  if (continuePayment) {
                    navigation.goBack()
                  }
                }
              )
            }
          })
          .catch(err => {
            console.log('data addCard err', err)
          })
      }
    } else {
      Alert.alert('Info', 'Maximum you can add 5 cards')
    }
  }

  onDelete = value => {

    CardManagementService.removeCard(value.customer, value.id)
      .then(async data => {
        if (
          data &&
          data.hasOwnProperty('stripeRemoveCard') &&
          Object.keys(data.stripeRemoveCard).length !== 0
        ) {
          if (data.stripeRemoveCard.hasOwnProperty('data') && data.stripeRemoveCard.data !== {}) {
            if (data.stripeRemoveCard.data.deleted === true) {
              await this.fetchData()
            }
          }
        }
      })
      .catch(err => {
        console.log('data onDelete', err)
      })
  }

  editCard = () => {
    this.stripeForm()
  }

  deleteCard = item => {
    Alert.alert(
      Languages.CardManagement.alert.confirmation_title,
      Languages.CardManagement.alert.delete,
      [
        {
          text: 'Ok',
          onPress: () => this.onDelete(item),
          style: 'cancel',
        },
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: false}
    )
  }

  renderCardItem = ({item}) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardImageView}>
          <Icon type="FontAwesome" name="credit-card" style={styles.cardIcon} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardInfoTextName}>{item.brand}</Text>
          <Text style={styles.cardInfoTextNo}>
            {Languages.CardManagement.card_secret_code}
            {item.last4}
          </Text>
        </View>
        <View style={styles.actionBtnView}>
          <Icon
            type="FontAwesome"
            name="trash"
            style={styles.deleteIcon}
            onPress={() => this.deleteCard(item)}
          />
        </View>
      </View>
    )
  }

  renderCardList = () => {
    const {cardsList, isFetching} = this.state
    if (isFetching) {
      return <Spinner mode="full" />
    }
    if (cardsList.length > 0) {
      return (
        <ScrollView>
          <FlatList data={cardsList} renderItem={this.renderCardItem} />
        </ScrollView>
      )
    }
    return (
      <View style={styles.noDataView}>
        <Text style={styles.noDataText}>{Languages.CardManagement.empty}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header showBack showTitle title={Languages.CardManagement.title} />
        <View style={styles.addBtnView}>
          <CommonButton
            btnText={Languages.CardManagement.addBtnText}
            onPress={() => {
              this.stripeForm()
            }}
          />
        </View>
        {this.renderCardList()}
      </View>
    )
  }
}

CardManagement.contextType = AuthContext
