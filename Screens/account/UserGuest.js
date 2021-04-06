import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Dimensions, ImageBackground, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'

import Login from './Login'
import { btn, containerScreen } from '../../Styles'

const {width, height} = Dimensions.get("window")

export default function UserGuest() {
    const Navigation = useNavigation()

    return (    
        <ScrollView>
            <ImageBackground
                source = {require('../../assets/crystal_background.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
                <View style={styles.container}>
                    <Text style={styles.title}> 
                        {"\n"}{"\n"}Bienvenidos a TopGame{"\n"}
                    </Text>
                    <Text style={styles.description}>
                        ¡Explora el mundo Gamer de una forma jámas vista! {"\n"}{"\n"} Una aventura inmersiva de los mejores juegos, tiendas y articulos. Vota y comenta como ha sido tu experiencia para lograr una aventura que envuelva tus sentidos...
                        {"\n"}
                    </Text>
                    <Button
                        buttonStyle={styles.btn}
                        icon={
                            <Icon
                                type = "material-community"
                                name = "account-search"
                                size = {26}
                                color = "white"  
                            />
                        }
                        title = "  Ver tu perfil"
                        titleStyle = {{ color: "white"}}
                        onPress = {() => Navigation.navigate("login")}
                    />
                    <Image
                        source = {require('../../assets/Game_Logo.png')}
                        resizeMode = "contain"
                        style={styles.image}
                    />
                </View>
            </ImageBackground>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    imageBackground:{
        width: width, 
        height: height
    },
    container:{
        ...containerScreen.containerScreen,
       flex: 1,
       alignContent: "center"
    },
    image:{
        height: 200,
        width: "110%",
        opacity: 0.8,
        marginHorizontal: 40,
        position: "absolute",
        top: 340
    },
    title:{
        fontWeight: "bold",
        fontSize: 30,
        textAlign: "left",
        position: "relative",
        marginHorizontal: 40,
        color: "#F3F3F3",
        marginTop: -30
    },
    description:{
        textAlign:"justify",
        fontSize: 15,
        color: "#073a9a"
    },
    btn:{
        ...btn.btnIn
    }
})
