import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Stores from '../Screens/Stores'

const Stack = createStackNavigator()

export default function StoresStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "store"
                component = {Stores}
                options = {{ title: "Tiendas" }}
            />
        </Stack.Navigator>
    )
}

