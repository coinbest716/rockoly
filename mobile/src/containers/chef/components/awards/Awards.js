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
  Card,
  Input,
  Content,
  Form,
} from 'native-base'
import moment from 'moment'
import _ from 'lodash'
import {Theme} from '@theme'
import {
  AuthContext,
  ChefPreferenceService,
  BasicProfileService,
  CHEF_PREFERNCE_EVENT,
} from '@services'
import {CommonButton, Spinner} from '@components'
import {Languages} from '@translations'
import styles from './styles'

export default class ChefExperience extends Component {
  constructor(props) {
    super(props)
    this.state = {
      awards: '',
      certifications: [],
      certificationsTypeId: [],
      profile: {},
      isFetching: false,
    }
  }

  componentDidMount() {
    ChefPreferenceService.on(CHEF_PREFERNCE_EVENT.CERTIFICATE, this.certificationList)
    this.setState(
      {
        isFetching: true,
      },
      () => {
        this.loadData()
        this.fetchCertificateData()
      }
    )
  }

  componentWillUnmount() {
    ChefPreferenceService.off(CHEF_PREFERNCE_EVENT.CERTIFICATE, this.certificationList)
  }

  fetchCertificateData = () => {
    ChefPreferenceService.getCertifications()
  }

  certificationList = ({certificateData}) => {
    console.log('certificateData', certificateData)
    this.setState({isFetching: false})
    const temp = []
    certificateData.map((item, value) => {
      const val = {
        label: item.certificateTypeName,
        id: item.certificateTypeId,
        checked: false,
      }
      temp.push(val)
    })
    this.setState(
      {
        certifications: temp,
      },
      () => {
        this.loadCertificateData()
      }
    )
  }

  loadCertificateData = async () => {
    const {certifications} = this.state
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('certifications prefernces', profile)
    if (profile) {
      if (
        profile.chefProfileExtendedsByChefId &&
        profile.chefProfileExtendedsByChefId.nodes.length > 0
      ) {
        const preferences = profile.chefProfileExtendedsByChefId.nodes[0]

        const certificationType = certifications

        const temp = []
        certificationType.map((res, index) => {
          console.log('res', res)
          const obj = {
            label: res.label,
            id: res.id,
            checked:
              preferences && preferences.chefCertificateType
                ? !preferences.chefCertificateType.every(item => item !== res.id)
                : false,
          }
          temp.push(obj)
        })

        console.log('certificationType', temp)
        this.setState({
          certifications: temp,
        })
      }
    }
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
            val.push(itemVal.id)
          }
        })
        this.setState({
          certificationsTypeId: val,
        })
      }
    )
  }

  renderLine = () => {
    return <View style={styles.border} />
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
    const {onSaveCallBack} = this.props
    const {awards, certificationsTypeId} = this.state
    if (currentUser && currentUser !== null && currentUser !== undefined) {
      const obj = {
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefAwards: awards ? JSON.stringify(awards) : null,
        chefCertificateType: certificationsTypeId,
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
              // BasicProfileService.emitProfileEvent()
              console.log('Awards data', data)
              if (onSaveCallBack) {
                onSaveCallBack()
              }
              // this.loadData()
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
          <Card style={styles.cardStyle}>
            <Label style={styles.label}>Awards </Label>
            <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={awards}
              onChangeText={value => this.onChangeAwardsDesc(value)}
              placeholder="Enter any awards you have won"
            />
          </Card>
          <Card style={styles.cardStyle}>
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
          </Card>
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
