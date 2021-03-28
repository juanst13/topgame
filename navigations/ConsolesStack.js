import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Consoles from '../Screens/Consoles'

const Stack = createStackNavigator()

export default function ConsolesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "consoles"
                component = {Consoles}
                options = {{ title: "Consolas" }}
            />
        </Stack.Navigator>
    )
}

