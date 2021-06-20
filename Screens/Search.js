import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    SectionList,
    FlatList,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import Iconic from 'react-native-vector-icons/Ionicons';
import db from '@react-native-firebase/firestore';
import moment from 'moment';
import auth from '@react-native-firebase/auth';

const ListItem = ({ item }) => {
    return (
        <View style={styles.item}>
            <Image
                source={{
                    uri: item,
                }}
                style={
                    {
                        ...styles.itemPhoto,
                    }
                }

                resizeMode="cover"
            />
        </View>
    );
};

const Like = ({ section }) => {
    if (auth().currentUser && section.likelist.includes(auth().currentUser.uid)) {
        return <Iconic name="heart" color="#e32636" size={27} />;
    }
    else {
        return <Iconic name="heart-outline" color="white" size={27} />;
    }
}

const Search = () => {

    const [query, setQuery] = useState("");
    const [post, setPost] = useState([]);

    const searchProduct = async () => {
        console.log("search");
        db().collection('Ads').orderBy('post.productTitle').startAt(query).endAt(query + "\uf8ff").onSnapshot(
            (result) => {
                const items = [];
                result.docs.forEach((doc) => {
                    if (!doc.data()['post']['isSold'])
                        items.push({ ...doc.data()['post'], postid: doc.id });
                });
                setPost(items);
            }
        );

    }

    const handleLike = (id, prevLikes, data) => {
        const newList = [];
        for (var like of data.likelist) {
            newList.push(like);
        }
        const user = newList.find((ele) => { return ele === auth().currentUser.uid });
        if (user != auth().currentUser.uid) {
            data.likes = prevLikes + 1;
            newList.push(auth().currentUser.uid);
        }
        else {
            data.likes = prevLikes - 1;
            const index = newList.indexOf(user);
            if (index > -1) {
                newList.splice(index, 1);
            }
        }
        data.likelist = newList;
        db().collection('Ads').doc(id).set({
            post: {
                ...data,
            }
        })
    }

    return (
        <View style={styles.background}>
            <View style={styles.searchInputContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={query}
                    onChangeText={(val) => {
                        setQuery(val);
                        searchProduct();
                    }}
                    placeholder="Search By Product Name"
                    placeholderTextColor="rgba(255,255,255,0.8)"
                    selectionColor="white" />
                <Iconic
                    name="search"
                    size={22}
                    color='white'
                    style={{ paddingRight: 20 }}
                    onPress={searchProduct}
                />
            </View>
            <SectionList
                sections={post}
                bounces={true}
                keyExtractor={(item, index) => item + index}
                renderItem={({ data, section }) => {
                    return null;
                }
                }
                renderSectionFooter={({ section }) => (
                    <View style={{ backgroundColor: "#121212", paddingLeft: 10, paddingTop: 10, paddingBottom: 15, marginBottom: 10, marginTop: -1 }}>
                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }} >
                                <TouchableOpacity onPress={() => handleLike(section.postid, section.likes, section)}>
                                    <Like section={section} />
                                </TouchableOpacity>
                                <Iconic
                                    name="chatbubble-outline"
                                    color="white"
                                    size={25}
                                    style={{ marginLeft: 15 }}
                                    onPress={() => {
                                        props.navigation.push("Chat", {
                                            userName: section.title,
                                            userAvatar: section.logo,
                                            userUID: section.uid,
                                        });
                                    }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ flex: 1, flexDirection: "row", alignContent: "center" }}>
                                <Text style={{ color: "white", fontSize: 15 }}>{section.likes} likes</Text>
                                <Text style={{ color: "white", marginLeft: 10, fontSize: 15, }}>{moment(section.date).format('DD MMM YYYY')}</Text>
                            </View>
                            <Text style={{ color: "white", fontSize: 14.5, lineHeight: 20, marginTop: 5, paddingRight: 5, }}>{section.desc}</Text>
                        </View>
                    </View>
                )}
                renderSectionHeader={({ section }) => (
                    <View style={{ backgroundColor: "#121212", paddingTop: 15 }}>
                        <View style={{ flex: 1, flexDirection: "row", marginLeft: 20, alignItems: "center", marginBottom: 5 }}>
                            <Image source={{ uri: section.logo }} style={styles.avatar} />
                            <Text style={styles.sectionTop}>{section.title}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                horizontal={true}
                                bounces={true}
                                data={section.data}
                                keyExtractor={(item, index) => item + index}
                                renderItem={({ item }) => <ListItem item={item} />}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#121212"
    },
    searchInput: {
        fontSize: 16,
        paddingLeft: 15,
        color: "white",
    },
    searchInputContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "rgba(255,255,255,0.2)",
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 6,
    },
    sectionTop: {
        fontSize: 16.5,
        color: "white",
        paddingLeft: 7,
    },
    item: {
        margin: 10,
    },
    itemPhoto: {
        width: 300,
        height: 200,
        borderRadius: 5,
        resizeMode: "cover",
    },
    itemText: {
        fontSize: 14,
        marginLeft: 20,
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: "WorkSans-Light"

    },
    avatar: {
        height: 30,
        width: 30,
        borderRadius: 20
    }
})

export default Search;