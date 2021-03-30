import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Account from '../Screens/account/Account'
import Login from '../Screens/account/Login'
import Register from '../Screens/account/Register'

const Stack = createStackNavigator()

export default function AccountStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name= "account"
                component = {Account}
                options = {{ title: "Iniciar Sesión" }}
            />
            <Stack.Screen
                name= "login"
                component = {Login}
                options = {{ title: "Iniciar Sesión2" }}
            />
            <Stack.Screen
                name= "register"
                component = {Register}
                options = {{ title: "Registrar usuario" }}
            />
        </Stack.Navigator>
    )
}
