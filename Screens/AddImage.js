import React, { useState } from 'react';
import {
    ScrollView,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firebaseStorage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
const skipButton = () => { }

const AddImage = (props) => {

    const [filePath, SetFilePath] = useState({});
    const [imageSelected, setSelected] = useState(false);
    const [isUploading, setUploading] = useState(false);

    const handleImageUpload = async () => {
        try {
            setUploading(true);
            var uid = auth().currentUser.uid;
            var storageRef = firebaseStorage().ref(`profileImage/${uid}/profile.png`);
            var task = storageRef.putFile(filePath.assets[0].uri);
            task.then(async () => {
                const url = await storageRef.getDownloadURL(`profileImage/${uid}/profile.png`);
                await auth().currentUser.updateProfile({
                    photoURL: url
                });
                props.navigation.replace('HomePage');
            }
            );
        } catch (error) {
            console.log(error);
            setUploading(false);
        }
    }

    const handleSelectImage = () => {
        let option = {
            title: 'Select Profile Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 500,
            maxHeight: 500,
        }
        launchImageLibrary(option, (response) => {
            console.log(response.assets[0].uri);
            if (response.didCancel) {
                console.log('cancelled by user');
            }
            else {
                let source = response;
                SetFilePath(source);
                setSelected(true);
            }
        });
    }

    return (
        <View style={styles.background}>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={{ fontSize: 40, fontFamily: "logo", color: "white" }}>
                        Add Profile Image
                    </Text>
                    <TouchableOpacity onPress={handleSelectImage}>
                        {imageSelected ? <Image source={{ uri: filePath.assets[0].uri, }} style={styles.imageContainer} /> : <Image source={require('../assets/avatar.png')} style={styles.imageContainer} />}
                    </TouchableOpacity>
                    {imageSelected && <>
                        <TouchableOpacity style={styles.continueBtn} onPress={handleImageUpload}>
                            {isUploading && < ActivityIndicator color={"white"} style={{ paddingEnd: 10 }} />}
                            <Text style={{ color: "white", fontSize: 16.5, fontWeight: "600" }}>{isUploading ? "Uploading" : "Continue"}</Text>
                        </TouchableOpacity></>}
                    <TouchableOpacity style={styles.skipButton} onPress={() => { props.navigation.replace('HomePage') }}>
                        <Text style={{ color: "white", fontSize: 16.5, fontWeight: "600" }}>Skip</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View >
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#4a4a4a',

    },
    container: {
        marginTop: "25%",
        alignItems: "center"
    },
    imageContainer: {
        width: 200, height: 200, marginTop: 20, borderRadius: 100,
    },
    skipButton: {
        flex: 1,
        marginTop: "5%",
        width: "92%",
        height: 40,
        backgroundColor: "#383838",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    continueBtn: {
        flex: 1,
        marginTop: "15%",
        width: "92%",
        backgroundColor: "rgba(255,255,255,0.3)",
        height: 40,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row'
    }
});

export default AddImage;