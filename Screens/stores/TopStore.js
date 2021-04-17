import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import { getTopStore } from '../../Utils/actions'
import Loading from '../../components/Loading'
import ListTopStore from '../../components/Ranking/ListTopStore'

export default function TopStore({ navigation }) {
    const [stores, setStores] = useState(null)
    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
                async function getData() {
                    setLoading(true)
                    const response = await getTopStore(10)
                    if (response.statusResponse){
                        setStores(response.stores)
                    }
                    setLoading(false)
                }
                getData()
            },
        [],)
    )

    return (
        <View>
            <ListTopStore
                stores = {stores}
                navigation = {navigation}
            />
            <Loading isVisible = {loading} text = "Por favor espere..." />
        </View>
    )
}

const styles = StyleSheet.create({})
