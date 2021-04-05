import React, { useState } from 'react'
import { Alert } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'

import { updateProfile, uploadImage } from '../../Utils/actions'
import { loadImageFromGallery } from '../../Utils/helpers'

export default function InfoUser({ user, setLoadingText, setLoading }) {
    const [photoUrl, setPhotoUrl] = useState(user.photoURL)

    const changePhoto = async() =>{
        const result = await loadImageFromGallery([1, 1])
        if(!result.status){
            return
        }

        setLoadingText("Actualizando imagen...")
        setLoading(true)

        const resultUploadImage = await uploadImage(result.image, "avatars", user.uid)
        if(!resultUploadImage.statusResponse){
            setLoading(false)
            Alert.alert("Ha ocurrido un error al almacenar la foto de perfil.")
            return
        }

        const resultUpdateProfile = await updateProfile({ photoURL: resultUploadImage.url })
        setLoading(false)
        
        if(resultUpdateProfile.statusResponse){
            setPhotoUrl(resultUploadImage.url)
        } else {

            Alert.alert("Ha ocurrido un error al actualizar la foto de perfil.")
        }
    }

    return (
        <View style={styles.container}>
            <Avatar
                rounded
                size="large"
                source={
                    photoUrl 
                        ? {uri: photoUrl}
                        : require('../../assets/avatar-default.jpg')
                }
                containerStyle = {styles.avatar}
            >
                <Avatar.Accessory 
                    {...icon={
                            size: 22, 
                            color: "#073a9a", 
                            reverse: false, 
                            raised: true
                        }
                    }
                    onPress={changePhoto}
                />
            </Avatar>
            <View style={styles.view}>
                <Text style={styles.displayname}>
                    {
                    user.displayName ? user.displayName : "Anónimo"
                    }
                </Text>
                <Text style={styles.email}>
                    {
                    user.email
                    }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingVertical: 30,
        backgroundColor: "#03163a"
    },
    view:{
        marginLeft: 15
    },
    displayname:{
        fontWeight: "bold",
        paddingBottom: 5,
        color: "#ffffff"
    },
    email:{
        paddingBottom: 5,
        color: "#cccccc"
    },
    avatar:{
        borderRadius: 40,
        borderColor: "white",
        borderWidth: 2,
        width: 100,
        height: 100
    }
})
