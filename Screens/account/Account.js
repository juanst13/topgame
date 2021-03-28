import React, { useState, useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Loading from '../../components/Loading'

import { getCurrentUser, isUserLogged } from '../../Utils/actions'
import UserLogged from './UserLogged'
import UserGuest from './UserGuest'
import { useFocusEffect } from '@react-navigation/native'

export default function Account() {
    const [login, setLogin] = useState(null)

    useFocusEffect (
        useCallback(() => {
            const user = getCurrentUser()
            user ? setLogin(true) : setLogin(false)
        }, [])
    )

    if (login == null) {
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return login ? <UserLogged/> : <UserGuest/>
}


const styles = StyleSheet.create({})