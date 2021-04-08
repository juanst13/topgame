import React, { useState, useEffect } from 'react'
import { Alert, Dimensions,  StyleSheet, Text, ScrollView } from 'react-native'

import CarouselImage from '../../components/CarouselImage'
import Loading from '../../components/Loading'
import { getDocumentById } from '../../Utils/actions'

const  widthScreen = Dimensions.get("window").width

export default function Store({ navigation, route}) {
    const { id, name } = route.params
    const [store, setStore] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)

    useEffect(() => {
        (async() => {
            const response = await getDocumentById("stores", id) 
            if (response.statusResponse){
                setStore(response.document)
            } else {
                setStore({})
                Alert.alert("Ocurrio un problema cargando la tienda, intente más tarde.")
            }
        })()
    }, [])

    if (!store){
        return <Loading isVisible = {true} text = "Cargando..."/>
    }

    navigation.setOptions({ title: name })

    return (
        <ScrollView stytle = {styles.viewBody}>
            <CarouselImage
                images = {store.images}
                height = {200}
                width = {widthScreen}
                activeSlide = {activeSlide}
                setActiveSlide = {setActiveSlide}
            />
            <Text>{store.description}</Text>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody :{
        flex: 1
    }
})
