import React, { useState, useCallback, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from "@react-navigation/native"
import { Button, Icon } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'
import { getFavorites } from '../../Utils/actions'

export default function Favorites({ navigation }) {
    const toastRef = useRef()

    const [userLogged, setUserLogged] = useState(false)
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(false)
    const [realoadData, setRealoadData] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            if (userLogged){
                async function getData() {
                    setLoading(true)
                    const response = await getFavorites()
                    setStores(response.favorites)
                    setLoading(false)
                }
                getData()
            }
            setRealoadData(false)
        }, [userLogged, realoadData])
    )

    if (!userLogged){
        return <UserNoLogged navigation = {navigation}/>
    }

    if (!stores){
        return <Loading isVisible = {true} test = "Cargando tiendas..."/>
    } else if (stores?.lenght === 0){
        return <NotFoundStore/>
    }

    return (
        <View style = {styles.viewBody}>
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Por favor espere..." />
            <View style = {styles.btns}>
                <Button
                    containerStyle = {styles.containerBtn}
                    title = "Juegos"
                    onPress = {() => navigation.navigate("list-favorites-games")}
                />
                <Button
                    containerStyle = {styles.containerBtn}
                    title = "Tiendas"
                    onPress = {() => navigation.navigate("list-favorites-stores")}
                />
                <Button
                    containerStyle = {styles.containerBtn}
                    title = "Consolas"
                    onPress = {() => navigation.navigate("list-favorites-consoles")}
                />
            </View>
        </View>
    )
}

function NotFoundStore() {
    return(
        <View style = {{ flex:1, alignItems: "center", justifyContent: "center"}}>
            <Icon type = "material-community" name = "alert-outline" size = {50}/>
            <Text style = {{ fontSize: 20, fontWeight: "bold" }}>
                Aún no tienes tiendas favoritas
            </Text>
        </View>
    )
}

function UserNoLogged({ navigation }){
    return(
        <View style = {{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon type = "material-community" name = "alert-outline" size = {50}/>
            <Text style = {{ fontSize: 20, fontWeight: "bold" }}>
                Necesitas estar logueado para ver los favoritos
            </Text>
            <Button
                title = "Ir al login"
                containerStyle = {{ margin: 20, width: "80%" }}
                buttonStyle = {{ backgroundColor: "#442484"}}
                onPress = {() => navigation.navigate("login", { screen: "login" } )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1
    },
    btns:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-end"
    },
    containerBtn:{
        padding: 5
    }
})
