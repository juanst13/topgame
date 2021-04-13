import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'

export default function Search({ navigation }) {

    return (
        <View>
            <Icon
                type = "material-community"
                name = "star"
                size = {30}
                containerStyle = {styles.icon}
                reverse
                color = "#d9b453"
                onPress = {() => navigation.navigate("list-favorites-stores")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    icon:{
        position: "absolute",
        top: 150,
        right: 15,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5
    }
})
