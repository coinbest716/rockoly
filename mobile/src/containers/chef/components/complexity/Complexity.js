/* eslint-disable prettier/prettier */
/** @format */

import React, {Component} from 'react'
import {View, ScrollView} from 'react-native'
import {
  Text,
  Item,
  Icon,
  Input,
  Label,
  ListItem,
  CheckBox,
  Body,
  Button,
  Right,
  Toast,
  Left,
  Radio,
} from 'native-base'
import Slider from '@react-native-community/slider'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import {Theme} from '@theme'
import styles from './styles'
import { AuthContext, ChefPreferenceService, BasicProfileService, CHEF_PREFERNCE_EVENT } from '@services';


export default class Complexity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      minComplexity: 1,
      maxComplexity: 10,
      complexity: 1,
      isFetching: false,
    }
  }

  async componentDidMount() {
    this.setState({
      isFetching: true
    }, () => {
      this.loadData()
    })
   
  }

  loadData = async () => {
    const {getProfile} = this.context
    const profile = await getProfile()
    console.log('complexity profile', profile)
    this.setState({isFetching: false})
    if(profile.chefProfileExtendedsByChefId) {
      this.setState({
        complexity: profile.chefProfileExtendedsByChefId.nodes[0].chefComplexity
      })
    }
  }

  onChangeComplexity = value => {
    console.log('onChangeComplexity', value)
    this.setState({
      complexity: value,
    })
  }

  onSave = () => {
    const {complexity} = this.state
    const {currentUser} = this.context

    if (currentUser && currentUser !== null && currentUser !==undefined) {
    const obj ={
      chefProfileExtendedId: currentUser.chefProfileExtendedId,
      chefComplexity: complexity
    }
    console.log('save', obj)
    this.setState({
      isFetching: true
    }, () => {
      ChefPreferenceService.updateComplexityPreferencesData(obj)
      .then(data => {
        this.setState({
          isFetching: false
        })
        BasicProfileService.emitProfileEvent()
        console.log('complexity data', data)
        this.loadData()
      })
      .catch(error => {
        console.log('complexity error', error)
      })
    })
  
  }
  }
  

  render() {
    const {minComplexity, maxComplexity, complexity, isFetching} = this.state
    console.log('minComplexity', minComplexity, maxComplexity, complexity)
    if(isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <View >
      <View style={styles.complexityView}>
        <Label style={styles.label}>Complexity </Label>
        <Slider
          style={{ width: 300}}
          step={0.5}
          minimumValue={minComplexity}
          maximumValue={maxComplexity}
          value={complexity}
          onValueChange={val => this.setState({ complexity: val })}             
          maximumTrackTintColor='#000000' 
          minimumTrackTintColor='blue'
        />
                <View style={styles.textCon}>
                    <Text style={styles.colorGrey}>{minComplexity}</Text>
                    <Text style={styles.colorYellow}>
                        {complexity}
                    </Text>
                    <Text style={styles.colorGrey}>{maxComplexity} </Text>
                </View>
        <View>
          <Text  style={styles.textStyle}>
            We realize that putting together a complicated menu is extra work and some dishes
            require complicated executions. Here is your chance to multiply the customer invoice up
            to 2 times based on the complexity. Please take your time here as this is something
            that's unique to you and what the customer will see when figuring out the total bill.
          </Text>
        </View>
      </View>
      <CommonButton
            btnText={Languages.complexity.btnLabel.save}
            containerStyle={styles.saveBtn}
            onPress={this.onSave}
          />
      </View>
    )
  }
}

Complexity.contextType = AuthContext
