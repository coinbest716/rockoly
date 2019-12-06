/** @format */

import React, {Component} from 'react'
import {View, ScrollView} from 'react-native'
import {
  Icon,
  Button,
  Textarea,
  Text,
  Label,
  ListItem,
  CheckBox,
  Body,
  Item,
  Input,
  Content,
  Form,
} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {Theme} from '@theme'
import {AuthContext, ChefPreferenceService, BasicProfileService} from '@services'
import {CommonButton, Spinner} from '@components'
import {Languages} from '@translations'
import styles from './styles'

export default class ChefExperience extends Component {
  constructor(props) {
    super(props)
    this.state = {
      awards: '',
      certifications: [
        {
          label: 'Chef Fluency',
          value: 'Chef Fluency',
          checked: false,
        },
        {
          label: 'Cookbook Deployment',
          value: 'Cookbook Deployment',
          checked: false,
        },
        {
          label: 'Extending Chef',
          value: 'Extending Chef',
          checked: false,
        },
        {
          label: 'Cookbook Development',
          value: 'Cookbook Development',
          checked: false,
        },
        {
          label: 'Auditing with InSpec',
          value: 'Auditing with InSpec',
          checked: false,
        },
      ],
      certificationsTypeId: [],
      profile: {},
      isFetching: false,
    }
  }

  componentDidMount() {
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.loadData()
      }
    )
  }

  onChangeAwardsDesc = value => {
    this.setState({
      awards: value,
    })
  }

  onItemPress = (index, checked) => {
    console.log('onItemPress', index, checked)
    const {certifications} = this.state
    const temp = certifications

    if (temp[index]) {
      temp[index].checked = !checked
    }

    this.setState(
      {
        certifications: temp,
      },
      async () => {
        const val = []
        await certifications.map((itemVal, key) => {
          if (itemVal.checked === true) {
            val.push(itemVal.value)
          }
        })
        this.setState({
          certificationsTypeId: val,
        })
      }
    )
  }

  loadData = async () => {
    const {isLoggedIn, getProfile} = this.context

    if (isLoggedIn) {
      const profile = await getProfile()

      this.setState(
        {
          profile,
        },
        () => {
          this.loadProfileData()
        }
      )
    }
  }

  loadProfileData = () => {
    const {profile} = this.state
    this.setState({
      isFetching: false,
    })
    if (profile) {
      const profileExtended = profile.chefProfileExtendedsByChefId.nodes[0]
      this.setState({
        awards: profileExtended.chefAwards ? JSON.parse(profileExtended.chefAwards) : null,
      })
    }
  }

  onSave = () => {
    const {currentUser} = this.context
    const {awards, certificationsTypeId} = this.state
    if (currentUser && currentUser !== null && currentUser !== undefined) {
      const obj = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefAwards: awards ? JSON.stringify(awards) : null,
        chefCertificateType: null,
      }
      console.log('Awards save', obj)
      this.setState(
        {
          isFetching: true,
        },
        () => {
          ChefPreferenceService.updateChefExperienceData(obj)
            .then(data => {
              this.setState({
                isFetching: false,
              })
              BasicProfileService.emitProfileEvent()
              console.log('Awards data', data)
              this.loadData()
            })
            .catch(error => {
              console.log('Awards error', error)
            })
        }
      )
    }
  }

  render() {
    const {navigation} = this.props
    const {awards, certifications, isFetching} = this.state

    if (isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <View>
            <Label style={styles.label}>Awards </Label>
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={awards}
              onChangeText={value => this.onChangeAwardsDesc(value)}
              placeholder="Awards"
            />
          </View>
          <View>
            <Label style={styles.label}>Certifications </Label>
            {certifications &&
              certifications.length > 0 &&
              certifications.map((item, index) => {
                return (
                  <ListItem style={{borderBottomWidth: 0}}>
                    <CheckBox
                      checked={item.checked}
                      color={Theme.Colors.primary}
                      onPress={() => this.onItemPress(index, item.checked)}
                    />
                    <Body style={{marginLeft: 5}}>
                      <Text>{item.label}</Text>
                    </Body>
                  </ListItem>
                )
              })}
          </View>
        </View>
        <CommonButton
          btnText={Languages.awards.btnLabel.save}
          containerStyle={styles.saveBtn}
          onPress={this.onSave}
        />
      </ScrollView>
    )
  }
}

ChefExperience.contextType = AuthContext
