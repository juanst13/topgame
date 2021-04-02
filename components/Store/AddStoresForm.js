import React, { useState } from 'react'
import { Alert, Dimensions, StyleSheet, ScrollView, Text, View } from 'react-native'
import { Avatar, Input, Image, Button, Icon } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, fromPairs } from 'lodash'

import { loadImageFromGallery } from '../../Utils/helpers'
import Modal from '../../components/Modal'

const widthScreen = Dimensions.get("window").width

export default function AddStoresForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorUrl, setErrorUrl] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [errorDescription, setErrorDescrition] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationStore, setLocationStore] = useState(null)

    const addStore = () =>{
        console.log(formData)
        console.log("Creando...")
    }

    return (
        <ScrollView style = {styles.viewContainer}>
            <ImageStore
                imageStore = {imagesSelected[0]}
            />
            <FormAdd
                formData = {formData}
                setFormData = {setFormData}
                errorName = {errorName}
                errorAddress = {errorAddress}
                errorEmail = {errorEmail}
                errorUrl = {errorUrl}
                errorPhone = {errorPhone}
                errorDescription = {errorDescription}
                setIsVisibleMap = {setIsVisibleMap}
            />
            <UploadImage
                toastRef = {toastRef}
                imagesSelected = {imagesSelected}
                setImagesSelected = {setImagesSelected}
            />
            <Button
                title = "Crear Tienda"
                onPress = {addStore}
                buttonStyle = {styles.btnAddRestaurant}
            />
            <MapStore
                isVisibleMap = {isVisibleMap}
                setIsVisibleMap = {setIsVisibleMap}
                setLocationStore = {setLocationStore}
                toastRef = {toastRef}
            />
        </ScrollView>
    )
}

function MapStore({ isVisibleMap, setIsVisibleMap, setLocationStore, toastRef }){
    return(
        <Modal
            isVisible = {isVisibleMap}
            setVisible = {setIsVisibleMap}
        >
            <Text>Map goes here</Text>
        </Modal>
    )
}

function ImageStore({ imageStore }){
    return(
        <View style = {styles.viewPhoto}>
            <Image
                style = {{ width: widthScreen, height: 200 }}
                source = {
                    imageStore
                    ? {uri: imageStore}
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }){
    const imageSelected = async() => {
        const response = await loadImageFromGallery([4, 3])
        if(!response.status){
            toastRef.current.show("No has seleccionado ninguna imagen.", 3000)
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro que deseas eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Si",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {
                cancelable: true
            }
        )
    }

    return(
        <ScrollView
            horizontal
            style = {styles.viewImage}
        >
            {    
                size(imagesSelected) < 10 &&(        
                    <Icon
                        type = "material-community"
                        name = "camera"
                        color = "#7A7A7A"
                        containerStyle = {styles.containerIcon}
                        onPress = {imageSelected}
                    />
                )
            }
            {
                map(imagesSelected, (imageStore, index) => (
                    <Avatar
                        key = {index}
                        style = {styles.miniature}
                        source = {{ uri: imageStore }}
                        containerStyle = {styles.miniContainer}
                        onPress = {() => removeImage(imageStore)}
                    />
                ))
            }
        </ScrollView>
    )
}

function FormAdd({ 
    formData, 
    setFormData, 
    errorName, 
    errorAddress, 
    errorEmail, 
    errorUrl, 
    errorPhone, 
    errorDescription,
    setIsVisibleMap} ) {
    const [country, setCountry] = useState("CO")
    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({...formData, [type] : e.nativeEvent.text })
    }

    return(
        <View style = {styles.viewForm}>
            <Input
                placeholder = "Nombre de la tienda"
                defaultValue = {formData.name}
                onChange = {(e) => onChange(e, "name")}
                errorMessage = {errorName}
            />
            <Input
                placeholder = "Dirección de la tienda"
                defaultValue = {formData.address}
                onChange = {(e) => onChange(e, "address")}
                errorMessage = {errorAddress}
                rightIcon = {{
                    type: "material-community",
                    name: "google-maps",
                    color: "#C2C2C2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder = "Email de la tienda"
                keyboardType = "email-address"
                defaultValue = {formData.email}
                onChange = {(e) => onChange(e, "email")}
                errorMessage = {errorEmail}
            />
            <Input
                placeholder = "Página Web"
                defaultValue = {formData.url}
                onChange = {(e) => onChange(e, "url")}
                errorMessage = {errorUrl}
            />
            <View style = {styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle = {styles.countryPicker}
                    countryCode = {country}
                    onSelect = {(country) =>{
                        setFormData({
                            ...formData, 
                            "country": country.cca2, 
                            "callingCode": country.callingCode[0]})
                    }}
                />
                <Input
                    placeholder = "WhatsApp de la tienda..."
                    keyboardType = "phone-pad"
                    containerStyle = {styles.inputPhone}
                    defaultValue = {formData.phone}
                    onChange = {(e) => onChange(e, "phone")}
                    errorMessage = {errorPhone}
                />
            </View>
            <Input
                    placeholder = "Descripción de la tienda"
                    multiline
                    containerStyle = {styles.textArea}
                    defaultValue = {formData.description}
                    onChange = {(e) => onChange(e, "description")}
                    errorMessage = {errorDescription}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return{
        name: "",
        address: "",
        email:"",
        url: "",
        phone: "",
        description: "",
        country: "CO",
        callingCode: "57"
    }
}

const styles = StyleSheet.create({
    viewContainer:{
        marginTop: 10,
        height: "100%"
    },
    viewForm:{
        marginHorizontal: 10
    },
    textArea:{
        height: 100,
        width: "100%"
    },
    phoneView:{
        marginHorizontal: 10,
        width: "80%",
        flexDirection: "row"
    },
    inputPhone:{
        width: "80%"
    },
    btnAddRestaurant:{
        margin: 20,
        backgroundColor: "#073a9a"
    },
    viewImage:{
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon:{
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        borderRadius: 15,
        backgroundColor: "#E3E3E3"
    },
    miniature:{
        width: 70,
        height: 70,
        marginRight: 10,
        borderRadius: 0
    },
    miniContainer:{
        borderRadius: 15
    },
    viewPhoto:{
        alignItems: "center",
        height: 200,
        marginBottom: 20
    }
})
