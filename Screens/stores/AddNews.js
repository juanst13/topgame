import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'

import AddNewsForm from '../../components/Store/AddNewsForm'

export default function AddNews({ navigation }) {
    const toastRef = useRef()
    const [loading, setLoading] = useState(false)
    
    return (
        <KeyboardAwareScrollView>
            <AddNewsForm
                navigation = {navigation}
                setLoading = {setLoading}
                toastRef = {toastRef}
            />
            <Loading isVisible = {loading} text = "Creando noticia..."/>
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({})
