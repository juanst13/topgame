import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Favorites from '../Screens/Favorites'

const Stack = createStackNavigator()

export default function FavoriteStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "favorites"
                component ={Favorites}
                options = {{ title: "Favoritos" }}
            />
        </Stack.Navigator>
    )
}
