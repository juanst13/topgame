import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Stores from '../Screens/stores/Stores'
import AddStores from '../Screens/stores/AddStores'
import Store from '../Screens/stores/Store'
import AddReviewStore from '../Screens/stores/AddReviewStore'
import News from '../Screens/stores/News'
import AddNews from '../Screens/stores/AddNews'
import Notice from '../Screens/stores/Notice'
import AddReviewNotice from '../Screens/stores/AddReviewNotice'
import { Button, Icon } from 'react-native-elements'

const Stack = createStackNavigator()

export default function StoresStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "stores"
                component = {Stores}
                options = {{ title: "Tiendas",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Noticias"
                        titleStyle = {{ color: "#84a4e0", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#fff", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20 }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "star-outline"
                                color = "#84a4e0"
                                marginHorizontal = {3}
                            />
                        }
                        onPress = {() => navigation.navigate("news")}
                    />
                )
            }}
        />
            <Stack.Screen
                name = "add-store"
                component = {AddStores}
                options = {{ title: "Crear Tienda",
                headerTintColor: "#073a9a" }}
            />
            <Stack.Screen
                name = "store"
                component = {Store}
            />
            <Stack.Screen
                name = "add-review-store"
                component = {AddReviewStore}
                options = {{ title: "Nuevo Comentario",
                headerTintColor: "#073a9a" }}
            />
            <Stack.Screen
                name = "news"
                component = {News}
                options = {{ title: "Noticias",
                headerTintColor: "#073a9a" }}
            />
            <Stack.Screen
                name = "add-new"
                component = {AddNews}
                options = {{ title: "Crear Noticia",
                headerTintColor: "#073a9a" }}
            />
            <Stack.Screen
                name = "notice"
                component = {Notice}
            />
            <Stack.Screen
                name = "add-review-notice"
                component = {AddReviewNotice}
                options = {{ title: "Nuevo Comentario",
                headerTintColor: "#073a9a" }}
            />
            
        </Stack.Navigator>
    )
}

