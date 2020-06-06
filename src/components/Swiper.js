import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet, 
  Dimensions,
  Image,
  Animated,
  PanResponder
} from "react-native";

import { List, ListItem, Card, CardItem, Header, Body } from 'native-base'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Users = [
{id: '1', title: "Dark Night", reviews: "5/5", theatre: "Vancouver", genre: "Action/Adventure", uri: require('../assets/feed_images/1.jpg')},
{id: '2', title: "Jungle Book", reviews: "3/5", theatre: "Coquitlam", genre: "Adventure/Fantasy", uri: require('../assets/feed_images/2.jpg')},
{id: '3', title: "Avengers", reviews: "4/5", theatre: "Burnaby", genre: "Action/Sci-Fi", uri: require('../assets/feed_images/3.png')}
]



export default class App extends React.Component {
  
constructor(){
  super()

  this.position = new Animated.ValueXY()
  this.state = {
    currentIndex: 0
  }

  this.rotate = this.position.x.interpolate({
    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp'
  })

  this.rotateAndTranslate = {
    transform: [{
      rotate: this.rotate
    },
    ...this.position.getTranslateTransform()
  ]
  }

  this.likeOpacity = this.position.x.interpolate({
    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp'
  })

  this.dislikeOpacity = this.position.x.interpolate({
    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp'
  })

  this.nextCardOpacity = this.position.x.interpolate({
    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp'
  })
  this.nextCardScale = this.position.x.interpolate({
    inputRange: [-SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp'
  })
  
}

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder:(evt, gestureState) => true,
      onPanResponderMove:(evt, gestureState) => {
        this.position.setValue({ x:gestureState.dx, y:gestureState.dy })
      },
      onPanResponderRelease:(evt, gestureState) => {
        //swipe right animation
        if (gestureState.dx > 200) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy}
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({ x: 0, y:0 })
            })
          })

        //swipe left animation
        } else if (gestureState.dx <  -200) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy}
           }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1}, () => {
              this.position.setValue({ x: 0, y:0 })
            })
          })

        //spring back to middle if not swiped far enough    
        } else { 
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0},
            friction: 4
          }).start()
        }
      }
    })
  }

  renderUsers = () => {

    
    return Users.map((item, index) => {
      //no cards left
      if (index < this.state.currentIndex) {
        return null

        //top card
      } else if (index === this.state.currentIndex) {
        return(
          <Animated.View 
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate,
            { height: SCREEN_HEIGHT - 200, width: SCREEN_WIDTH, padding: 10, position: 'absolute'}]} >

            {/* Card header */}
            <Animated.View style={{width: SCREEN_WIDTH, padding:10, position: 'absolute',zIndex:1000}}>
              <View style={{backgroundColor: '#f0f0f0', borderTopRightRadius:20, borderTopLeftRadius:20, height: 50, justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>{item.title}</Text>
              </View>
            </Animated.View>

            {/* Card footer */}
            <Animated.View style={{width: SCREEN_WIDTH, padding:10, position: 'absolute', bottom:0, zIndex:1000}}>
              <View style={{backgroundColor: '#f0f0f0', borderBottomRightRadius:20, borderBottomLeftRadius:20, height: 200, justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>Reviews: {item.reviews}</Text>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>Playing in: {item.theatre}</Text>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>Genre: {item.genre}</Text>
              </View>
            </Animated.View>

            {/* Card "LIKE" icon */}
              <Animated.View style={{opacity: this.likeOpacity, transform: [{rotate: "-30deg" }], position: "absolute", top: 80, left: 40, zIndex:1000}}>
                <Text style={{borderWidth: 1, borderColor: "green", color: "green", fontSize: 32, fontWeight:"800", padding: 10}}>YUP!</Text>
              </Animated.View >

            {/* Card "DISLIKE" icon */}
              <Animated.View style={{opacity:this.dislikeOpacity, transform: [{rotate: "30deg" }], position: "absolute", top: 80, right: 40, zIndex:1000}}>
                <Text style={{borderWidth: 1, borderColor: "red", color: "red", fontSize: 32, fontWeight:"800", padding: 10}}>NOPE!</Text>
              </Animated.View>
              <Image 
                style={{flex:1, height:null, width:null, resizeMode: 'cover', borderRadius: 20}}
                source={item.uri}
              />

              
            </Animated.View>
  
        )
        // cards underneath
      } else {
        return(
          <Animated.View 
          {...this.PanResponder.panHandlers}
          key={item.id} style={[{
            opacity: this.nextCardOpacity,
            transform: [{ scale: this.nextCardScale }],
            height: SCREEN_HEIGHT - 200, 
            width: SCREEN_WIDTH, 
            padding: 10, 
            position: 'absolute'
            }]} >
              {/* Card header - shoudl be same styled as "top card" */}
            <Animated.View style={{width: SCREEN_WIDTH, padding:10, position: 'absolute',zIndex:1000}}>
              <View style={{backgroundColor: '#f0f0f0', borderTopRightRadius:20, borderTopLeftRadius:20, height: 50, justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>{item.title}</Text>
              </View>
            </Animated.View>

            {/* Card footer - should be styled same as "top card"*/}
            <Animated.View style={{width: SCREEN_WIDTH, padding:10, position: 'absolute', bottom:0, zIndex:1000}}>
              <View style={{backgroundColor: '#f0f0f0', borderBottomRightRadius:20, borderBottomLeftRadius:20, height: 200, justifyContent: 'center'}}>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>Reviews: {item.reviews}</Text>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>Playing in: {item.theatre}</Text>
                <Text style={{alignSelf: 'center', color:"grey", fontSize: 25}}>Genre: {item.genre}</Text>
              </View>
            </Animated.View>
            <Image 
              style={{flex:1, height:null, width:null, resizeMode: 'cover', borderRadius: 20}}
              source={item.uri}
            />
          </Animated.View>
  
        )
      }

      
    }).reverse()
  }
  
  render() {
    return (
      <View>
        <View style={{ height: 40 }}>

        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
        {this.renderUsers()}
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});