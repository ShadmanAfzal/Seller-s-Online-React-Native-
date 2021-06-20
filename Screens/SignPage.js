import React, { Component, useState } from 'react';
import { Dimensions, StyleSheet, StatusBar, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, BackHandler } from 'react-native';
import auth from '@react-native-firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
class SignupPage extends Component {

    constructor(props) {
        super(props);
        console.log("confirmed");
        this.state = {
            email: "",
            password: "",
            name: "",
            islogin: false,
            showError: false,
            errorText: "",
        };
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonPress);
        if (auth().currentUser) {
            this.props.navigation.replace('HomePage');
        }
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonPress = () => {
        this.props.navigation.pop();
        return true;
    }

    handleSignup = async () => {
        if (this.state.email.length == 0 || this.state.password.length == 0 || this.state.name.length == 0) {
            this.setState({ showError: true, errorText: "All fields are mandatory" });
        }
        else {
            try {
                var isprev = this.state.islogin;
                this.setState({ islogin: !isprev });
                console.log(this.props);
                await auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.password.trim());
                await auth().currentUser.updateProfile({
                    displayName: this.state.name.trim()
                });
                if (auth().currentUser.photoURL)
                    this.props.navigation.replace('HomePage');
                else
                    this.props.navigation.replace("AddImage");
            } catch (error) {
                console.log(error);
            }
            var isprev = this.state.islogin;
            this.setState({ islogin: !isprev });
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent backgroundColor='transparent' />
                <View style={{ backgroundColor: "#121212", flex: 1 }}>
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
                                marginTop: 150,

                            }
                        }>
                            <TextInput
                                style={styles.inputField}
                                placeholder="Enter you name"
                                selectionColor={"white"}
                                placeholderTextColor='rgba(255,255,255,0.9)'
                                onChangeText={(val) => this.setState({ name: val })}
                            />
                            <TextInput
                                style={[styles.inputField, { marginTop: 20 }]}
                                placeholder="Enter your Email Address"
                                selectionColor={"white"}
                                keyboardType="email-address"
                                placeholderTextColor='rgba(255,255,255,0.9)'
                                onChangeText={(val) => this.setState({ email: val })}
                            />
                            <TextInput
                                style={[styles.inputField, { marginTop: 20 }]}
                                placeholderTextColor='rgba(255,255,255,0.9)'
                                selectionColor={"white"}
                                placeholder="Enter your Password"
                                secureTextEntry
                                onChangeText={(val) => this.setState({ password: val })}
                            />
                            <TouchableOpacity
                                style={[styles.loginButton, { marginTop: 30 }]}
                                color="white"
                                onPress={this.handleSignup}
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
                                    Register
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this.props.navigation.pop(); }}>
                                <Text style={{ color: "white", fontSize: 15, marginTop: 15 }}>
                                    Already a user, click to Login
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
        flex: 1,
        backgroundColor: "#121212",
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

export default SignupPage;