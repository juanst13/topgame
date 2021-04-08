import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet,Image, Text, View, Dimensions } from 'react-native'
import { Button, Divider, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'

import { CloseSession, getCurrentUser } from '../../Utils/actions'
import { btn } from '../../Styles'
import Loading from '../../components/Loading'
import InfoUser from '../../components/Account/InfoUser'
import AccountOptions from '../../components/Account/AccountOptions'
import { BackgroundImage } from 'react-native-elements/dist/config'

const {width, height} = Dimensions.get("window")

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)
    const [reloadUser, setReloadUser] = useState(false)
    const [isVisible, setIsVisible] = useState(false)   

    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
    }, [reloadUser])


    return (    
        <View style = {styles.container}>
            <BackgroundImage
                source = {require('../../assets/31.png')}
                resizeMode = "repeat"
                style = {styles.imageBackground}
            >
            {            
                 user && (
                     <View>
                        <InfoUser   
                            user = {user}
                            setLoadingText = {setLoadingText}
                            setLoading = {setLoading}
                        />
                        <Button
                            title = "  Opciones"
                            buttonStyle = {styles.btnOpt}
                            titleStyle = {styles.titleOpt}
                            onPress={() => setIsVisible(true)}
                            icon = {
                                <Icon
                                    type = "material-community"
                                    name = "menu-down"
                                    size = {22}
                                    color = "#073a9a"
                                />
                            }  
                        />
                        <AccountOptions
                            user = {user}
                            toastRef = {toastRef}
                            setReloadUser = {setReloadUser}
                            isVisible = {isVisible}
                            setIsVisible = {setIsVisible}
                        />
                    </View>
                )
            }
                <Button
                    title = "  Cerrar Sesión"
                    buttonStyle = {styles.btn}
                    titleStyle = {styles.title}
                    onPress={() => {
                        CloseSession()
                        navigation.navigate("games")
                    }}
                    icon = {
                        <Icon
                            type = "material-community"
                            name = "logout"
                            size = {22}
                            color = "#073a9a"
                        />
                    }  
                />
            </BackgroundImage>
            <Image
                source = {require('../../assets/Game_Logo.png')}
                resizeMode = "contain"
                style={styles.image}
            />
            <Toast ref={toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = {loadingText}/>
        </View>
    )
}

const styles = StyleSheet.create({
    btn:{
        ...btn.btn
    },
    title:{
        color: "#073a9a"
    },
    container:{
        backgroundColor: "#f1f1f3"
    },
    btnOpt:{
        backgroundColor: "white",
    },
    titleOpt:{
        color: "#073a9a"
    },
    image:{
        height: 200,
        width: "30%",
        opacity: 0.8,
        position: "absolute",
        top: 30,
        right: -5
    },
    containerText:{
        justifyContent: "center",
        alignItems: "center"
    },
    text:{
        fontSize: 18,
        fontWeight: "bold"
    },
    imageBackground:{
        width: width, 
        height: height
    }
})
