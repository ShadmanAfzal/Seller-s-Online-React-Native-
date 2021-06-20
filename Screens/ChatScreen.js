import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    Dimensions,
    BackHandler,
    Linking
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import db from '@react-native-firebase/firestore';
import ChatRoomPath from './Util/ChatRommPath';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import HyperLink from 'react-native-hyperlink';

const ChatScreen = (props) => {

    const [currentMsg, SetCurrentMessage] = useState("");
    const [Messages, SetMessages] = useState([]);
    const userUID = props.route.params.userUID;
    const scrollToBottom = useRef();
    const ref = db().collection('Chats').doc("messages");

    function handleBackButtonClick() {
        props.navigation.goBack();
        return true;
    }

    const getMessages = async () => {
        const path = ChatRoomPath(auth().currentUser.uid, userUID);
        ref.collection(path).orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
            const temp = [];
            for (var i = 0; i < snapshot.docs.length; i++) {
                temp.push(snapshot.docs[i].data())
            }
            if (!snapshot.empty) {
                SetMessages(temp);
            }
        });

    }

    useEffect(() => {
        getMessages();
        BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
        };
    }, []);

    const sendMessage = async () => {
        if(currentMsg==='')
            return;
        const path = ChatRoomPath(auth().currentUser.uid, userUID);
        db().collection('chatlist').doc('msg').collection(auth().currentUser.uid).doc(path).set({
            msg: [
                {
                    chatroom: path,
                    date: Date.now(),
                    uid: userUID,
                    lastMessage: currentMsg,
                    name: props.route.params.userName,
                    logo: props.route.params.userAvatar,
                    sendBy: auth().currentUser.uid,
                }
            ]
        });
        db().collection('chatlist').doc('msg').collection(userUID).doc(path).set({
            msg: [
                {
                    chatroom: path,
                    date: Date.now(),
                    name: props.route.params.userName,
                    uid: auth().currentUser.uid,
                    lastMessage: currentMsg,
                    logo: auth().currentUser.photoURL,
                    sendBy: auth().currentUser.uid,
                }
            ]
        });
        ref.collection(path).add({
            msg: currentMsg,
            timestamp: Date.now(),
            uid: auth().currentUser.uid
        });
        var message = currentMsg;
        SetCurrentMessage("");
        sendNotification(userUID, message);

    }

    const sendNotification = async (uid, message) => {
        const token = await db().collection('FCMToken').doc(uid).get();
        const serverKey = 'key=AAAADdhapDw:APA91bHRkIFDaQJaQy_M7mH9OFVbTP1qhTMygP11OY9d0np3gfdUpjzWHkm3AOSWTrB4S4Z80hOWHM4iExZ6pV4jfJGdRcfZw8lPt-DyQesQGx8gJMPv9b-2_oMkId7GRKiDl34m-CH2';
        const url = 'https://fcm.googleapis.com/fcm/send';
        var payload = {
            "to": token.data().token,
            "notification": {
                "sound": "default",
                "body": message,
                "title": "New Message from "+auth().currentUser.displayName,
                "priority": "high",
            }
        }

        const response = await fetch(url, {
            method: "post",
            headers:{
                "Content-Type": "application/json",
                "Authorization": serverKey
            },
            body: JSON.stringify(payload)
        });
    };

    const ChatHead = ({ data }) => {
        if (data.item.uid === auth().currentUser.uid) {
            return (
                <View style={{ ...styles.rightBubble }}>
                    <HyperLink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                        <Text selectable selectionColor={"rgba(255,255,255,0.3)"} style={{ color: "white", fontSize: 15 }}>{data.item.msg}</Text>
                    </HyperLink>
                    <Text style={{ paddingLeft: 10, marginTop: 2, fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{moment(data.item.timestamp).format('hh:mm A')}</Text>
                </View>
            );
        }
        else {
            return (
                <View style={{ ...styles.leftBubble }}>
                    <HyperLink onPress={(url, text) => Linking.openURL(url)} linkStyle={{ color: 'white', fontWeight: "bold", fontSize: 16 }}>
                        <Text selectable selectionColor={"rgba(255,0,0,0.3)"} style={{ color: "white", textAlign: "left", alignSelf: "flex-start" }}>{data.item.msg}</Text>
                    </HyperLink>
                    <Text style={{ paddingLeft: 10, marginTop: 2, fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{moment(data.item.timestamp).format('hh:mm A')}</Text>
                </View>
            );
        }
    }

    return (
        <View style={styles.background}>
            <View style={{ marginBottom: 55, flex: 1 }}>
                <FlatList
                    keyExtractor={(item, index) => item + index}
                    data={Messages}
                    ref={scrollToBottom}
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        scrollToBottom.current.scrollToEnd({ animated: true });
                    }}
                    renderItem={(data) => <ChatHead data={data}
                    />}
                />
            </View>
            <View style={{ ...styles.outerContainer }}>
                <View style={styles.bottomInput}>
                    <TextInput style={styles.input} value={currentMsg} onChangeText={(val) => SetCurrentMessage(val)} selectionColor="white" placeholder="Type a message" placeholderTextColor="rgba(255,255,255,0.5)" />
                </View>
                <View style={styles.sendBtn}>
                    <MaterialIcons name="send" color="white" size={25} onPress={sendMessage} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#121212",
    },
    bottomInput: {
        width: "90%",
    },
    input: {
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 16,
    },
    sendBtn: {
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 20,
    },
    outerContainer: {
        position: "absolute",
        backgroundColor: "#1f1f1f",
        height: 50,
        width: "100%",
        zIndex: 9999,
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        flexDirection: "row"
    },
    rightBubble: {
        backgroundColor: "#4B0082",
        alignSelf: "flex-end",
        margin: 5,
        marginTop: 15,
        borderRadius: 5,
        padding: 7,
        flex: 1,
        marginEnd: 15,
        paddingHorizontal: 10,
        maxWidth: "72%",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "space-between"

    },
    leftBubble: {
        backgroundColor: "#1f1f1f",
        alignSelf: "flex-start",
        margin: 10,
        borderRadius: 5,
        padding: 7,
        paddingHorizontal: 10,
        maxWidth: "72%",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between"
    },
});

export default ChatScreen;