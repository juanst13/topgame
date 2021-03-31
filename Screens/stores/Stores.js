import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { isUserLogged } from '../../Utils/actions'

export default function Stores() {
    const navigation = useNavigation()
    const [user, setUser] = useState(null)

    useEffect(() => {
        isUserLogged() ? setUser(true) : setUser(false)
    }, [])

    return (
        <View style={styles.viewBody}>
           { 
                user && (
                        <Icon
                                type = "material-community"
                                name = "home-city"//"store-outline"
                                containerStyle =  {styles.icon}
                                size = {40}
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
        bottom: 500,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    },
    viewBody:{
        flex: 1
    }
})
