import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'

import { CloseSession, getCurrentUser } from '../../Utils/actions'
import { btn } from '../../Styles'
import Loading from '../../components/Loading'
import InfoUser from '../../components/Account/InfoUser'
import AccountOptions from '../../components/Account/AccountOptions'

export default function UserLogged() {
    const toastRef = useRef()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [user, setUser] = useState(null)
    const [reloadUser, setReloadUser] = useState(false)

    useEffect(() => {
        setUser(getCurrentUser())
        setReloadUser(false)
    }, [reloadUser])

    return (
        <View style = {styles.container}>
            {            
                 user && (
                     <View>
                        <InfoUser   
                            user = {user}
                            setLoadingText = {setLoadingText}
                            setLoading = {setLoading}
                        />
                        <AccountOptions
                            user = {user}
                            toastRef = {toastRef}
                            setReloadUser = {setReloadUser}
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
                        name = {"logout"}
                        size = {22}
                        color = "#073a9a"
                    />
                }   
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
        color: "#1d62d9"
    },
    container:{
        minHeight: "100%",
        backgroundColor: "#f1f1f3"
    }
})