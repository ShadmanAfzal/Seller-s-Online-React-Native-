import moment from 'moment';
import React, { useState, useEffect } from 'react'
import {
    FlatList,
    View,
    Image,
    Text,
    TouchableHighlight,
    StyleSheet
} from 'react-native';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';

const ChatList = (props) => {

    const ref = db().collection('chatlist').doc('msg').collection(auth().currentUser.uid);
    const [Chat, SetChat] = useState([]);
    const [exsist, setExsist] = useState(false);

    const getListMsg = () => {
        var temp = [];
        ref.onSnapshot((snapshot) => {
            if (!snapshot.empty) {
                setExsist(true);
                for (var data of snapshot.docs) {
                    temp.push(data.data().msg[0]);
                }
                SetChat(temp);
            }
        });
    }

    useEffect(() => {
        getListMsg();
    }, [])

    const List = ({ data }) => {
        return (
            <TouchableHighlight underlayColor="transparent" onPress={() => {
                props.navigation.push("Chat", {
                    userName: data.item.name,
                    userAvatar: data.item.logo,
                    userUID: data.item.uid,
                });
            }}>
                <View style={{ backgroundColor: "#1f1f1f", marginVertical: 7, justifyContent: "space-between" }}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
                        <View style={{ flexDirection: "row", paddingLeft: 10, paddingVertical: 10, }}>
                            <Image source={{ uri: data.item.logo }} style={styles.logo} />
                            <View style={{ marginLeft: 10, maxWidth: "88%", }}>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5, width: "95%" }}>
                                    <Text style={styles.name}>{data.item.name}</Text>
                                    <Text style={styles.date}>
                                        {moment(data.item.date).fromNow()}
                                    </Text>
                                </View>
                                <Text style={styles.lastMsg} numberOfLines={1} ellipsizeMode="tail">{data.item.lastMessage}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }

    if (exsist) {
        return (
            <View style={styles.background}>
                <FlatList
                    data={Chat}
                    keyExtractor={(item, index) => item + index}
                    renderItem={(data) => <List data={data} />}
                />
            </View>
        );
    }
    else {
        return <View style={styles.lottieBackground}>
            <LottieView source={require('../assets/message.json')} autoPlay loop />
            <Text style={{fontSize: 30, color: "white", marginTop: 350, fontFamily:"WorkSans-Medium"}}>No Chats Found</Text>
        </View>

    }

}

const styles = StyleSheet.create({
    background: {
        backgroundColor: "#121212",
        flex: 1,
    },
    lottieBackground: {
        backgroundColor: "#121212",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: -100,
    },
    logo: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    name: {
        color: "white",
        fontSize: 16
    },
    lastMsg: {
        color: "rgba(255,255,255,0.8)",
        fontSize: 15,
        maxWidth: "90%"
    },
    date: {
        color: "white",
    }
});

export default ChatList;
