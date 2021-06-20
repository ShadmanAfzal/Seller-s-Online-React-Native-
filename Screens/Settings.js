import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableHighlight } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import AwesomeAlert from 'react-native-awesome-alerts';
import db from '@react-native-firebase/firestore';

const Setting = (props) => {

    const [showAlert, SetAlert] = useState(false);
    const [option, setOption] = useState(0);

    return (
        <View style={styles.background}>
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                title={option === 1 ? "Delete Chats" : "Log out"}
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
                message={option === 1 ? "Once deleted, can't be restored" : "Are you sure?"}
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelText="No, cancel"
                confirmText={option===1?"Yes, delete it":"Yes, logout"}
                onCancelPressed={() => {
                    SetAlert(false);
                }}
                onConfirmPressed={async () => {
                    if (option === 1) {
                        const uid = auth().currentUser.uid;
                        const documents = await db().collection('chatlist').doc('msg').collection(uid).get();
                        for (var msg of documents.docs) {
                            await msg.ref.delete();
                        }
                    }
                    else if (option === 0) {
                        props.navigation.popToTop;
                        await auth().signOut();
                    }
                    SetAlert(false);

                }}
            />
            <ScrollView>

                <TouchableHighlight underlayColor="transparent" onPress={() => props.navigation.push("ChatList")}>
                    <View style={styles.list}>
                        <Icons name="chatbubble-outline" size={22} color="white" />
                        <Text style={styles.listTitle}>Chats</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="transparent" onPress={() => props.navigation.push("Search")}>
                    <View style={styles.list}>
                        <Icons name="search" size={22} color="white" />
                        <Text style={styles.listTitle}>Search</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="transparent" onPress={()=>{
                    setOption(0);
                    SetAlert(true);
                }}>
                    <View style={styles.list}>
                        <Icons name="log-out-outline" size={25} color="white" />
                        <Text style={styles.listTitle}>Log out</Text>
                    </View>
                </TouchableHighlight>

                <TouchableHighlight underlayColor="transparent" onPress={() => {
                    setOption(1);
                    SetAlert(true);
                }}>
                    <View style={styles.list}>
                        <Icons name="close" size={25} color="white" />
                        <Text style={styles.listTitle}>Delete Chats</Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#121212"
    },
    list: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1f1f1f",
        height: 50,
        paddingLeft: 10,
        marginBottom: 10,
    },
    listTitle: {
        color: "white",
        fontSize: 16.5,
        paddingLeft: 10,
    },
})

export default Setting;