import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, ScrollView, View } from 'react-native'
import { Rating } from 'react-native-ratings'
import { Icon, Image, ListItem } from 'react-native-elements'
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

const  width = Dimensions.get("window").width

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
                width = {width}
                activeSlide = {activeSlide}
                setActiveSlide = {setActiveSlide}
            />
            <View style = {styles.viewFavorite}>
                <Icon
                    type = "material-community"
                    name = { isFavorite ? "bookmark-plus" : "bookmark-plus-outline"}
                    onPress = { isFavorite ? removeFavorite : addFavorite}
                    color = { isFavorite ? "#073a9a" : "#9c9c9c"}//"#d9b453"
                    size = {30}
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
                email = {store.email}
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
        !digitalStore && { text: address, iconName: "map-marker" },
        { text: phone, iconName: "phone" },
        { text: email, iconName: "at" },
        { text: url, iconName: "web" }
    ]

    return(
        <View style = {styles.viewStoreInfo}>
            <Text  style = {styles.storeInfoTitle}>
                Información sobre la tienda
            </Text>
            {   
                digitalStore 
                    ?   <Image
                            source = {require('../../assets/digital-store.jpg')}
                            resizeMode = "cover"
                            style={styles.image}
                        />

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
                            color = "#073a9a"
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
        marginBottom: 10
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
        marginLeft: 15,
        marginRight: 15
    },
    storeInfoTitle:{
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem:{
        borderBottomColor: "#84a4e0",
        borderBottomWidth: 1
    },
    viewFavorite:{
        position: "absolute",
        top: 0,
        right: 40,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        //borderRadius: 30,
        //padding: 2,
        paddingBottom: 5
    },
    image:{
        height: 150,
        width: width
    }
})
