import React, { useState } from 'react'
import { Alert, Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Icon, Image, Input, ListItem } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'
import { filter, isEmpty, map, size } from 'lodash'
import uuid from 'random-uuid-v4'
import DropDownPicker from 'react-native-dropdown-picker'

import { loadImageFromGallery } from '../../Utils/helpers'
import { btn } from '../../Styles'
import { addDocumentWithOutId, getCurrentUser, uploadImage } from '../../Utils/actions'

const {width, height} = Dimensions.get("window")

export default function AddNewsForm({ navigation, setLoading, toastRef }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [category, setCategory] = useState("Consolas")
    const [errorName, setErrorName] = useState(null)
    const [errorDescription, setErrorDescrition] = useState(null)
    const [errorCategory, setErrorCategory] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])

    const addNew = async() => {
        if(!validateForm()){
            return
        }

        setLoading(true)
        const responseUploadImagesNews = await imagesUploadNew()
        const notice = {
            name: formData.name,
            desciption: formData.description,
            category: category,
            images: responseUploadImagesNews,
            rating:   0,
            ratingTotal:   0,
            quantityVoting:   0,
            createAt: new Date(),
            createBy: getCurrentUser().uid
        }

        const responseAddDocument = await addDocumentWithOutId("news", notice)
        setLoading(false)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al registrar la noticia, intenta mas tarde.",3000)
        }
        navigation.navigate("news")
    }

    const imagesUploadNew = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "news", uuid())
                if(response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }
    
    const validateForm = () => {
        setErrorDescrition(null)
        setErrorName(null)
        let isValid = true

        if (isEmpty(formData.name))
        {
            setErrorName("Debes ingresar un nombre de la noticia.")
            isValid = false
        }

        if (isEmpty(formData.description)){
            setErrorDescrition("Debes ingresar el cuerpo de la noticia.")
            isValid = false
        }

        if (size(imagesSelected) === 0){
            toastRef.current.show("Debes agregar al menos una imagen de la noticia.", 3000)
            isValid = false
        }

        return isValid
    }
    
    return (
        <ScrollView  style = {styles.viewContainer}>
            <ImageBackground
                source = {require('../../assets/206954.jpg')}
                resizeMode = "cover"
                style = {styles.imageBackground}
            >
                <ImageNew
                imageNew = {imagesSelected[0]}
                />
                <AddForm
                    formData = {formData}
                    setFormData = {setFormData}
                    errorName = {errorName}
                    errorDescription = {errorDescription}
                    category = {category}
                    setCategory = {setCategory}
                    errorCategory = {errorCategory}
                />
                <ImageUploadNew
                    toastRef = {toastRef}
                    imagesSelected = {imagesSelected}
                    setImagesSelected = {setImagesSelected}
                />
                <Button
                    title = "Crear Noticia"
                    onPress = {addNew}
                    buttonStyle = {styles.btnAddNew}
                />
            </ImageBackground>
        </ScrollView>
    )
}

function ImageNew({ imageNew }) {
    return(
        <View style = {styles.viewPhoto}>
            <Image
                style = {{ width: width, height: 200 }}
                source = {
                    imageNew
                    ? {uri: imageNew}
                    : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function ImageUploadNew({ toastRef, imagesSelected, setImagesSelected }) {
    const imageSelected = async() => {
        const response = await loadImageFromGallery([4, 3])
        if(!response.status){
            toastRef.current.show("No has seleccionado ninguna imagen", 3000)
        }
        setImagesSelected([...imagesSelected, response.image])
    }

    const removeImage = (image) => {
        Alert.alert(
            "Eliminar imagen",
            "¿estas seguro que deseas eliminar la imaagen?",
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
                size(imagesSelected) < 10 &&
                    <Icon
                        type = "material-community"
                        name = "camera"
                        color = {"#a7a7a7"}
                        containerStyle = {styles.containerIcon}
                        onPress = {imageSelected}
                    />
            }
            {
                map(imagesSelected, (imagen, index) => (
                    <Avatar
                        key = {index}
                        style = {styles.miniature}
                        source = {{ uri: imagen }}
                        containerStyle = {styles.miniContainer}
                        onPress = {() => removeImage(imagen)}
                    />
                ))
            }

        </ScrollView>
    )
}

function AddForm({ formData, setFormData, errorName, errorDescription, category, setCategory, errorCategory }) {

    const onChange = (e, type) => {
        setFormData({...formData, [type] : e.nativeEvent.text })
    }

    return(
        <View>   
            <View style = {styles.viewBody}>
                <View style = {styles.dropdownView}>
                    <Text style = {styles.category}>Categoria</Text>
                    <DropDownPicker
                        items={[
                            {label: 'Consolas', value: 'Consolas'},
                            {label: 'Juegos', value: 'Juegos'},
                            {label: 'Tiendas', value: 'Tiendas'},
                        ]}
                        defaultValue = 'Consolas'
                        onChangeItem = {item => setCategory(item.value)}
                        containerStyle = {styles.dropdown}
                    />
                </View>
                <Input
                    placeholder = "Nombre de la noticia"
                    onChange = {(e) => onChange(e, "name")}
                    defaultValue = {formData.name}
                    errorMessage = {errorName}
                    style = {styles.title}
                    labelStyle = {styles.textDrop}
                />
                <Input
                    placeholder = "Cuerpo de la noticia"
                    multiline
                    onChange = {(e) => onChange(e,"description")}
                    defaultValue = {formData.description}
                    errorMessage = {errorDescription}
                    style = {styles.textArea}
                />
            </View>
        </View>
    )
}

const defaultFormValues = () => {
    return{
        name: "",
        description: ""
    }
}

const styles = StyleSheet.create({
    viewContainer:{
    },
    viewBody:{
        marginHorizontal: 10,
        borderRadius: 10,
        opacity: 0.8,
        backgroundColor: "#fff",
        marginVertical: 20
    },
    dropdown:{
        width: "50%"    
    },
    textArea:{
        height: 80,
        width: "100%"
    },
    viewImage:{
        flexDirection: "row",
        marginHorizontal: 20,
        marginVertical: 5
    },
    btnAddNew:{
        margin: 20,
        backgroundColor: "#073a9a",
        ...btn.btnIn
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
        top: 5
    },
    imageBackground:{
        width: width
    },
    title:{
        width: "100%",
        paddingVertical: 10
    },
    dropdownView:{
        marginTop: 15,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 20
    },
    category:{
        fontWeight: "bold",
        fontSize: 25,
        alignContent: "center",
        color: "black",
        opacity: 0.7
    }
})
