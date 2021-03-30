import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'

import Login from './Login'
import { btn, containerScreen } from '../../Styles'

export default function UserGuest() {
    const Navigation = useNavigation()

    return (    
        <ScrollView
            centerContent
            style={styles.container}
        >
            <Image
                source = {require('../../assets/Game_Logo.png')}
                resizeMode = "contain"
                style={styles.image}
            />
            <Text style={styles.title}> {"\n"}{"\n"}Bienvenido a TopGame{"\n"}</Text>
            <Text style={styles.description}>
                ¡Explora el mundo Gamer de una forma jámas vista! {"\n"}{"\n"} Esta aventura inmersiva. En busqueda de los mejores juegos, tiendas y articulos. Vota y comenta como ha sido tu experiencia para lograr una aventura que envuelva tus sentidos...
            </Text>
            <Button
                buttonStyle={styles.btn}
                icon={
                    <Icon
                        type = "material-community"
                        name = "shield-account"
                        size = {26}
                        color = "white"  
                    />
                }
                title = "  Ver tu perfil"
                onPress = {() => Navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container:{
        ...containerScreen.containerScreen
    },
    image:{
        height: 200,
        width: "110%",
        opacity: 0.8,
        marginHorizontal: 40,
        left: -50
    },
    title:{
        fontWeight: "bold",
        fontSize: 17,
        marginBottom: 10,
        textAlign: "center",
        position: "relative",
        top: -40,
        marginHorizontal: 40,
        color: "#052c73"
    },
    description:{
        textAlign:"justify",
        fontSize: 15,
        color: "#073a9a",
        top: -50
    },
    btn:{
        ...btn.btnIn
    }
})
