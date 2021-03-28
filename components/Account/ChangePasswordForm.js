import React, { useState } from 'react'
import { isEmpty, size } from 'lodash'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'

import { btn } from '../../Styles'
import { reAuthenticate, updatePassword } from '../../Utils/actions'

export default function ChangePasswordForm({ setShowModal, toastRef }) {
    const [newPassword, setNewPassword] = useState(null)
    const [currentPassword, setCurrentPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null)
    const [errorCurrentPassword, setErrorCurrentPassword] = useState(null)
    const [errorNewPassword, setErrorNewPassword] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async() => {
        if(!validateForm()){
            return
        }

        setLoading(true)
        const result = await reAuthenticate(currentPassword)

        if(!result.statusResponse){
            setLoading(false)
            setErrorCurrentPassword("Contraseña incorrecta.")
            return
        }

        const resultUpdatePassword = await updatePassword(newPassword)
        setLoading(false)

        if(!resultUpdatePassword.statusResponse){
            setErrorNewPassword("Hubo un problema cambiando la contraseña, por favor intente más tarde.")
            return
        }
        toastRef.current.show("Se ha actualizado la contraseña.", 3000)
        setShowModal(false)
    }

    const validateForm = () => {
        setErrorCurrentPassword(null)
        setErrorNewPassword(null)
        setErrorConfirmPassword(null)
        let isValid = true

        if(isEmpty(currentPassword)){
            setErrorCurrentPassword("Debes ingresar tu contraseña.")
            isValid = false
        }

        if(size(newPassword) < 6){
            setErrorNewPassword("Debes ingresar una nueva contraseña de al menos 6 carácteres.")
            isValid = false
        }

        if(size(confirmPassword) < 6){
            setErrorConfirmPassword("Debes ingresar una nueva confirmación de tu contraseña de al menos 6 carácteres.")
            isValid = false
        }

        if(newPassword !== confirmPassword){
            setErrorNewPassword("La nueva contraseña y la confirmación no son iguales.")
            setErrorConfirmPassword("La nueva contraseña y la confirmación no son iguales.")
            isValid = false
        }

        if(newPassword === currentPassword) {
            setErrorCurrentPassword("Debes ingresar una contraseña diferente a la actual.")
            setErrorNewPassword("Debes ingresar una contraseña diferente a la actual.")
            setErrorConfirmPassword("Debes ingresar una contraseña diferente a la actual.")
            isValid = false
        }

        return isValid
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder = "Ingresa tu contraseña actual..."
                containerStyle = {styles.input}
                defaultValue = {currentPassword}
                secureTextEntry = {!showPassword}
                password = {true}
                onChange = {(e) => setCurrentPassword(e.nativeEvent.text)}
                errorMessage = {errorCurrentPassword}
                rightIcon ={
                    <Icon
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        color= "#9db6e6"
                        onPress = {() => setShowPassword(!showPassword)} 
                    />
                }
            />
            <Input
                placeholder = "Ingresa tu nueva contraseña..."
                containerStyle = {styles.input}
                defaultValue = {newPassword}
                secureTextEntry = {!showPassword}
                password = {true}
                onChange = {(e) => setNewPassword(e.nativeEvent.text)}
                errorMessage = {errorNewPassword}
                rightIcon ={
                    <Icon
                        type= "material-community"
                        name= { showPassword ? "eye-off-outline" : "eye-outline"}
                        color= "#9db6e6"
                        onPress = {() => setShowPassword(!showPassword)} 
                    />
                }
            />
            <Input
                placeholder = "Confirma tu contraseña..."
                containerStyle = {styles.input}
                defaultValue = {confirmPassword}
                secureTextEntry = {!showPassword}
                password = {true}
                onChange = {(e) => setConfirmPassword(e.nativeEvent.text)}
                errorMessage = {errorConfirmPassword}
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
                title = "Cambiar contraseña"
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