import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, TextInput,Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, result, set, size } from 'lodash'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { validateEmail } from '../../Utils/helpers'
import { loginWithEmailAndPassword, registerUser } from '../../Utils/actions'
import Loading from '../Loading'
import { btn, containerForm, containerScreen } from '../../Styles'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorEmail, setErrorEmail] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [hide, setHide] = useState(false)

    const navigation = useNavigation()

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    }

    const ValidatePressEmail = () =>{
        
        if(validateEmail(formData.email)){
            setFormData({...formData, validateTextEmail: 'true'})
        }else{
            setFormData({...formData, validateTextEmail: 'false'})
        }
    }

    const doLogin = async () => {
        if(!validateData()){
            return
        }
        
        setLoading(true)
        const result = await loginWithEmailAndPassword(formData.email, formData.password)
        setLoading(false)

        if(!result.statusResponse){
            setErrorPassword(result.error)
            setErrorEmail(result.error)
            return 
        }
        navigation.navigate("account")
    }

    const validateData = () =>{
        setErrorEmail("")
        setErrorPassword("")
        let isValid = true

        if(!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un email válido.")
            isValid = false
        }

        if(isEmpty(formData.password)){
            setErrorPassword("Debes de ingresar tu contraseña.")
            isValid = false            
        }
        return isValid
    }
        return (
    
            <KeyboardAwareScrollView style = {styles.containerForm}>
                <Text style={styles.title}>
                    {"\n"}
                    <Icon
                        type = "material-community"
                        name = "sword-cross"
                        size = {30}
                        color = "white"
                    />
                    {" "}Continuemos la aventura...
                </Text>
                <View style = {styles.input}>
                    <Input
                            placeholder = {"Ingresa tu correo"}
                            containerStyle = {styles.container}
                            inputContainerStyle = {styles.containerInput}
                            keyboardType = "email-address"
                            errorMessage = {errorEmail}
                            renderErrorMessage = {false}
                            defaultvalue = {formData.email}
                            onChange = {(e) => onChange(e, "email")}
                            onTextInput = {ValidatePressEmail}
                            onBlur = {ValidatePressEmail}
                            rightIcon = {
                                <Icon
                                    type = "material-community"
                                    name = "progress-check"
                                    size = {22}
                                    onPress = {() => setShowPassword(!showPassword)}
                                    color = { formData.validateTextEmail === "true" ? "#073a9a" : "#c1c1c1" }
                                />
                            }
                        />
                </View>
                <View style = {styles.input}>
                    <Input
                        placeholder = {"Ingresa tu contraseña"}
                        containerStyle = {styles.container}
                        inputContainerStyle = {styles.containerInput}
                        password = {true}
                        secureTextEntry = {!showPassword}
                        errorMessage = {errorPassword}
                        renderErrorMessage = {false}
                        defaultvalue = {formData.password}
                        onChange = {(e) => onChange(e, "password")}
                        rightIcon = {{
                                type: "material-community",
                                name: showPassword ? "eye-off-outline" : "eye-outline",
                                size: 22,
                                iconStyle: styles.icon,
                                onPress: () => setShowPassword(!showPassword),
                                color:  showPassword ? "#9119b0" : "#c1c1c1"
                        }}
                    />
                </View>
                <Button
                    title = "  Iniciar Sesión"
                    buttonStyle = {styles.btn}
                    containerStyle = {styles.btnContainer}
                    onPress = {() => doLogin()}
                    icon = {
                        <Icon
                            type = "material-community"
                            name = "account-star"
                            color = "white"
                            size = {26}
                        />
                    }
                />
                <Loading isVisible={loading} text = "Iniciando Sesión..."/>
            </KeyboardAwareScrollView>
        )
}

const defaultFormValues = () => {
    return { email: "", password: "", validateTextEmail: null}
}

const styles = StyleSheet.create({
    containerForm:{
        ...containerForm.containerForm
    },
    btn:{
        ...btn.btnIn
    },
    btnContainer:{
        ...btn.btnContainer
    },
    container:{
        ...containerScreen.containerScreen
        
    },
    btn:{
        ...btn.btnIn
    },
    input:{
        marginTop: 10,
        borderLeftWidth: 1,
        borderRightWidth: 3,
        borderTopWidth: 1,
        borderBottomWidth: 3,
        width: "90%",
        borderRadius: 25,
        borderColor: "#C3C3C3",
        backgroundColor: "white",
        opacity: 0.6,
        alignItems: "center",
        justifyContent: "center"
    },
    title:{
        fontWeight: "bold",
        fontSize: 30,
        marginBottom: 10,
        textAlign: "left",
        position: "relative",
        marginHorizontal: 40,
        color: "#F3F3F3"
    },
    containerInput:{
        borderBottomWidth: 0
    }
})
