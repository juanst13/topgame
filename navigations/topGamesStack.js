import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import topGames from '../Screens/topGames'

const Stack = createStackNavigator()

export default function topGamesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "topGames"
                component = {topGames}
                options = {{ title: "Top 5" }}
            />
        </Stack.Navigator>
    )
}
