import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Text, View } from 'react-native'
import { Button, Icon, Input } from 'react-native-elements'
import { isEmpty, result, set, size } from 'lodash'
import { useNavigation } from '@react-navigation/native'

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

    useEffect(() => {
        setHide(false)
    }, [])

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

    if(hide){
        return (
    
            <View style = {styles.containerForm}>
               <Input
                    placeholder = {"Ingresa tu correo"}
                    containerStyle = {styles.container}
                    keyboardType = "email-address"
                    errorMessage = {errorEmail}
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
                <Input
                    placeholder = {"Ingresa tu contraseña"}
                    containerStyle = {styles.container}
                    password = {true}
                    secureTextEntry = {!showPassword}
                    errorMessage = {errorPassword}
                    defaultvalue = {formData.password}
                    onChange = {(e) => onChange(e, "password")}
                    rightIcon = {
                        <Icon
                            type = "material-community"
                            name = { showPassword ? "eye-off-outline" : "eye-outline"}
                            size = {22}
                            iconStyle = {styles.icon}
                            onPress = {() => setShowPassword(!showPassword)}
                        />
                    }
                />
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
                <Text 
                    style = {styles.register}
                        onPress={() => navigation.navigate("register")}
                >
                        ¿Aún no tienes una cuenta?{" "}
                        <Text style = {styles.btncontainer}>
                            Regístrate
                        </Text>
                </Text>
            </View>
        )
    }else{
        return(
            <ScrollView>
                <Text style={styles.title}> {"\n"}{"\n"}Bienvenido a TopGame{"\n"}</Text>
                <Text style={styles.description}>
                    ¡Explora el mundo Gamer de una forma jámas vista! {"\n"}{"\n"} Esta aventura inmersiva. En busqueda de los mejores juegos, tiendas y articulos. Vota y comenta como ha sido tu experiencia para lograr una aventura que envuelva tus sentidos...
                </Text>
                <Button
                        title = "  Ver tu perfil"
                        buttonStyle = {styles.btn}
                        containerStyle = {styles.btnContainer}
                        onPress = {() => setHide(true)}
                        icon = {
                            <Icon
                                type = "material-community"
                                name = "account-star"
                                color = "white"
                                size = {26}
                            />
                        }
                />
            </ScrollView>
        )
    }
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
    icon:{
        color: "#c1c1c1"
    },
    container:{
        ...containerScreen.containerScreen
    },
    image:{
        height: 200,
        width: "110%",
        opacity: 0.8,
        marginHorizontal: 40,
        left: -50
    },
    title:{
        fontWeight: "bold",
        fontSize: 17,
        marginBottom: 10,
        textAlign: "center",
        position: "relative",
        top: -40,
        marginHorizontal: 40,
        color: "#052c73"
    },
    description:{
        textAlign:"justify",
        fontSize: 15,
        color: "#073a9a",
        top: -50
    },
    btn:{
        ...btn.btnIn
    },
    
    register:{
        marginTop: 15,
        marginHorizontal:10,
        alignSelf: "center"
    },
    btncontainer:{
        color: "#5380d3",
        fontWeight: "bold"
    }
})
