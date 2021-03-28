import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Games from '../Screens/Games'

const Stack = createStackNavigator()

export default function GamesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "games"
                component ={Games}
                options = {{ title: "Gaming" }}
            />
        </Stack.Navigator>
    )
}
