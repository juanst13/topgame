import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import Search from '../Screens/search/Search'
import Favorites from '../Screens/search/Favorites'
import FavoritesConsoles from '../Screens/search/FavoritesConsoles'
import FavoritesGames from '../Screens/search/FavoritesGames'

const Stack = createStackNavigator()

export default function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "search"
                component = {Search}
                options = {{ title: "Buscar" }}
            />
            <Stack.Screen
                name = "list-favorites-stores"
                component = {Favorites}
                options = {{ title: "Favoritos" }}
            />
            <Stack.Screen
                name = "list-favorites-consoles"
                component = {FavoritesConsoles}
                options = {{ title: "Favoritos" }}
            />
            <Stack.Screen
                name = "list-favorites-games"
                component = {FavoritesGames}
                options = {{ title: "Favoritos" }}
            />
        </Stack.Navigator>
    )
}
