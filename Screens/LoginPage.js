import React, { Component, useState } from 'react';
import { Dimensions, ImageBackground, StyleSheet, StatusBar, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, } from 'react-native';
import auth from '@react-native-firebase/auth';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AwesomeAlert from 'react-native-awesome-alerts';
class LoginPage extends Component {

    constructor(props) {
        super(props);
        console.log("confirmed");
        this.state = {
            email: "",
            password: "",
            islogin: false,
            showError: false,
            errorText: "All fields are mandatory",
        };
    }

    componentDidMount() {
        if (auth().currentUser) {
            this.props.navigation.replace('HomePage');
        }
    }

    handleGoogleLogin = async () => {
        try {
            GoogleSignin.configure(
                {
                    webClientId: "59464393788-41upueticu9staj1m0002jjtnt27118k.apps.googleusercontent.com"
                }
            );
            const { idToken } = await GoogleSignin.signIn();
            const googleCredentials = auth.GoogleAuthProvider.credential(idToken);
            await auth().signInWithCredential(googleCredentials);
            this.props.navigation.replace('HomePage');
        } catch (error) {
            this.setState({errorText: "Something went wrong",showError: true, islogin: false});
        }
    };

    handleLogin = async () => {
        if (this.state.email.length == 0 || this.state.password.length == 0) {
            this.setState({ showError: true, errorText: "All fields are mandatory"});
        }
        else {
            try {
                var isprev = this.state.islogin;
                this.setState({ islogin: !isprev });
                console.log(this.props);
                await auth().signInWithEmailAndPassword(this.state.email, this.state.password);
                this.props.navigation.replace('HomePage');
            } catch (error) {
                this.setState({errorText: "Something went wrong",showError: true, islogin: false});
            }
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor='transparent' />
                <View style={{ flex: 1, backgroundColor: "#121212", }}>
                    <ScrollView>
                        <AwesomeAlert
                            show={this.state.showError}
                            showProgress={false}
                            title={this.state.errorText}
                            useNativeDriver
                            cancelButtonColor="transparent"
                            cancelButtonTextStyle={{
                                fontSize: 16
                            }}
                            confirmButtonStyle={{
                                backgroundColor: "#cf352e"
                            }}
                            confirmButtonTextStyle={{
                                fontSize: 16
                            }}
                            messageStyle={{
                                color: "white",
                                fontSize: 16
                            }}
                            titleStyle={{
                                color: "white",
                                fontSize: 17,
                            }}
                            contentContainerStyle={{
                                backgroundColor: "#1f1f1f"
                            }}
                            actionContainerStyle={{
                                backgroundColor: "#1f1f1f"
                            }}
                            closeOnTouchOutside={false}
                            closeOnHardwareBackPress={false}
                            showConfirmButton={true}
                            confirmText="Got it"
                            onConfirmPressed={async () => {
                                this.setState({ showError: false });
                            }}
                        />
                        <View style={{ flex: 1, alignItems: "center", paddingTop: 50 }}>
                            <Text style={styles.logo}>
                                Seller's Online
                            </Text>
                            <Text style={{ fontSize: 20, color: "white", marginTop: -10 }}>
                                Where consumer meet consumer
                            </Text>
                        </View>
                        <View style={
                            {
                                alignItems: "center",
                                flex: 1,
                                marginTop: 160,
                            }
                        }>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter your Email Address"
                                selectionColor={"white"}
                                placeholderTextColor='rgba(255,255,255,0.9)'
                                keyboardType="email-address"
                                onChangeText={(val) => this.setState({ email: val })}
                            />
                            <TextInput
                                style={[styles.inputField, { marginTop: 20 }]}
                                placeholderTextColor='rgba(255,255,255,0.9)'
                                selectionColor={"white"}
                                placeholder="Enter your Password"
                                secureTextEntry={true}
                                onChangeText={(val) => this.setState({ password: val })}
                            />
                            <TouchableOpacity
                                style={[styles.loginButton, { marginTop: 30 }]}
                                color="white"
                                onPress={this.handleLogin}
                            >
                                {this.state.islogin == true && < ActivityIndicator color={"white"} style={{ paddingEnd: 10 }} />}
                                <Text
                                    style={
                                        {
                                            color: "white",
                                            fontSize: 16.5,
                                            alignSelf: "center"
                                        }
                                    }>
                                    Login
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.loginButton}
                                color="white"
                                onPress={this.handleGoogleLogin}
                            >
                                <FontAwesome5 name="google" color="white" size={22} style={{ marginEnd: 7 }} />
                                <Text
                                    style={
                                        {
                                            color: "white",
                                            fontSize: 16.5,
                                            alignSelf: "center"
                                        }
                                    }>
                                    Sign in with Google
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Register') }}>
                                <Text style={{ color: "white", fontSize: 15, marginTop: 15 }}>
                                    Not a user, click to register
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#121212",
        flex: 1,
    },
    logo:
    {
        color: "white",
        fontSize: 60,
        fontFamily: "logo"
    },
    inputField:
    {
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginHorizontal: 35,
        borderRadius: 5,
        height: 45,
        color: "white",
        fontSize: 16,
        paddingLeft: 20,
        width: "92%"
    },
    loginButton: {
        marginTop: 20,
        borderRadius: 6,
        backgroundColor: "rgba(127, 127, 127,.5)",
        width: "92%",
        flexDirection: 'row',
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default LoginPage;