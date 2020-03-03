import React, { Component } from 'react';
//import relevant components from react native
import { StyleSheet, Text, View, Platform, AsyncStorage } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NetInfo from '@react-native-community/netinfo';
// create Screen2 (Chat) class
//import firebase
const firebase = require('firebase');
require('firebase/firestore');

// create Screen2 (Chat) class
export default class Chat extends Component {

  constructor() {
    super();

    if (!firebase.apps.length) {
      firebase.initializeApp({

        apiKey: "AIzaSyAmG0c_F_AOdIv9kUX8vEJ9DTwHwu6-HfM",
        authDomain: "test-37279.firebaseapp.com",
        databaseURL: "https://test-37279.firebaseio.com",
        projectId: "test-37279",
        storageBucket: "test-37279.appspot.com",
        messagingSenderId: "302272369863",
        appId: "1:302272369863:web:e0b5ce7857eddd38901ae2",
        measurementId: "G-S8BWCKJGF6"
      });
    }


    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: 0,
      isConnected: false
    };
  }

  // get messages from asyncStorage
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // save messages in asyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // delete messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected) {
        this.setState({
          isConnected: false,
        });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }

          this.setState({
            uid: user.uid,
            messages: []
          });

          this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        });

        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });

    this.setState({
      messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user
    });
  }
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };

  //appending new message to messages object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  };

  // hide inputbar when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  };

  //render components
  render() {
    return (
      //fullscreen component
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.backgroundColor }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({

});
