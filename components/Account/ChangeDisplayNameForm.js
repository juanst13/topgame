import React, { useState } from 'react'
import { isEmpty } from 'lodash'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from 'react-native-elements'

import { btn } from '../../Styles'
import { updateProfile } from '../../Utils/actions'

export default function ChangeDisplayNameForm({ displayName, setShowModal, toastRef, setReloadUser }) {
    const [newDisplayName, setNewDisplayName] = useState(displayName)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if(!validateForm()){
            return
        }

        setLoading(true)
        const result = await updateProfile({ displayName: newDisplayName})
        setLoading(false)

        if(!result.statusResponse){
            setError("Error al actualizar los nombres y apellidos, intenta más tarde.")
            return
        }

        setReloadUser(true)
        toastRef.current.show("Se han actualizado nombres y apellidos.", 3000)
        setShowModal(false)
    }

    const validateForm = () => {
        setError(null)

        if(isEmpty(newDisplayName)){
            setError("Debes ingresar nombres y apellidos.")
            return false
        }

        if(newDisplayName === displayName){
            setError("Debes ingresar nombres y apellidos diferentes a los actuales.")
            return false
        }

        return true
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder = "Ingresa Nombres y Apellidos"
                containerStyle = {styles.input}
                defaultValue = {displayName}
                onChange = {(e) => setNewDisplayName(e.nativeEvent.text)}
                errorMessage = {error}
                rightIcon ={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#9db6e6"
                }}
            />
            <Button
                buttonStyle = {styles.btn}
                containerStyle = {styles.btnContainer}
                title = "Cambiar Nombres y Apellidos"
                onPress = {onSubmit}
                loading = {loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    btn:{
        ...btn.btnIn
    },
    view:{
        alignItems: "center",
        paddingVertical: 10
    },
    input:{
        marginBottom: 10
    },
    btnContainer:{
        width: "90%"
    }
})
