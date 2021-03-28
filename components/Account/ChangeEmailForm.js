import React, { useState } from 'react'
import { isEmpty } from 'lodash'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import { btn } from '../../Styles'
import { reAuthenticate, updateEmail, updateProfile } from '../../Utils/actions'
import { validateEmail } from '../../Utils/helpers'

export default function ChangeEmailForm({ email, setShowModal, toastRef, setReloadUser }) {
    const [newEmail, setNewEmail] = useState(email)
    const [errorEmail, setErrorEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [errorPassword, setErrorPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if(!validateForm()){
            return
        }

        setLoading(true)
        const resultReAuthenticate = await reAuthenticate(password)

        if(!resultReAuthenticate.statusResponse){
            setLoading(false)
            setErrorPassword("Constraseña incorrecta.")
            return
        }

        const resultUpdateEmail = await updateEmail(newEmail)
        setLoading(false)

        if(!resultUpdateEmail.statusResponse){
            setErrorEmail("No se puedes cambiar por este email, ya está en uso por otro usuario.")
            return
        }

        setReloadUser(true)
        toastRef.current.show("Se ha actualizado el email.", 3000)
        setShowModal(false)

    }

    const validateForm = () => {
        setErrorEmail(null)
        setErrorPassword(null)
        let isValid = true

        if(!validateEmail(newEmail)){
            setErrorEmail("Debes ingresar un email válido.")
            isValid = false
        }

        if(isEmpty(password)){
            setErrorPassword("Debes ingresar tu contraseña.")
            isValid = false
        }

        if(newEmail === email){
            setErrorEmail("Debes ingresar un email diferente al actual.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder = "Ingresa email actual"
                containerStyle = {styles.input}
                defaultValue = {newEmail}
                onChange = {(e) => setNewEmail(e.nativeEvent.text)}
                errorMessage = {errorEmail}
                rightIcon ={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#9db6e6"
                }}
            />
            <Input
                placeholder = "Ingresa tu contraseña"
                containerStyle = {styles.input}
                defaultValue = {user.password}
                secureTextEntry = {!showPassword}
                password = {true}
                onChange = {(e) => setPassword(e.nativeEvent.text)}
                errorMessage = {errorPassword}
                rightIcon ={
                    <Icon
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        color= "#9db6e6"
                        onPress = {() => setShowPassword(!showPassword)} 
                    />
                }
            />
            <Button
                buttonStyle = {styles.btn}
                containerStyle = {styles.btnContainer}
                title = "Cambiar Email"
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