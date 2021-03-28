import React from 'react'
import { StyleSheet, Image, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import RegisterForm from '../../components/Account/RegisterForm'
import { containerScreen } from '../../Styles'

export default function Register() {
    return (
        <KeyboardAwareScrollView>
            <Image
                source = {require('../../assets/Game_Logo.png')}
                resizeMode = "contain"
                style = {styles.image}
            />
            <View style = {styles.container}>
                <RegisterForm/>
            </View>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    image:{
        height: 150,
        width: "100%",
        marginBottom: 20,
        opacity: 0.8,
        marginTop: 20
    },
    container:{
        ...containerScreen.containerScreen
    }
})
