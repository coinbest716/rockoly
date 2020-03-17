/* eslint-disable prettier/prettier */
/** @format */

import React, {Component} from 'react'
import {View, ScrollView, Alert,Platform} from 'react-native'
import {
  Text,
  Input,
  Label,
  Textarea,
  Card
} from 'native-base'
import KeyBoardSpacer from 'react-native-keyboard-spacer'

// import Slider from '@react-native-community/slider'
import {Languages} from '@translations'
import {CommonButton, Spinner} from '@components'
import styles from './styles'
import { AuthContext, ChefPreferenceService } from '@services';


export default class Complexity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // minComplexity: 1,
      // maxComplexity: 10,
      // complexity: 1,
      isFetching: false,
      // multiple1: false,
      // multiple2: false,
      // multiple3: false,
      dish1: '',
      dish2: '',
      dish3: '',
      min1: "1",
      max1: "2",
      min2: "3",
      max2: "4",
      min3: "5",
      max3: "6", 
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
      const complexity= profile.chefProfileExtendedsByChefId.nodes[0].chefComplexity ? JSON.parse(profile.chefProfileExtendedsByChefId.nodes[0].chefComplexity) : null
      console.log('debugging complexity',complexity)
      if (complexity && complexity.length > 0) {
      complexity.map((item, key) => {
        if(item.complexcityLevel === '1X') {
          this.setState({
            // multiple1: true,
            dish1: item.dishes,
            min1: item.noOfItems.min ? item.noOfItems.min.toString() : null,
            max1: item.noOfItems.max ? item.noOfItems.max.toString() : null
          })
        } else if(item.complexcityLevel === '1.5X') {
            this.setState({
              // multiple2: true,
              dish2: item.dishes,
              min2: item.noOfItems.min ? item.noOfItems.min.toString()  : null,
              max2: item.noOfItems.max ? item.noOfItems.max.toString() : null
            })
        } else if(item.complexcityLevel === '2X') {
          this.setState({
            // multiple3: true,
            dish3: item.dishes,
            min3: item.noOfItems.min ?  item.noOfItems.min.toString() : null,
            max3: item.noOfItems.max ? item.noOfItems.max.toString() : null
          })
        }
      })
    }
   }
  }

  // onChangeComplexity = value => {
  //   console.log('onChangeComplexity', value)
  //   this.setState({
  //     complexity: value,
  //   })
  // }

  onSave = () => {
    const {dish1, dish2, dish3, min1, min2, min3, max1,max2,max3} = this.state
    const {currentUser} = this.context  
    const {onSaveCallBack} = this.props
    if(dish1 && dish2 && dish3 && min1 && min2 && min3 && max1 && max2 && max3) {
      if (
           min1 <= 0 || min2<=0 || min3 <=0 ||  max1 <= 0 || max2<=0 || max3 <=0  
        ) {
        Alert.alert('Info', 'Number of menu items should be greater than 0.')  
      } else if( 

         (parseInt(max1) <= parseInt(min1)) ||
         (parseInt(max2) <= parseInt(min2)) || 
         (parseInt(max3) <= parseInt(min3)) ||


         !Number.isInteger(parseFloat(min1)) ||
         !Number.isInteger(parseFloat(min2)) ||
         !Number.isInteger(parseFloat(min3)) ||
         !Number.isInteger(parseFloat(max1)) ||
         !Number.isInteger(parseFloat(max2)) ||
         !Number.isInteger(parseFloat(max3)) 

         ) {
        Alert.alert('Info', 'Please enter valid input for menu items.')  
        console.log(this.state)
      }
      else{
        const savingValue=[]; let storeObj={};
        if (dish1) {
          storeObj = {
            complexcityLevel : "1X",
            dishes : dish1,
            noOfItems : {
              min : min1,
              max : max1
            }
          }
          savingValue.push(storeObj)
        }
        if(dish2){ 
          storeObj = {
            complexcityLevel : "1.5X",
            dishes : dish2,
            noOfItems : {
              min : min2,
              max : max2
            }
          }
          savingValue.push(storeObj)
        }
        if(dish3){
          storeObj = {
            complexcityLevel : "2X",
            dishes : dish3,
            noOfItems : {
              min : min3,
              max : max3
            }
          }
          savingValue.push(storeObj)
        }
     
  
      const obj ={
        chefProfileExtendedId: currentUser.chefProfileExtendedId,
        chefComplexity: JSON.stringify(savingValue)
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
          // BasicProfileService.emitProfileEvent()
          console.log('complexity data', data)
          if (onSaveCallBack){
            onSaveCallBack()
          }
      
          // this.loadData()
        })
        .catch(error => {
          console.log('complexity error', error)
        })
      })
    }
      }
   else {

    Alert.alert('Info', 'Please fill All fields')
  }
  
  }

  renderLine = () => {
    return <View style={styles.border} />
  }

  onSavingStateValue = (state, value) => {
   this.setState({
        [state]: value
      })   
  }

  // onChecked = (state, value) => {
  //   this.setState({
  //     [state] : !value
  //   })
  // }
  

  render() {
    const {minComplexity, maxComplexity, complexity, isFetching,
      multiple1,
      multiple2,
      multiple3,
      dish1,
      dish2,
      dish3,
      min1,
      max1,
      min2,
      max2,
      min3,
      max3} = this.state


      console.log(this.state)

    if(isFetching) {
      return <Spinner mode="full" />
    }
    return (
      <ScrollView  style={{marginHorizontal: '2.5%', paddingBottom: '10%'}}  >

        <View style={styles.baseRateView}>
          <Label style={styles.label}>Complexity </Label>
          {/* <View> */}
            {/* <View>
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
            </View> */}
            <Text style={styles.bottomtextStyle}>
            We realize that putting together a complicated menu is extra work and some dishes
            require complicated executions. Here is your chance to multiply the customer invoice up
            to 2 times based on the complexity. Please take your time here as this is something
            that's unique to you and what the customer will see when figuring out the total bill.
            </Text>
            <Card style = {styles.cardStyle}>
            <View>
            {/* <ListItem style={{borderBottomWidth: null}}> */}
            {/* <CheckBox checked={multiple1} onPress={() => this.onChecked('multiple1', multiple1)} color={ Theme.Colors.primary}/> */}
            {/* <Body> */}
              {/* <Text>Complexity Level 1x</Text> */}
            {/* </Body> */}
          {/* </ListItem> */}
          <View style={{paddingTop: 15, paddingBottom: 15, marginLeft: 10}}>
          <Text>Complexity Level 1x</Text>
          </View>
          <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={dish1}
              onChangeText={value => this.onSavingStateValue('dish1', value)}
              placeholder="Provide an example of an enticing simple dish unique to you for 1x multiplier"
            />
            </View>
            <Label style={styles.label}>How many menu items</Label>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Input
                onChangeText={value => this.onSavingStateValue('min1', value)}
                value={this.state.min1}
                keyboardType="number-pad"
                style={styles.gratuityText}
              />
              <Text style={styles.to}>To</Text>
             <Input
                 onChangeText={value => this.onSavingStateValue('max1', value)}
                value={max1}
                keyboardType="number-pad"
                style={styles.gratuityText}
              />
            </View>
            </Card>
            <Card style = {styles.cardStyle}>
            <View>
            {/* <ListItem style={{borderBottomWidth: null}}>
            <CheckBox checked={multiple2} onPress={() => this.onChecked('multiple2', multiple2)} color={ Theme.Colors.primary}/>
            <Body>
              <Text>Complexity Level 1.5x</Text>
            </Body>
          </ListItem> */}
          <View style={{paddingTop: 15, paddingBottom: 15, marginLeft: 10}}>
          <Text>Complexity Level 1.5x</Text>
          </View>
          <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={dish2}
              onChangeText={value => this.onSavingStateValue('dish2', value)}
              placeholder="Provide an example of an enticing simple dish unique to you for 1.5x multiplier"
            />
            </View>
            <Label style={styles.label}>How many menu items</Label>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Input
                onChangeText={value => this.onSavingStateValue('min2', value)}
                value={min2}
                keyboardType="number-pad"
                style={styles.gratuityText}
              />
              <Text style={styles.to}>To</Text>
             <Input
                  onChangeText={value => this.onSavingStateValue('max2', value)}
                value={max2}
                keyboardType="number-pad"
                style={styles.gratuityText}
              />
            </View>
            </Card>
            <Card style = {styles.cardStyle}>
            <View>
            {/* <ListItem  style={{borderBottomWidth: null}}>
            <CheckBox checked={multiple3}  onPress={() => this.onChecked('multiple3', multiple3)} color={ Theme.Colors.primary}/>
            <Body >
              <Text>Complexity Level 2x</Text>
            </Body>
          </ListItem> */}
          <View style={{paddingTop: 15, paddingBottom: 15, marginLeft: 10}}>
          <Text>Complexity Level 2x</Text>
          </View>
          <Textarea
              style={styles.textAreaStyle}
              rowSpan={5}
              bordered
              value={dish3}
              onChangeText={value => this.onSavingStateValue('dish3', value)}
              placeholder="Provide an example of an enticing simple dish unique to you for 2x multiplier"
            />
            </View>
            <Label style={styles.label}>How many menu items</Label>
            <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Input
                onChangeText={value => this.onSavingStateValue('min3', value)}
                value={min3}
                keyboardType="number-pad"
                style={styles.gratuityText}
              />
              <Text style={styles.to}>To</Text>
             <Input
               onChangeText={value => this.onSavingStateValue('max3', value)}
                value={max3}
                keyboardType="number-pad"
                style={styles.gratuityText}
              />
            </View>
            </Card>
          {/* </View> */}
        </View>
        
        <CommonButton
            btnText={Languages.complexity.btnLabel.save}
            containerStyle={styles.saveBtn}
            onPress={this.onSave}
          />
          {Platform.OS === 'ios' && <KeyBoardSpacer />}
        </ScrollView>
    )
  }
}

Complexity.contextType = AuthContext
