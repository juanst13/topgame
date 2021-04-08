import React, { useState, useEffect } from 'react'
import { Alert, Dimensions,  StyleSheet, Text, ScrollView, View } from 'react-native'
import { Rating } from 'react-native-ratings'


import CarouselImage from '../../components/CarouselImage'
import Loading from '../../components/Loading'
import { getDocumentById } from '../../Utils/actions'

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
        </ScrollView>
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
    }
})
