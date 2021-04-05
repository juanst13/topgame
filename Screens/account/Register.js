import React from 'react'
import { ImageBackground } from 'react-native'
import { Dimensions, StyleSheet, Image, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import RegisterForm from '../../components/Account/RegisterForm'
import { containerScreen } from '../../Styles'

const {width,height} = Dimensions.get("window")

export default function Register() {
    return (
        <KeyboardAwareScrollView>
            <ImageBackground
                source = {require('../../assets/crystal_background.jpg')}
                resizeMode = "cover"
                style = {styles.image}
            >
                <View style = {styles.container}>
                    <RegisterForm/>
                </View>
            </ImageBackground>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    image:{
        height: height,
        width: width
    },
    container:{
        ...containerScreen.containerScreen
    }
})
