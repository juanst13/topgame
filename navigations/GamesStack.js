import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Games from '../Screens/games/Games'
import AddGames from '../Screens/games/AddGames'
import Game from '../Screens/games/Game'
import AddReviewGame from '../Screens/games/AddReviewGame'

const Stack = createStackNavigator()

export default function GamesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "games"
                component ={Games}
                options = {{ title: "Juegos",
                headerTintColor: "#073a9a" }}
            />
            <Stack.Screen
                name= "add-games"
                component ={AddGames}
                options = {{ title: "Crear Juegos",
                headerTintColor: "#073a9a" }}
            />
            <Stack.Screen
                name= "game"
                component ={Game}
            />
            <Stack.Screen
                name= "add-review-game"
                component ={AddReviewGame}
                options = {{ title: "Nuevo Comentario",
                headerTintColor: "#073a9a" }}
            />
        </Stack.Navigator>
    )
}
