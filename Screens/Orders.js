import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Iconic from 'react-native-vector-icons/Ionicons';
import firebaseStorage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import DropDownPicker from 'react-native-dropdown-picker';
import AwesomeAlert from 'react-native-awesome-alerts';

const Orders = (props) => {
    const [Title, SetEmail] = useState("");
    const [Desc, SetDesc] = useState("");
    const [isloading, SetLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [length, setLength] = useState(1);
    const [error, showError] = useState(false);
    const [items, setItems] = useState([
        { label: 'Mobile', value: 'Mobile' },
        { label: 'Laptops', value: 'Laptops' },
        { label: 'Television', value: 'Television' },
        { label: 'Electronics & Appliances', value: 'Electronics & Appliances' },
        { label: 'Furniture', value: 'Furniture' },
        { label: 'Households', value: 'Households' },

    ]);

    function isImagesSelected(list){
        for(var i=0;i<4;i++){
            if(list[i].uri === "")
                return true;
        }
        return false;
    }

    const [ProductsImages, SelectImages] = useState([
        {
            uri: "",
            isSelected: false,
        },
        {
            uri: "",
            isSelected: false,
        },
        {
            uri: "",
            isSelected: false,
        },
        {
            uri: "",
            isSelected: false,
        }
    ]);

    console.log(props.innerRef.current.close);
    const uploadPost = async () => {
        if (Title==="" || Desc==="" || value==null || isImagesSelected(ProductsImages)) {
            showError(true);
        }
        else {
            SetLoading(true);
            var uid = auth().currentUser.uid;
            var urls = [];
            for (var i = 0; i < 4; i++) {
                var storageRef = firebaseStorage().ref(`Post/${uid}/${i}.png`);
                var res = await storageRef.putFile(ProductsImages[i].uri);
                urls.push(await storageRef.getDownloadURL(`Post/${uid}/${i}.png`));
            }
            await firestore().collection('Ads').add({
                post: {
                    title: auth().currentUser.displayName,
                    date: Date.now(),
                    likes: 0,
                    isSold: false,
                    desc: Desc,
                    uid: auth().currentUser.uid ? auth().currentUser.uid : "No Username",
                    data: urls,
                    likelist: [],
                    category: value,
                    productTitle: Title,
                    logo: auth().currentUser.photoURL ? auth().currentUser.photoURL : "https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=6&m=1223671392&s=612x612&w=0&h=NGxdexflb9EyQchqjQP0m6wYucJBYLfu46KCLNMHZYM="
                }
            });
            props.innerRef.current.close();
        }
    };

    const setProductImage = (index) => {
        let option = {
            title: 'Select Profile Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 500,
            maxHeight: 500,
        }
        launchImageLibrary({ ...option, mediaType: 'photo', selectionLimit: 4 }, (response) => {
            if (response.didCancel) {
                console.log('cancelled by user');
            }
            else {
                let source = response;
                console.log(source.assets[0].uri);
                let newArray = [...ProductsImages];
                if (source.assets.length == 1) {
                    newArray[index] = {
                        isSelected: true,
                        uri: source.assets[0].uri
                    }
                }
                else {
                    for (var i = 0; i < source.assets.length; i++) {
                        if (newArray[0].isSelected == false) {
                            newArray[0] = {
                                uri: source.assets[i].uri,
                                isSelected: true
                            }
                        }
                        else if (newArray[1].isSelected == false) {
                            newArray[1] = {
                                uri: source.assets[i].uri,
                                isSelected: true
                            }
                        }
                        else if (newArray[2].isSelected == false) {
                            newArray[2] = {
                                uri: source.assets[i].uri,
                                isSelected: true
                            }
                        }
                        else if (newArray[3].isSelected == false) {
                            newArray[3] = {
                                uri: source.assets[i].uri,
                                isSelected: true
                            }
                        }
                    }
                }
                SelectImages(newArray);
            }
        });
    };

    const removeImages = (index) => {
        let newArray = [...ProductsImages];
        newArray[index] = {
            uri: "",
            isSelected: false
        }
        setLength(length - 1);
        SelectImages(newArray);
    }

    return (
        <KeyboardAvoidingView style={styles.background}>
            <ScrollView nestedScrollEnabled={true}>
                <AwesomeAlert
                    show={error}
                    showProgress={false}
                    title="All fields are mandatory"
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
                        showError(false);
                    }}
                />
                <Text style={{
                    marginTop: 20,
                    marginLeft: 10,
                    color: "white",
                    fontSize: 25,
                    fontFamily: "WorkSans-Medium"
                }}>
                    Post New Products
                </Text>

                {ProductsImages[0].isSelected && <Iconic name="close-circle" style={{
                    ...styles.icons, left: 80,

                }} size={25} onPress={() => { removeImages(0) }} />}
                {ProductsImages[1].isSelected && <Iconic name="close-circle" style={{
                    ...styles.icons, left: 180,

                }} size={25} onPress={() => { removeImages(1) }} />}
                {ProductsImages[2].isSelected && <Iconic name="close-circle" style={{
                    ...styles.icons, left: 275,

                }} size={25} onPress={() => { removeImages(2) }} />}
                {ProductsImages[3].isSelected && <Iconic name="close-circle" style={{
                    ...styles.icons, left: 370,

                }} size={25} onPress={() => { removeImages(3) }} />}
                <View style={styles.container}>
                    <View style={styles.imageContainer}>

                        <TouchableOpacity
                            onPress={() => setProductImage(0)}
                        >
                            {ProductsImages[0].isSelected == false ?
                                <View style={styles.images}>
                                    <MaterialIcons
                                        name="add"
                                        size={25}
                                        color="white"
                                    />
                                </View > :
                                <View>
                                    <Image source={{ uri: ProductsImages[0].uri }} resizeMode="cover" style={{ ...styles.image }} />
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setProductImage(1)}
                        >
                            {ProductsImages[1].isSelected == false ?
                                <View style={styles.images}>
                                    <MaterialIcons
                                        name="add"
                                        size={25}
                                        color="white"
                                    />
                                </View > :
                                <Image source={{ uri: ProductsImages[1].uri }} resizeMode="cover" style={{ ...styles.image }} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setProductImage(2)}
                        >
                            {ProductsImages[2].isSelected == false ?
                                <View style={styles.images}>
                                    <MaterialIcons
                                        name="add"
                                        size={25}
                                        color="white"
                                    />
                                </View > :
                                <Image source={{ uri: ProductsImages[2].uri }} resizeMode="cover" style={{ ...styles.image }} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setProductImage(3)}
                        >
                            {ProductsImages[3].isSelected == false ?
                                <View style={styles.images}>
                                    <MaterialIcons
                                        name="add"
                                        size={25}
                                        color="white"
                                    />
                                </View > :
                                <Image source={{ uri: ProductsImages[3].uri }} resizeMode="cover" style={{ ...styles.image }} />
                            }
                        </TouchableOpacity>
                    </View>

                    <DropDownPicker
                        listMode={
                            "SCROLLVIEW"
                        }
                        placeholder="Select product category"
                        ArrowDownIconComponent={({ style }) => <MaterialIcons name="expand-more" color="white" size={25} />}

                        ArrowUpIconComponent={({ style }) => <MaterialIcons name="expand-less" color="white" size={25} />}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        labelStyle={{
                            color: "white",
                            fontSize: 16
                        }}
                        placeholderStyle={{
                            color: "white",
                            fontSize: 16
                        }}
                        style={{
                            backgroundColor: "#1f1f1f",
                            width: "94%",
                            alignSelf: "center",
                            marginBottom: 10,
                            color: "white",
                            elevation: 0,
                            borderRadius: 5,
                        }}

                        dropDownContainerStyle={{
                            backgroundColor: "#1f1f1f",
                            alignSelf: "center",
                            borderTopWidth: 0,
                            width: "94%",
                            elevation: 0,
                            borderRadius: 5,
                        }}
                        textStyle={{
                            color: "white",
                            fontSize: 15.5
                        }}

                    />
                    <TextInput
                        style={styles.inputField}
                        placeholderTextColor="white"
                        selectionColor="white"
                        onChangeText={(val) => SetEmail(val)}
                        placeholder="Name of item"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                    />
                    <TextInput
                        style={{ ...styles.inputField, height: 130 }}
                        maxHeight={130}
                        numberOfLines={10}
                        multiline={true}
                        onChangeText={(val) => SetDesc(val)}
                        selectionColor="white"
                        textAlignVertical="top"
                        keyboardType="default"
                        placeholderTextColor="rgba(255,255,255,0.7)"
                        placeholder="Details"
                    />

                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            backgroundColor: "#1f1f1f",
                            width: "92%",
                            height: 40,
                            borderRadius: 5,
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row"
                        }}
                        onPress={uploadPost}
                    >
                        {isloading && <ActivityIndicator
                            color="white"
                            style={{
                                paddingEnd: 10,
                            }}
                        />}
                        <Text
                            style={{
                                fontSize: 16.5,
                                elevation: 5,
                                color: "white"
                            }}
                        >
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#4a4a4a"
    },

    inputField: {
        marginBottom: "3%",
        width: "94%",
        height: 40,
        backgroundColor: "#1f1f1f",
        borderWidth: 0.2,
        borderRadius: 5,
        fontSize: 16,
        paddingLeft: 10,
        color: "white"
    },
    container: {
        marginTop: "7%",
        alignItems: "center",
    },

    imageContainer: {
        flexDirection: "row",
        width: Dimensions.get('screen').width,
        justifyContent: "space-evenly",
        marginBottom: 20
    },

    image: {
        width: Dimensions.get('window').width / 4.5,
        height: Dimensions.get('window').width / 4.5,
        borderRadius: 5,
    },

    images: {
        backgroundColor: "#1f1f1f",
        width: Dimensions.get('window').width / 4.5,
        height: Dimensions.get('window').width / 4.5,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
    },

    icons: {
        position: "absolute",
        zIndex: 1,
        color: "white",
        top: 70,
    }
})

export default Orders;