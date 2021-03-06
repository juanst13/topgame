import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Image } from 'react-native-elements'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { size } from 'lodash'

export default function CarouselImage({ images, height, width, activeSlide, setActiveSlide }) {
    const renderItem = ({ item }) => {
        return (
            <Image
                style = {{ width, height}}
                PlaceholderContent = {<ActivityIndicator color = "#fff"/>}
                source = {{ uri: item}}
            />
        )
    }

    return (
        <View>
            <Carousel
                layout = {"default"}
                data = {images}
                sliderWidth = {width}
                itemWidth = {width}
                itemheigth = {height}
                renderItem = {renderItem}
                onSnapToItem = {(index) => setActiveSlide(index)}
            />
            <MyPagination
                data = {images}
                activeSlide = {activeSlide}
            />
        </View>
    )
}

function MyPagination ({ data, activeSlide }) {
    return(
        <Pagination
            dotsLength = {size(data)}
            activeDotIndex = {activeSlide}
            containerStyle = {styles.containerPagination}
            dotStyle = {styles.dotActive}
            inactiveDotStyle = {styles.dotInactive}
            inactiveDotOpacity = {0.6}
            inactiveDotScale = {0.6}
        />
    )
}

const styles = StyleSheet.create({
    containerPagination:{
        backgroundColor: "transparent",
        zIndex: 1,
        position: "absolute",
        bottom: 0,
        alignSelf: "center"
    },
    dotActive:{
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 2,
        backgroundColor: "#073a9a"
    },
    dotInactive:{
        width: 14,
        height: 14,
        borderRadius: 7,
        marginHorizontal: 2,
        backgroundColor: "#84a4e0"
    }

})
