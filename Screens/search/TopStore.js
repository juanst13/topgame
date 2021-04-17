import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Icon } from 'react-native-elements'

import { getTopStore } from '../../Utils/actions'
import Loading from '../../components/Loading'
import ListTopStore from '../../components/Ranking/ListTopStore'

export default function TopStore({ navigation }) {
    const [stores, setStores] = useState(null)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
                async function getData() {
                    setLoading(true)
                    const response = await getTopStore(10)
                    if (response.statusResponse){
                        setStores(response.stores)
                    }
                    setLoading(false)
                }
                getData()
            },
        [],)
    )

    return (
        <View>
            <ListTopStore
                stores = {stores}
                navigation = {navigation}
            />
            <View style = {styles.btns}>
                <Icon
                    containerStyle = {styles.RightIconTop}
                    type = "material-community"
                    name = "tank"
                    onPress = {() => navigation.navigate("list-favorites-games")}
                    color = "#073a9a"
                    size= {20}
                    reverse
                />
                <Icon
                    containerStyle = {styles.RightIconBottom}
                    type = "material-community"
                    name = "controller-classic"
                    onPress = {() => navigation.navigate("list-favorites-consoles")}
                    color = "#84a4e0"
                    size= {20}
                    reverse
                />
                <Icon
                    containerStyle = {styles.iconBottom}
                    type = "material-community"
                    name = "newspaper-variant-multiple"
                    onPress = {() => navigation.navigate("list-favorites-news")}
                    color = "#d9b453"
                    size= {20}
                    reverse
                />
            </View>
            <Loading isVisible = {loading} text = "Por favor espere..." />
        </View>
    )
}

const styles = StyleSheet.create({
    iconBottom:{
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    RightIconBottom:{
        position: "absolute",
        bottom: 80,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    RightIconTop:{
        position: "absolute",
        bottom: 150,
        right: 10,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    }
})
