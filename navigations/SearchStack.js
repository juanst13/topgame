import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { Button, Icon } from 'react-native-elements'

import Favorites from '../Screens/search/Favorites'
import FavoritesConsoles from '../Screens/search/FavoritesConsoles'
import FavoritesGames from '../Screens/search/FavoritesGames'
import FavoritesNews from '../Screens/search/FavoritesNews'
import TopStore from '../Screens/search/TopStore'
import Search from '../Screens/search/Search'
import TopGames from '../Screens/search/TopGames'
import TopConsoles from '../Screens/search/TopConsoles'
import TopNews from '../Screens/search/TopNews'


const Stack = createStackNavigator()

export default function SearchStack({ navigation }) {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name = "search"
                component = {Search}
                options = {{ title: "Buscar",
                    headerTintColor: "#073a9a",
                    headerRight: (props) => (
                        <Button
                            title = "Favoritos"
                            titleStyle = {{ color: "#84a4e0", fontSize: 20}}
                            buttonStyle = {{ backgroundColor: "#fff", paddingHorizontal: 5, marginHorizontal: 10 }}
                            icon ={
                                <Icon
                                    type = "material-community"
                                    name = "star-outline"
                                    color = "#84a4e0"
                                    marginHorizontal = {3}
                                />
                            }
                            onPress = {() => navigation.navigate("list-favorites-stores")}
                        />
                    )
                }}
            />
            <Stack.Screen
                name = "list-favorites-stores"
                component = {Favorites}
                options = {{ title: "Favoritos",
                    headerTintColor: "#073a9a",
                    headerRight: (props) => (
                        <Button
                            title = "Tiendas"
                            titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                            buttonStyle = {{ 
                                backgroundColor: "#073a9a", 
                                paddingHorizontal: 5, 
                                marginHorizontal: 20,
                                paddingVertical: 2 
                            }}
                            icon ={
                                <Icon
                                    type = "material-community"
                                    name = "star"
                                    color = "#fff"
                                    marginHorizontal = {5}
                                />
                            }
                        />
                    )
                }}
            />
            <Stack.Screen
                name = "list-favorites-consoles"
                component = {FavoritesConsoles}
                options = {{ title: "Favoritos",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Consolas"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#84a4e0", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "controller-classic"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("list-favorites-stores")}
                    />
                )
            }}
        />
            <Stack.Screen
                name = "list-favorites-games"
                component = {FavoritesGames}
                options = {{ title: "Favoritos",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Juegos"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#073a9a", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "tank"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("list-favorites-stores")}
                    />
                )
            }}
        />
            <Stack.Screen
                name = "list-favorites-news"
                component = {FavoritesNews}
                options = {{ title: "Favoritos",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Noticias"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#d9b453", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "newspaper-variant-multiple"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("list-favorites-stores")}
                    />
                )
            }}
        />
        <Stack.Screen
                name = "top-stores"
                component = {TopStore}
                options = {{ title: "Top 10",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Tiendas"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#073a9a", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "star"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("list-favorites-stores")}
                    />
                )
            }}
        />
        <Stack.Screen
                name = "top-games"
                component = {TopGames}
                options = {{ title: "Top 10",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Juegos"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#073a9a", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "star"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("top.games")}
                    />
                )
            }}
        />
        <Stack.Screen
                name = "top-consoles"
                component = {TopConsoles}
                options = {{ title: "Top 10",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Consolas"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#84a4e0", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "star"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("top-consoles")}
                    />
                )
            }}
        />
        <Stack.Screen
                name = "top-news"
                component = {TopNews}
                options = {{ title: "Top 10",
                headerTintColor: "#073a9a",
                headerRight: (props) => (
                    <Button
                        title = "Noticias"
                        titleStyle = {{ color: "#fff", fontSize: 20, marginRight: 10 }}
                        buttonStyle = {{ 
                            backgroundColor: "#d9b453", 
                            paddingHorizontal: 5, 
                            marginHorizontal: 20,
                            paddingVertical: 2 
                        }}
                        icon ={
                            <Icon
                                type = "material-community"
                                name = "newspaper-variant-multiple"
                                color = "#fff"
                                marginHorizontal = {5}
                            />
                        }
                        onPress = {() => navigation.navigate("top-consoles")}
                    />
                )
            }}
        />
        </Stack.Navigator>
    )
}
