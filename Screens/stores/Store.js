import React, { useState, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, ScrollView, View } from 'react-native'
import { Rating } from 'react-native-ratings'
import { Icon, ListItem } from 'react-native-elements'
import { map } from 'lodash'


import CarouselImage from '../../components/CarouselImage'
import Loading from '../../components/Loading'
import { getDocumentById } from '../../Utils/actions'
import { formatPhone } from '../../Utils/helpers'
import MapStore from './MapStore'

const  widthScreen = Dimensions.get("window").width

export default function Store({ navigation, route}) {
    const { id, name } = route.params
    const [store, setStore] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)

    navigation.setOptions({ title: name })

    useEffect(() => {
        (async() => {
            const response = await getDocumentById("stores", id) 
            if (response.statusResponse){
                setStore(response.document)
                console.log(store)
            } else {
                setStore({})
                Alert.alert("Ocurrio un problema cargando la tienda, intente más tarde.")
            }
        })()
    }, [])

    if (!store){
        return <Loading isVisible = {true} text = "Cargando..."/>
    }

    return (
        <ScrollView stytle = {styles.viewBody}>
            <CarouselImage
                images = {store.images}
                height = {200}
                width = {widthScreen}
                activeSlide = {activeSlide}
                setActiveSlide = {setActiveSlide}
            />
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
        </ScrollView>
    )
}

function StoreInfo ({ name, location, address, email, phone, url, digitalStore }) {
    const listInfo = [
        { text: address, iconName: "map-marker" },
        { text: phone, iconName: "phone" },
        { text: email, iconName: "at" },
        { text: url, iconName: "at" }
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
    viewBody : {
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
    }
})
