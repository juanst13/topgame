import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Stores from '../Screens/stores/Stores'
import AddStores from '../Screens/stores/AddStores'

const Stack = createStackNavigator()

export default function StoresStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "store"
                component = {Stores}
                options = {{ title: "Tiendas" }}
            />
            <Stack.Screen
                name = "add-store"
                component = {AddStores}
                options = {{ title: "Crear Tienda" }}
            />
        </Stack.Navigator>
    )
}

