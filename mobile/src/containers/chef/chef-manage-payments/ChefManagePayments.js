/** @format */

import React, {PureComponent} from 'react'
import {View, ScrollView, FlatList, Alert, TouchableOpacity} from 'react-native'
import {Button, Text, Icon} from 'native-base'
import _ from 'lodash'
import {Header, Spinner} from '@components'
import {Languages} from '@translations'
import styles from './styles'
import {RouteNames} from '@navigation'
import {AuthContext, ChefBankService, CHEF_BANK} from '@services'

class ChefManagePayments extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      banksList: [],
      isFetching: false,
      bankProfileId: '',
    }
  }

  async componentDidMount() {
    ChefBankService.on(CHEF_BANK.UPDATING_BANK_DETAILS, this.updatedList)
    const {getProfile, currentUser, isLoggedIn} = this.context

    const profile = await getProfile()
    ChefBankService.on(CHEF_BANK.CHEF_BANK_LIST, this.setList)
    ChefBankService.on(CHEF_BANK.ADDED_NEW_BANK_DETAILS, this.loadInitialData)
    this.loadInitialData()
    if (isLoggedIn && currentUser) {
      ChefBankService.chefBankSubs(currentUser.chefId)
    }
  }

  componentWillUnmount() {
    ChefBankService.off(CHEF_BANK.CHEF_BANK_LIST, this.setList)
    ChefBankService.off(CHEF_BANK.UPDATING_BANK_DETAILS, this.updatedList)
  }

  loadInitialData = () => {
    const {isLoggedIn} = this.context
    if (isLoggedIn === true) {
      this.setState(
        {
          isFetching: true,
        },
        () => {
          this.fetchData()
        }
      )
    }
  }

  fetchData = () => {
    const {currentUser} = this.context
    if (currentUser !== undefined && currentUser !== '' && currentUser !== null) {
      ChefBankService.getBankList(currentUser.chefId)
    }
  }

  setList = ({bankList}) => {
    this.setState({
      isFetching: false,
    })
    if (
      bankList.hasOwnProperty('stripeGetChefAccounts') &&
      bankList.stripeGetChefAccounts !== {} &&
      bankList.stripeGetChefAccounts !== null
    ) {
      // if (
      //   bankList.stripeGetChefAccounts.data !== null &&
      //   bankList.stripeGetChefAccounts.data !== undefined
      // ) {
      this.setState(
        {
          banksList: bankList.stripeGetChefAccounts.data
            ? _.sortBy(bankList.stripeGetChefAccounts.data, e => !e.is_default_yn)
            : [],
        },
        () => {
          this.setDefaultBankAccount()
        }
      )
      // }
    }
  }

  setDefaultBankAccount = () => {
    const {banksList} = this.state

    if (banksList.length > 0) {
      const tempArr = _.filter(banksList, o => {
        if (o.is_default_yn === true) {
          return o
        }
      })

      if (tempArr.length === 0) {
        ChefBankService.setDefaultBank(banksList[0].chef_bank_profile_id, true)
          .then(res => {
            this.setState(
              {
                bankProfileId: banksList[0].chef_bank_profile_id,
              },
              () => {
                this.loadInitialData()
              }
            )
          })
          .catch(err => {
            Alert.alert('Info', err)
          })
      } else {
        this.setState({
          bankProfileId: tempArr[0].chef_bank_profile_id,
        })
      }
    }
  }

  updatedList = ({data}) => {
    this.fetchData()
  }

  renderContent = () => {
    return (
      <View style={styles.contentView}>
        <View style={styles.btnView}>
          <Button style={styles.stripeBtn} onPress={this.goToWebView} block>
            <Text>{Languages.manage_payment.manage_payment_lable.connect_stripe} </Text>
          </Button>
        </View>
      </View>
    )
  }

  goToWebView = () => {
    const {banksList} = this.state
    const limit = 3
    if (limit > banksList.length) {
      const {navigation} = this.props
      navigation.navigate(RouteNames.STRIPE_WEB_VIEW)
    } else {
      Alert.alert('Info', 'Maximum you can add 3 bank accounts')
    }
  }

  onDelete = item => {
    const {currentUser} = this.context
    let accountId = ''
    let chefId = ''
    if (item.hasOwnProperty('bank_details') && item.bank_details) {
      if (item.bank_details.external_accounts) {
        accountId = item.bank_details.external_accounts.data[0].account
      }
    }

    if (currentUser !== undefined && currentUser !== {} && currentUser !== undefined) {
      chefId = currentUser.chefId
    }

    ChefBankService.removeBankCard(chefId, accountId)
      .then(async data => {
        this.loadInitialData()
      })
      .catch(err => {
        Alert.alert('Error', err)
      })
  }

  deleteCard = item => {
    Alert.alert(
      Languages.manage_payment.manage_payment_alrt_msg.confirmation,
      Languages.manage_payment.manage_payment_alrt_msg.delete_info,
      [
        {
          text: Languages.manage_payment.manage_payment_lable.ok,
          onPress: () => this.onDelete(item),
          style: 'cancel',
        },
        {text: Languages.manage_payment.manage_payment_lable.cancel, style: 'cancel'},
      ],
      {cancelable: false}
    )
  }

  onSetDefaultAccount = item => {
    const {bankProfileId} = this.state

    if (item.chef_bank_profile_id) {
      ChefBankService.setDefaultBank(item.chef_bank_profile_id, true)
        .then(res => {
          if (bankProfileId) {
            ChefBankService.setDefaultBank(bankProfileId, false)
              .then(response => {
                setTimeout(() => {
                  this.loadInitialData()
                }, 500)
              })
              .catch(err => {
                Alert.alert('Error', err)
              })
          } else {
            this.loadInitialData()
          }
        })
        .catch(err => {
          Alert.alert('Error', err)
        })
    }
  }

  renderCardItem = ({item}) => {
    let details = {}
    if (item.hasOwnProperty('bank_details') && item.bank_details) {
      if (item.bank_details.external_accounts) {
        details = item.bank_details.external_accounts.data[0]
      }
    }
    return (
      <View style={styles.cardContainerView}>
        <View style={styles.cardContainer}>
          <View style={styles.cardImageView}>
            <Icon type="MaterialCommunityIcons" name="bank" style={styles.cardIcon} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardInfoTextNo}>
              {Languages.manage_payment.manage_payment_lable.star}
              {details.last4}
            </Text>
            {/* <View style={{flexDirection: 'row'}}>
            <Text style={styles.cardInfoTextName}>{details.account_holder_name}</Text>
            <Text style={{marginTop: 5, marginHorizontal: 3}}>-</Text>
            <Text style={styles.cardInfoTextName}>{details.account_holder_type}</Text>
          </View> */}
            <Text style={styles.cardInfoTextName}>{details.bank_name}</Text>
            <Text style={styles.cardInfoTextName}>
              {Languages.manage_payment.manage_payment_lable.stripe_account} : {details.account}
            </Text>
            {item.is_default_yn === true && (
              // <Text style={{color: 'red'}}>This Account as default account</Text>
              <Button transparent>
                <Text style={styles.defaultText}>
                  {Languages.manage_payment.manage_payment_lable.default_account}
                </Text>
              </Button>
            )}
            {(item.is_default_yn === false || item.is_default_yn === null) && (
              <Button style={styles.locationBtn} onPress={() => this.onSetDefaultAccount(item)}>
                <Text style={styles.locationText}>
                  {Languages.manage_payment.manage_payment_lable.set_default}
                </Text>
              </Button>
            )}
          </View>
        </View>
        <View style={styles.actionBtnView}>
          {(item.is_default_yn === false || item.is_default_yn === null) && (
            <Icon
              type="FontAwesome"
              name="trash"
              style={styles.deleteIcon}
              onPress={() => this.deleteCard(item)}
            />
          )}
        </View>
      </View>
    )
  }

  renderCardList = () => {
    const {banksList, isFetching} = this.state
    if (isFetching) {
      return <Spinner mode="full" />
    }
    if (banksList.length > 0) {
      return (
        <ScrollView>
          <FlatList data={banksList} renderItem={this.renderCardItem} extraData={this.state} />
        </ScrollView>
      )
    }
    return (
      <View style={styles.noDataView}>
        <Text style={styles.noDataText}>
          {Languages.manage_payment.manage_payment_lable.bank_account}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header showBack title={Languages.manage_payment.title} />
        {this.renderContent()}
        {this.renderCardList()}
      </View>
    )
  }
}

ChefManagePayments.contextType = AuthContext

export default ChefManagePayments
