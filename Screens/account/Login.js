import React from 'react'
import { Image, StyleSheet, ScrollView, Text, View } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoginForm from '../../components/Account/LoginForm'
import { containerScreen } from '../../Styles'

export default function Login() {

    return (
        <KeyboardAwareScrollView>
            <Image
                source = {require('../../assets/Game_Logo.png')}
                resizeMode = "contain"
                style = {styles.image}
            />
            <View style = {styles.container}>
                <LoginForm/>
                <CreateAccount/>
            </View>
            <Divider style = {styles.divider}/>
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
        height: 150,
        width: "100%",
        marginBottom: 20,
        opacity: 0.8,
        marginTop: 20
    },
    container:{
        ...containerScreen.containerScreen
    },
    divider:{
        backgroundColor: "#1d62d9",
        margin: 30
    },
    register:{
        marginTop: 15,
        marginHorizontal:10,
        alignSelf: "center"
    },
    btncontainer:{
        color: "#5380d3",
        fontWeight: "bold"
    }
})
