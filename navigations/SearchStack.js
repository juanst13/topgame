import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Search from '../Screens/Search'

const Stack = createStackNavigator()

export default function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "search"
                component = {Search}
                options = {{ title: "Buscar" }}
            />
        </Stack.Navigator>
    )
}
