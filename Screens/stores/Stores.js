import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'
import { useFocusEffect } from "@react-navigation/native"

import { getCurrentUser, getStores, isUserLogged } from '../../Utils/actions'
import Loading from '../../components/Loading'

export default function Stores({ navigation }) {
    const [user, setUser] = useState(null)
    const [startStore, setStartStore] = useState(null)
    const [stores, setStores] = useState([])    
    const [loading, setLoading] = useState(false)

    const limitStores = 7
    console.log(stores)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        } )
    }, [])

    useFocusEffect(
        useCallback(async() => {
            setLoading(true)
            const response = await getStores(limitStores)
            if(response.statusResponse){
                setStartStore(response.startStore)
                setStores(response.stores)
            }
            setLoading(false)
        }, [])
    )

    return (
        <View style={styles.viewBody}>
           { 
                user && (
                        <Icon
                                type = "material-community"
                                name = "home-city"//"store-outline"
                                containerStyle =  {styles.icon}
                                reverse
                                color = "#d9b453"
                                onPress = {() => navigation.navigate("add-store")}
                            />
                )
            }
            <Loading isVisible={loading} text="Cargando tiendas..."/>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        top: 150,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    viewBody:{
        flex: 1
    }
})
