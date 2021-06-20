import React from 'react';
import LoginPage from './Screens/LoginPage.js';
import { createStackNavigator, NavigationContainer } from '@react-navigation/stack';
import { BaseNavigationContainer } from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import Iconic from 'react-native-vector-icons/Ionicons';
import { View, Text, Image, TouchableHighlight} from 'react-native';
import SignupPage from './Screens/SignPage.js';
import AddImage from './Screens/AddImage.js';
import ChatScreen from './Screens/ChatScreen.js';
import ChatList from './Screens/ChatList.js';
import HomePage from './Screens/HomePage.js';
import Settings from './Screens/Settings.js';
import Search from './Screens/Search.js';

const Stack = createStackNavigator();

const App = (params) => {

  const Header = ({ name, logo }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: "center", marginLeft: -20, marginTop: 5 }}>
        <Image source={{ uri: logo }} style={{ width: 37, height: 37, borderRadius: 20 }} />
        <Text style={{ paddingLeft: 10, fontSize: 17, color: "white" }}>{name}</Text>
      </View>
    );
  }

  return (
    <BaseNavigationContainer>
      <Stack.Navigator initialRouteName={auth().currentUser ? "HomePage" : "Login"}>
        <Stack.Screen name="Login" component={LoginPage} options={{
          headerShown: false,
          title: "Login",
        }}

        />
        <Stack.Screen name="Chat" component={ChatScreen} options={({ navigation, route }) => (
          {
            headerStyle: {
              backgroundColor: "#1f1f1f",
              elevation: 0
            },
            headerTintColor: "white",
            headerTitle: () => <Header name={route.params.userName} logo={route.params.userAvatar} />,

          })}
        />
        <Stack.Screen name="ChatList" component={ChatList} options={({ navigation, route }) => (
          {
            headerStyle: {
              backgroundColor: "#121212",
              elevation: 0
            },
            headerTintColor: "white",
            title: "Chats"
          })}
        />
        <Stack.Screen name="Settings" component={Settings} options={({ navigation, route }) => (
          {
            headerStyle: {
              backgroundColor: "#121212",
              elevation: 0
            },
            headerTintColor: "white",
            title: "Settings"
          })}
        />
        <Stack.Screen name="Search" component={Search} options={({ navigation, route }) => (
          {
            headerStyle: {
              backgroundColor: "#121212",
              elevation: 0
            },
            headerTintColor: "white",
            title: "Search"
          })}
        />
        <Stack.Screen name="Register" component={SignupPage} options={{
          headerShown: false,
          title: "Register",
        }}
        />
        <Stack.Screen name="AddImage" component={AddImage} options={{
          headerShown: false,
          title: "AddImage",
        }}
        />
        <Stack.Screen name="HomePage" component={HomePage}
          options={({ navigation }) => ({
            title: "Seller's Online",
            headerTintColor: "#383838",
            headerLeft: (() => {
              return <Iconic
                name="search"
                color="white"
                size={25}
                style={{
                  marginLeft: 10,
                }}
                onPress={()=> navigation.push('Search')}
              />
            }),
            headerRight: (() => {
              return <View
                style={{
                  marginRight: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 60
                }}
              >
                <Iconic
                  name="chatbubble"
                  color="white"
                  size={25}
                  onPress={() => navigation.push('ChatList')}
                />
                <Iconic
                  name="settings-outline"
                  color="white"
                  size={25}
                  onPress={() => navigation.push('Settings')}
                />
              </View>
            }),
            headerTitleStyle: {
              color: "white",
              fontSize: 28,
              fontFamily: "logo"
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: "#383838",
            }
          })
          }
        />
      </Stack.Navigator>
    </BaseNavigationContainer>
  );
}

export default App;
