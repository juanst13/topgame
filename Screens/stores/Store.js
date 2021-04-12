import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, ScrollView, View } from 'react-native'
import { Rating } from 'react-native-ratings'
import { Icon, ListItem } from 'react-native-elements'
import { map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import CarouselImage from '../../components/CarouselImage'
import Loading from '../../components/Loading'
import { 
    addDocumentWithOutId, 
    getCurrentUser, 
    getDocumentById, 
    getIsFavorite, 
    removeFavorites } from '../../Utils/actions'
import { formatPhone } from '../../Utils/helpers'
import MapStore from '../../components/Store/MapStore'
import ListReviews from '../../components/Store/ListReviews'

const  widthScreen = Dimensions.get("window").width

export default function Store({ navigation, route}) {
    const { id, name } = route.params
    const toastRef = useRef()

    const [store, setStore] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
         user ? setUserLogged(true) : setUserLogged(false)
    })

    navigation.setOptions({ title: name })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("stores", id) 
                if (response.statusResponse){
                    setStore(response.document)
                } else {
                    setStore({})
                    Alert.alert("Ocurrió un problema cargando la tienda, intente más tarde.")
                }
            })()
        }, [])
    )

    useEffect(() => {
        (async() => {
            if (userLogged && store){
                const response = await getIsFavorite(store.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, store])

    const addFavorite = async() => {
        if (!userLogged){
            toastRef.current.show
                ("Para agregar la tienda a favoritos debes estar logueado.",3000)
            return
        }
        setLoading(true)
        const response = await addDocumentWithOutId("favorites", {
            idUser: getCurrentUser().uid,
            idStore: store.id
        })
        setLoading(false)

        if(response.statusResponse) {
            setIsFavorite(true)
            toastRef.current.show("Tienda añadida a favoritos.", 3000)
        } else {
            toastRef.current.show
            ("No se pudo adicionar la tienda a favoritos, por favor intenta más tarde.", 
            3000)
        }

    } 

    const removeFavorite = async() => {
        setLoading(true)
        const response = await removeFavorites(store.id)
        setLoading(false)
        if (response.statusResponse){
            toastRef.current.show("Tienda eliminada de favoritos", 3000)
            setIsFavorite(false)
        } else {
            toastRef.current.show
                ("No se pudo eliminar la tienda de favoritos, por favor intenta más tarde",
                3000)
        }
    }

    if (!store){
        return <Loading isVisible = {true} text = "Cargando..."/>
    }

    return (
        <ScrollView style = {styles.viewBody}>
            <CarouselImage
                images = {store.images}
                height = {200}
                width = {widthScreen}
                activeSlide = {activeSlide}
                setActiveSlide = {setActiveSlide}
            />
            <View style = {styles.viewFavorite}>
                <Icon
                    type = "material-community"
                    name = { isFavorite ? "heart" : "heart-outline"}
                    onPress = { isFavorite ? removeFavorite : addFavorite}
                    color = "#442484"
                    size = {35}
                    underlayColor = "transparent"
                />
            </View>
            <TitleStore
                name = {store.name}
                description = {store.description}
                rating = {store.rating}
            />
            <StoreInfo
                name = {store.name}
                location = {store.location}
                address = {store.address}
                email = {store.address}
                phone = {formatPhone(store.callingCode, store.phone)}
                url = {store.url}
                digitalStore = {store.storeDigital}
            />
            <ListReviews
                navigation = {navigation}
                idStore = {store.id}
            />
            <Toast ref = {toastRef} position = "center" opacity = {0.9}/>
            <Loading isVisible = {loading} text = "Por favor espere..."/>
        </ScrollView>
    )
}

function StoreInfo ({ name, location, address, email, phone, url, digitalStore }) {
    const listInfo = [
        { text: address, iconName: "map-marker" },
        { text: phone, iconName: "phone" },
        { text: email, iconName: "at" },
        { text: url, iconName: "web" }
    ]

    return(
        <View style = {styles.viewStoreInfo}>
            <Text  style = {styles.storeInfoTitle}>
                Información sobre la tienda
            </Text>
            {digitalStore 
                ?   <Text>Tienda 100% digital</Text>
                :   <MapStore
                        location = {location}
                        name = {name}
                        height = {150}
                    />
            }

            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key = {index}
                        style = {styles.containerListItem}
                    >
                        <Icon
                            type = "material-community"
                            name = {item.iconName}
                            color = "#442484"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </View>
    )
}

function TitleStore({ name, description, rating }) {
    return(
        <View style = {styles.viewStoreTitle}>
            <View style = {styles.viewStoreContainer}>
                <Text style = {styles.nameStore}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue = {parseFloat(rating)}
                    
                />
            </View>
            <Text style = {styles.description}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewStoreTitle : {
        padding: 15,
    },
    viewStoreContainer : {
        flexDirection: "row"
    },
    nameStore : {
        fontWeight: "bold"
    },
    rating : {
        position: "absolute",
        right: 0
    },
    description : {
        marginTop: 10,
        color: "gray",
        textAlign: "justify"
    },
    viewStoreInfo:{
        margin: 15,
        marginTop: 25
    },
    storeInfoTitle:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem:{
        borderBottomColor: "#A376c7",
        borderBottomWidth: 1
    },
    viewFavorite:{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 100,
        padding: 5,
        paddingLeft: 15
    }
})
