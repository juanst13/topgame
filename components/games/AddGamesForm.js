import React, { useState, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, View, ScrollView, ImageBackground } from 'react-native'
import { Avatar, Button, Icon, Input, Image } from 'react-native-elements'
import { map, size, filter, isEmpty } from 'lodash'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'

import { getCurrentLocation, loadImageFromGallery } from '../../Utils/helpers'
import Modal from '../../components/Modal'
import { addDocumentWithOutId, getCurrentUser, uploadImage } from '../../Utils/actions'
import {btn} from '../../Styles'


const {width, height} = Dimensions.get("window")

export default function AddGamesForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorNameDev, setErrorNameDev] = useState(null)
    const [errorCategory, setErrorCategory] = useState(null)
    const [errorClasification, setErrorClasification] = useState(null)
    const [errorDeveloper, setErrorDeveloper] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationGame, setLocationGame] = useState(null)

    const addGames = async() => {
        if (!validForm()) {
            return
        }

         setLoading(true)
         const responseUploadImages = await uploadImages()    
         const user = getCurrentUser()     
         const game = {
             name: formData.name,
             address: formData.address,
             description: formData.description,
             developer: formData.developer,
             location: locationGame,
             category: formData.category,
             clasification: formData.clasification,
             nameDev: formData.nameDev,
             images: responseUploadImages,
             rating: 0,
             ratingTotal: 0,
             quantityVoting: 0,
             createAt: new Date(),
             createBy: user.uid
         }
         const responseAddDocument = await addDocumentWithOutId("games", game)         
         setLoading(false)

         if (!responseAddDocument.statusResponse) {
             toastRef.current.show("Error al crear el juego, por favor intenta más tarde.", 3000)
             return
         }

         navigation.navigate("games")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => { 
                const response = await uploadImage(image,"games", uuid())
                if(response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if (isEmpty(formData.name)) {
            setErrorName("Debes ingresar el nombre del juego.")
            isValid = false
        }

        if (isEmpty(formData.address)) {
            setErrorAddress("Debes ingresar la dirección de la desarrolladora.")
            isValid = false
        }

        if (isEmpty(formData.nameDev)) {
            setErrorNameDev("Debes ingresar el nombre de la desarrolladora.")
            isValid = false
        }

        if (size(formData.createBy)) {
            setErrorCreateBy("Debes ingresar los nombres de los desarrolladores.")
            isValid = false
        }

        if (isEmpty(formData.description)) {
            setErrorDescription("Debes ingresar una descripción del juego.")
            isValid = false
        }

        if (isEmpty(formData.category)) {
            setErrorCategory("Debes ingresar una categoria del juego.")
            isValid = false
        }

        if (isEmpty(formData.clasification)) {
            setErrorClasification("Debes ingresar una clasificación del juego.")
            isValid = false
        }

        if (isEmpty(formData.developer)) {
            setErrorDeveloper("Debes ingresar los nombres de los desarrolladores del juego.")
            isValid = false
        }

        if (!locationGame) {
            toastRef.current.show("Debes de localizar la desarrolladora en el mapa.", 3000)
            isValid = false
        } else if(size(imagesSelected) === 0) {
            toastRef.current.show("Debes de agregar al menos una imagen del juego.", 3000)
            isValid = false
        }

        return isValid
    }

    const clearErrors = () => {
        setErrorName(null)
        setErrorDescription(null)
        setErrorNameDev(null)
        setErrorCategory(null)
        setErrorClasification(null)
        setErrorDeveloper(null)
        setErrorAddress(null)
    }
    return (
        <ScrollView style={styles.viewContainer}>
            <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
            <ImageGame
                imageGame={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorName={errorName}
                errorDescription={errorDescription}
                errorNameDev={errorNameDev}
                errorAddress={errorAddress}
                errorCategory={errorCategory}
                errorClasification={errorClasification}
                errorDeveloper={errorDeveloper}
                setIsVisibleMap={setIsVisibleMap}
                locationGame={locationGame}
            />
            <UploadImage
                 toastRef={toastRef}
                 imagesSelected={imagesSelected}
                 setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Juego"
                onPress={addGames}
                buttonStyle={styles.btnAddGame}
            />
            <MapGame
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationGame={setLocationGame}
                toastRef={toastRef}
            />
            </ImageBackground>
        </ScrollView>
    )
}

function MapGame({ isVisibleMap, setIsVisibleMap, setLocationGame, toastRef }) {
    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
        (async() => {
            const response = await getCurrentLocation()
            if (response.status) {
                setNewRegion(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationGame(newRegion)
        toastRef.current.show("Localización guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }

    return (
        <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    ) 
                }
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicación"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicación"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageGame({ imageGame }){
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: width, height: 200 }}
                source={
                    imageGame
                    ? { uri: imageGame }
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4, 3])
        if (!response.status) {
            toastRef.current.show("No has seleccionado ninguna imagen", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
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

    return (
        <ScrollView
            horizontal
            style={styles.viewImages}
        >
            {
                size(imagesSelected) < 10 && (
                    <Icon
                        type = "material-community"
                        name = "camera"
                        color = "#7A7A7A"
                        containerStyle = {styles.containerIcon}
                        onPress={imageSelect}
                    />
                )
                
            }
            {
                map(imagesSelected, (imageGame, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{ uri: imageGame }}
                        onPress={() => removeImage(imageGame)}
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
    errorDescription, 
    errorNameDev, 
    errorAddress, 
    errorCategory,
    errorClasification,
    errorDeveloper,
    setIsVisibleMap, 
    locationGame,
    createDate,
    setCreateDate
}) {

    const onChange = (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                style = {{ marginTop: 10 }}
                placeholder="Nombre del juego..."
                defaultValue={formData.name}
                onChange={(e) => onChange(e, "name")}
                errorMessage={errorName}
            />
            <Input
                placeholder="Nombre de la desarrolladora..."
                defaultValue={formData.nameDev}
                onChange={(e) => onChange(e, "nameDev")}
                errorMessage={errorNameDev}
            />
            <Input
                placeholder="Dirección de la desarrolladora..."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationGame ? "#073a9a" : "#C2C2C2",
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Input
                placeholder="Nombres desarrolladores..."
                defaultValue={formData.developer}
                onChange={(e) => onChange(e, "developer")}
                errorMessage={errorDeveloper}
            />
            <Input
                placeholder="Categoria del juego..."
                defaultValue={formData.category}
                onChange={(e) => onChange(e, "category")}
                errorMessage={errorCategory}
            />
            <Input
                placeholder="Clasificación del juego..."
                defaultValue={formData.clasification}
                onChange={(e) => onChange(e, "clasification")}
                errorMessage={errorClasification}
            />
            <Input
                placeholder="Descripción del juego..."
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {
        name: "",
        description: "",
        address: "",
        nameDev:"",
        category: "",
        clasification: "",
        developer: "" 
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%"
    },
    viewForm:{
        marginHorizontal: 10,
        borderRadius: 10,
        opacity: 0.8,
        backgroundColor: "#fff",
        marginVertical: 10
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row"
    },
    inputPhone: {
        width: "80%"
    },
    btnAddGame: {
        ...btn.btnIn,
        margin: 10,
    },
    viewImages: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        borderRadius: 15,
        backgroundColor: "#E3E3E3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
       alignItems: "center",
       height: 200,
       marginBottom: 20 
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#A65273"
    },
    viewMapBtnSave: {
        backgroundColor: "#073a9a"
    },
    imageBackground:{
        width: width
    }
})
