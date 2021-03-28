import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { set, size } from 'lodash'
import { useNavigation } from '@react-navigation/native'

import { validateEmail } from '../../Utils/helpers'
import { registerUser } from '../../Utils/actions'
import Loading from '../Loading'
import { btn, containerForm } from '../../Styles/index'

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [errorConfirm, setErrorConfirm] = useState("")
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text})
    }

    const validatePress = () => {

        if (validateEmail(formData.email)){
            setFormData({...formData, validateEmail: 'true'})
            
        }else{
            setFormData({...formData, validateEmail: 'false'})
        }
        return
    }

    const validatePressPassword = () => {

        if (size(formData.password) < 6){
            setFormData({...formData, validatePassword: 'false'})
            
        }else{
            setFormData({...formData, validatePassword: 'true'})
        }
        return
    }

    const validatePressConfirm = () => {

        if (formData.password !== formData.confirm){
            setFormData({...formData, validateConfirm: 'false'})
            
        }else{
            setFormData({...formData, validateConfirm: 'true'})
        }
        return
    }

    const doRegisterUser = async() => {
        if (!validateData()){
            return;
        }

        setLoading(true)
        const result = await registerUser(formData.email, formData.password)
        setLoading(false)

        if(!result.statusResponse){
            setErrorEmail(result.error)
            return
        }
        navigation.navigate("account")
    }

    const validateData = () => {
        setErrorConfirm("")
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if (!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un email válido")
            isValid = false
        }

        if(size(formData.password) < 6){
            setErrorPassword("Debes ingresar una contraseña de al menos seis carácteres.")
            isValid = false
        }

        if(size(formData.confirm) < 6){
            setErrorConfirm("Debes ingresar una confirmación de contraseña de al menos seis carácteres.")
            isValid = false
        }

        if(formData.password !== formData.confirm){
            setErrorPassword("La contraseña y la confirmación no son iguales")
            setErrorConfirm("La contraseña y la confirmación no son iguales")
            isValid = false
        }

        return isValid
    }

    return (
        <View style = {styles.containerForm}>
            <Input
                containerStyle = {styles.form}
                placeholder = "Ingresa tu email..."
                onChange = {(e) => onChange(e, "email")}
                keyboardType = "email-address"
                errorMessage = {errorEmail}
                defaultValue = {formData.email}
                onTextInput = {validatePress}
                onBlur = {validatePress}
                rightIcon={
                    <Icon
                        type = "material-community"
                        name =  "progress-check"
                        size = {22}
                        color = { formData.validateEmail === "true" ? "#073a9a" : "#c1c1c1" }
                    />
                }
            />
            <Input
                containerStyle = {styles.form}
                placeholder = "Ingresa tu contraseña..."
                password = {true}
                secureTextEntry = {!showPassword}
                onChange = {(e) => onChange(e, "password")}
                errorMessage = {errorPassword}
                defaultValue = {formData.password}
                onTextInput = {validatePressPassword}
                onBlur = {validatePressPassword}
                rightIcon={
                    <Icon
                        type = "material-community"
                        name = { showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                        color = { formData.validatePassword === "true" ? "#073a9a" : "#C2C2C2" }
                        size = {22}
                    />
                }
            />
            <Input
                containerStyle = {styles.form}
                placeholder = "Confirma tu contraseña..."
                password = {true}
                secureTextEntry = {!showPassword}
                onChange = {(e) => onChange(e, "confirm")}
                errorMessage = {errorConfirm}
                defaultValue = {formData.confirm}
                onTextInput = {validatePressConfirm}
                onBlur = {validatePressConfirm}
                rightIcon={
                    <Icon
                        type = "material-community"
                        name = { showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setShowPassword(!showPassword)}
                        color = { formData.validateConfirm === "true" ? "#073a9a" : "#C2C2C2" }
                        size = {22}
                    />
                }
            />
            <Button
                icon={
                    <Icon
                        type = "material-community"
                        name = "account-plus-outline"
                        size = {22}
                        color = "white"  
                    />
                }
                buttonStyle = {styles.btn}
                title = "  Registrar nuevo usuario"
                onPress = {() => doRegisterUser()}
                containerStyle = {styles.btnContainer}
            />
            <Loading isVisible={loading} text="Creando Cuenta..."/>
        </View>
    )
}

const defaultFormValues = () => {
    return { email: "", password: "", confirm: "", validateEmail: null,  validatePassword: null,  validateConfirm: null  }
}

const styles = StyleSheet.create({
    containerForm:{
        ...containerForm.containerForm
    },
    btnContainer:{
        ...btn.btnContainer
    },
    btn:{
        ...btn.btnIn
    }
})
