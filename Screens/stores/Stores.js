import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'

import { getCurrentUser, isUserLogged } from '../../Utils/actions'

export default function Stores({ navigation }) {
    const [user, setUser] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            userInfo ? setUser(true) : setUser(false)
        } )
    }, [])

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
