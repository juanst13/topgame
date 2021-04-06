import React from 'react'
import { Dimensions, ImageBackground, Image, StyleSheet, ScrollView, Text, View } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoginForm from '../../components/Account/LoginForm'
import { containerScreen } from '../../Styles'

const {width, height} = Dimensions.get("window")

export default function Login() {

    return (
        <KeyboardAwareScrollView>
            <View>
                    <ImageBackground
                    source = {require('../../assets/crystal_background.jpg')}
                    resizeMode = "cover"
                    style = {styles.image}
                    >
                        <View style = {styles.container}>
                            <LoginForm/>
                            <CreateAccount/>
                            <Divider style = {styles.divider}/>
                        </View>
                    </ImageBackground>
            </View>
        </KeyboardAwareScrollView>
    )
}

function CreateAccount(props) {
    const navigation = useNavigation()
    
    return(
        <Text 
        style = {styles.register}
            onPress={() => navigation.navigate("register")}
        >
            ¿Aún no tienes una cuenta?{" "}
            <Text style = {styles.btncontainer}>
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image:{
        width: width, 
        height: height
    },
    container:{
        ...containerScreen.containerScreen,
       flex: 1,
       alignContent: "center"
    },
    divider:{
        backgroundColor: "#1d62d9",
        margin: 30
    },
    register:{
        marginHorizontal: 10,
        alignSelf: "center",
        color: "black"
    },
    btncontainer:{
        color: "#5380d3",
        fontWeight: "bold",
        color: "white"
    }
})
