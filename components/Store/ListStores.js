import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'react-native-elements'
import { size } from 'lodash'
import { formatPhone } from '../../Utils/helpers'
import { Icon } from 'react-native-elements/dist/icons/Icon'

export default function ListStores({ stores, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data = {stores}
                keyExtractor = {(item, index) => index.toString()}
                onEndReachedThreshold = {0.5}
                onEndReached = {handleLoadMore}
                renderItem = {(store) => (
                    <Store store = {store} navigation = {navigation}/>
                )}
            />
        </View>
    )
}

function Store({ store, navigation, handleLoadMore }) {
    const { 
        id, 
        images, 
        name, 
        address, 
        description, 
        email, 
        phone, 
        url,
        storeDigital, 
        callingCode } = store.item
        const imageStore = images[0]

        const goStore = () => {
            navigation.navigate("store", { id, name })
        }

        return (
            <TouchableOpacity
                onPress = {goStore}
            >
                <View style = {styles.viewStore}>
                    <View style = {styles.viewStoreImage}>
                        <Image
                            resizeMode = "cover"
                            PlaceholderContent = {<ActivityIndicator color = "#fff"/>}
                            source = {{ uri: imageStore}}
                            style = {styles.imageStore}
                        />
                    </View>
                    <View>
                        <Text style = {styles.storeTitle}>{name}</Text>
                        <Text style = {styles.storeInformation}>
                            {
                                storeDigital ? 
                                url : address
                            }
                        </Text>
                        <Text style = {styles.storeInformation}>
                            {
                                formatPhone(callingCode, phone)
                            }
                        </Text>
                        <Text style = {styles.storeInformation}>
                            {
                                storeDigital 
                                    ? "Experiencia: 100% Digital" 
                                    : "Experiencia: Digital y tradicional"
                            }
                        </Text>
                        <Text></Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
} 

const styles = StyleSheet.create({
    viewStore:{
        flexDirection: "row",
        margin: 10
    },
    imageStore:{
        width: 90,
        height: 90
    },
    viewStoreImage:{
        marginRight: 15
    },
    storeTitle:{
        fontWeight: "bold",
        fontSize: 16
    },
    storeInformation:{
        paddingTop: 1,
        color: "gray"
    },
    storeDescription:{
        paddingTop: 2,
        color: "gray",
        width: "75%"
    }
})
