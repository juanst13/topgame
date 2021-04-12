import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Stores from '../Screens/stores/Stores'
import AddStores from '../Screens/stores/AddStores'
import Store from '../Screens/stores/Store'
import AddReviewStore from '../Screens/stores/AddReviewStore'

const Stack = createStackNavigator()

export default function StoresStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "stores"
                component = {Stores}
                options = {{ title: "Tiendas" }}
            />
            <Stack.Screen
                name = "add-store"
                component = {AddStores}
                options = {{ title: "Crear Tienda" }}
            />
            <Stack.Screen
                name = "store"
                component = {Store}
            />
            <Stack.Screen
                name = "add-review-store"
                component = {AddReviewStore}
                options = {{ title: "Nuevo Comentario" }}
            />
        </Stack.Navigator>
    )
}

