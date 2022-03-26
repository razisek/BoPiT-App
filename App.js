import React, { Component } from 'react'
import { Alert } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import Route from './route'


//background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

//when notification opend
messaging().onNotificationOpenedApp(remoteMessage => {
  Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
});

//get notif on foreground
messaging().onMessage(async remoteMessage => {
  console.log(remoteMessage);
  Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
});

export class App extends Component {

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    fcmToken = await messaging().getToken();
    database()
      .ref('Token')
      .set(fcmToken);
  }

  render() {
    return (
      <PaperProvider>
        <NavigationContainer>
          <Route />
        </NavigationContainer>
      </PaperProvider>
    )
  }
}

export default App