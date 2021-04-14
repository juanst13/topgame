import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import firebase from 'firebase/app'
import { Icon } from 'react-native-elements'

export default function News({ navigation }) {
    const [userLogged, setUserLogged] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false)
    })

    return (
        <View>
            { 
                    userLogged && (
                        <Icon
                            type = "material-community"
                            name = "newspaper-plus"
                            containerStyle =  {styles.icon}
                            color = "#fff"
                            size= {35}
                            onPress = {() => navigation.navigate("add-new")}
                        />
                )
        }
        <Icon
            type = "material-community"
            name = "book-multiple"
            containerStyle =  {styles.iconTop}
            color = "#fff"
            size= {35}
            onPress = {() => navigation.navigate("stores")}
        />
        <Icon
            type = "material-community"
            name = "trophy-award"
            containerStyle =  {styles.iconBottom}
            color = "#fff"
            size= {35}
            onPress = {() => navigation.navigate("news")}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        top: 150,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    iconTop:{
        position: "absolute",
        top: 75,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    },
    iconBottom:{
        position: "absolute",
        top: 200,
        right: 4,
        shadowColor: "black",
        shadowOffset: { width: 2, height: 2},
        shadowOpacity: 0.5,
        borderRadius: 50,
        padding: 5
    }
})
