import React, { useState, useEffect } from 'react'
import { Alert, ImageBackground, Dimensions, StyleSheet, ScrollView, Switch, Text, View } from 'react-native'
import { Avatar, Input, Image, Button, Icon, Slider } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { map, size, filter, isEmpty, isNull } from 'lodash'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'

import { getCurrentLocation, loadImageFromGallery, validateEmail } from '../../Utils/helpers'
import { addDocumentWithOutId, getCurrentUser, uploadImage } from '../../Utils/actions'
import Modal from '../../components/Modal'
import { btn } from '../../Styles'

const {width, height} = Dimensions.get("window")

export default function AddStoresForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [digitalStore, setDigitalStore] = useState(false)
    const [errorName, setErrorName] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorEmail, setErrorEmail] = useState(null)
    const [errorUrl, setErrorUrl] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [errorDescription, setErrorDescrition] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationStore, setLocationStore] = useState(null)

    const addStore = async() =>{
        if(!validateForm()){
            return
        }

        setLoading(true)
        const responseUploadImages = await uploadImages()
        const store = {
            name:   formData.name,
            address:   formData.address,
            storeDigital:   digitalStore,
            email:   formData.email,
            url:   formData.url,
            phone:   formData.phone,
            description:   formData.description,
            callingCode:   formData.callingCode,
            location:   locationStore,
            images:   responseUploadImages,
            rating:   0,
            ratingTotal:   0,
            quantityVoting:   0,
            createAdd: new Date(),
            createBy: getCurrentUser().uid
        }
        const responseAddDocument = await addDocumentWithOutId("stores", store)
        setLoading(false)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al registrar la tienda, intenta mas tarde.",3000)
        }
        navigation.navigate("stores")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => { 
                const response = await uploadImage(image, "stores", uuid())
                if(response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validateForm = () => {
        clearErrors()
        let isValid = true

        if (!validateEmail(formData.email)){
            setErrorEmail("Debes ingresar un email válido")
            isValid = false
        }

        if (isEmpty(formData.name)){
            setErrorName("Debes ingresar el nombre de la tienda")
            isValid = false
        }

        if ((isEmpty(formData.address)) && (digitalStore === false)){
            setErrorAddress("Debes ingresar la dirección de la tienda")
            isValid = false
        }

        if (size(formData.phone) < 10){
            setErrorPhone("Debes ingresar un telefono de la tienda válido")
            isValid = false
        }

        if (isEmpty(formData.description)){
            setErrorDescrition("Debes ingresar una descripción de la tienda")
            isValid = false
        }

        if ((digitalStore === true) && (isEmpty(formData.url))){
            setErrorUrl("Debes ingresar una página web de la tienda")
            isValid = false
        }
        
        if((!locationStore) && (digitalStore === false)){
            toastRef.current.show("Debes de localizar la tienda en el mapa", 3000)
            isValid = false
        }else if(size(imagesSelected) === 0){
            toastRef.current.show("debes agregar al menos una imagen a la tienda", 3000)
            isValid = false
        }

        return isValid
    }

    const clearErrors = () => {
        setErrorName(null)
        setErrorAddress(null)
        setErrorEmail(null)
        setErrorUrl(null)
        setErrorPhone(null)
        setErrorDescrition(null)
    }

    return (
        <ScrollView style = {styles.viewContainer}>
            <ImageStore
                imageStore = {imagesSelected[0]}
            />
            <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
                <FormAdd
                    formData = {formData}
                    setFormData = {setFormData}
                    digitalStore = {digitalStore}
                    setDigitalStore = {setDigitalStore}
                    errorName = {errorName}
                    errorAddress = {errorAddress}
                    errorEmail = {errorEmail}
                    errorUrl = {errorUrl}
                    errorPhone = {errorPhone}
                    errorDescription = {errorDescription}
                    setIsVisibleMap = {setIsVisibleMap}
                    locationStore = {locationStore}
                />
                <UploadImage
                    toastRef = {toastRef}
                    imagesSelected = {imagesSelected}
                    setImagesSelected = {setImagesSelected}
                />
                <Button
                    title = "Crear Tienda"
                    onPress = {addStore}
                    buttonStyle = {styles.btnAddStore}
                />
                <MapStore
                    isVisibleMap = {isVisibleMap}
                    setIsVisibleMap = {setIsVisibleMap}
                    setLocationStore = {setLocationStore}
                    toastRef = {toastRef}
                />
            </ImageBackground>
        </ScrollView>
    )
}

function MapStore({ isVisibleMap, setIsVisibleMap, setLocationStore, toastRef }){
    const [newRegion, setNewRegion] = useState(null)
    
    useEffect(() => {
            (async() => {
                const response = await getCurrentLocation()
                if(response.status){
                    setNewRegion(response.location)
                    
                }
            })()
    }, [])

    const confirmLocation = () => {
        setLocationStore(newRegion)
        toastRef.current.show("Localización guardada correctamente",3000)
        setIsVisibleMap(false)
    }

    return(
        <Modal
            isVisible = {isVisibleMap}
            setVisible = {setIsVisibleMap}
        >
            <View>
                {
                    newRegion &&(
                        <MapView
                            style = {styles.mapStyle}
                            initialRegion = {newRegion}
                            showsUserLocation
                            onRegionChange = {(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate = {{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggabale
                            />
                        </MapView>
                    )
                }
                <View style = {styles.viewMapBtn}>
                    <Button
                        title = "Guardar Ubicación"
                        containerStyle = {styles.viewMapBtnContainerSave}
                        buttonStyle = {styles.viewMapBtnSave}
                        onPress = {confirmLocation}
                    />
                    <Button
                        title = "Cancelar Ubicación"
                        containerStyle = {styles.viewMapBtnContainerCancel}
                        buttonStyle = {styles.viewMapBtnCancel}
                        onPress = {() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageStore({ imageStore }){
    return(
        <View style = {styles.viewPhoto}>
            <Image
                style = {{ width: width, height: 200 }}
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
    digitalStore,
    setDigitalStore,
    errorName, 
    errorAddress, 
    errorEmail, 
    errorUrl, 
    errorPhone, 
    errorDescription,
    setIsVisibleMap,
    locationStore
} ) {
    const [country, setCountry] = useState("CO")
    const [callingCode, setCallingCode] = useState("57")
    const [phone, setPhone] = useState("")

    const onChange = (e, type) => {
        setFormData({...formData, [type] : e.nativeEvent.text })
    }

    const toggleSwitch = (value) => {
        
        setDigitalStore(value)
    
    }

    const validatePress = () => {

        if (validateEmail(formData.email)){
            setFormData({...formData, validateEmail: 'true'})
            
        }else{
            setFormData({...formData, validateEmail: 'false'})
        }
        return
    }
        return(
            <View style = {styles.viewForm}>
                    <View style = {styles.viewSwitch}>
                        {digitalStore
                            ?   <Text style = {styles.viewTextSwitch}>
                                    Tienda: 100% digital
                                </Text>
                            :   <Text style = {styles.viewTextSwitch}>
                                    Tienda: Tradicional
                                </Text>
                        }
                        <Switch
                            onValueChange={toggleSwitch}
                            value = {digitalStore}
                            thumbColor = { digitalStore ? "#073a9a" : "#ffffff"}
                            trackColor = {{false: "#c3c3c3" ,true: "#6b92d9" }}
                        />
                    </View>
                    <Input
                        placeholder = "Nombre de la tienda"
                        defaultValue = {formData.name}
                        onChange = {(e) => onChange(e, "name")}
                        errorMessage = {errorName}
                    />
                    {digitalStore
                        ?   <Text></Text>
                        :   <Input
                                placeholder = "Dirección de la tienda"
                                defaultValue = {formData.address}
                                onChange = {(e) => onChange(e, "address")}
                                errorMessage = {errorAddress}
                                rightIcon = {{
                                    type: "material-community",
                                    name: "google-maps",
                                    color: locationStore ? "#073a9a" : "#C2C2C2",
                                    onPress: () => setIsVisibleMap(true)
                                }}
                            />
                    }
                    <Input
                        placeholder = "Email de la tienda"
                        keyboardType = "email-address"
                        defaultValue = {formData.email}
                        onChange = {(e) => onChange(e, "email")}
                        errorMessage = {errorEmail}
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
                                setCallingCode(country.callingCode)
                                setCountry(country.cca2)
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
        callingCode: "57",
        validateEmail: null,
    }
}

const styles = StyleSheet.create({
    viewContainer:{
        height: "100%"
    },
    viewForm:{
        marginHorizontal: 10,
        borderRadius: 10,
        opacity: 0.8,
        backgroundColor: "#fff",
        marginVertical: 10
    },
    textArea:{
        height: 80,
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
    btnAddStore:{
        margin: 10,
        backgroundColor: "#073a9a",
        ...btn.btnIn
    },
    viewImage:{
        flexDirection: "row",
        marginHorizontal: 20,
        marginVertical: 5
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
        height: 200
    },
    mapStyle:{
        width: "100%",
        height: 550
    },
    viewMapBtn:{
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10        
    },
    viewMapBtnContainerCancel:{
        paddingLeft: 5
    },
    viewMapBtnContainerSave:{
        paddingRight: 5
    },
    viewMapBtnCancel:{
        backgroundColor: "#A65273"
    },
    viewMapBtnSave:{
        backgroundColor: "#073a9a"
    },
    viewTextSwitch:{
        fontSize: 19,
        marginHorizontal: 10,
        marginVertical: 17,
        color: "#4e4e4e",
        fontWeight: "bold"
    },
    viewSwitch:{
        flexDirection: "row",
        justifyContent:"space-between" 
    },
    imageBackground:{
        width: width, 
        height: height
    }
})
