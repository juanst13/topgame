import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'

import GamesStack from './GamesStack'
import AccountStack from './AccountStack'
import SearchStack from './SearchStack'
import ConsolesStack from './ConsolesStack'
import StoresStack from './StoresStack'


const Tab = createBottomTabNavigator()

export default function Navigation() {
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "games":
                iconName = "google-controller" /*"gamepad-variant-outline" - google-controller - space-invaders */
                break;
            case "account":
                iconName = "shield-key-outline" /*shield-account-outline card-account-details-star-outline home-circle card-account-details-star-outline*/
                break;
            case "search":
                iconName = "target-account" /*crosshairs - bee-flower - boomerang - owl - rotate-orbit shield-key-outline tank*/
                break;
            case "consoles":
                iconName = "fire" /*fire - battlenet - nuke - one-up - pac-man*/
                break;
            case "stores":
                iconName = "star-circle-outline" /*store-outline shield-star-outline cards-outline progress-star - rocket-launch-outline - shield-bug-outline*/
                break;
        }
        return(
            <Icon
                type = "material-community"
                name = {iconName}
                size = {22}
                color = {color}
            />
        )
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="stores"
                tabBarOptions = {{
                    inactiveTintColor: "#84a4e0",
                    activeTintColor: "#073a9a" 
                }}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({color}) => screenOptions(route, color)
                })} 
            >
                <Tab.Screen
                    name="games"
                    component={GamesStack}
                    options={{ title: "Juegos" }}
                />
                <Tab.Screen
                    name="consoles"
                    component={ConsolesStack}
                    options={{ title: "Consolas" }}
                />
                <Tab.Screen
                    name="stores"
                    component={StoresStack}
                    options={{ title: "Tiendas" }}
                />
                <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{ title: "Buscar" }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}