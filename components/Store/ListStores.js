import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon, Image } from 'react-native-elements'
import { size } from 'lodash'

import { formatPhone } from '../../Utils/helpers'

const {width, height} = Dimensions.get("window")

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
                    <View  style = {styles.viewStoreInfo}>
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
                                        : "Experiencia: Tradicional"
                                }
                            </Text>
                            <Text></Text>
                        </View>
                        <Icon
                            type = "material-community"
                            name = { storeDigital ? "cloud-check" : "store"}
                            color = "white"
                            containerStyle =  {styles.icon}
                            size = {35}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
} 

const styles = StyleSheet.create({
    viewStore:{
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
        marginRight: 10
    },
    viewStoreInfo:{
        flexDirection: "row",
        justifyContent: "space-between",
        borderLeftWidth: 3,
        borderRightWidth: 3,
        // borderTopWidth: 1,
        // borderBottomWidth: 3,
        width: width-100,
        //borderTopRightRadius: 25,
        borderBottomRightRadius: 95,
        borderColor: "#0489db",
        // backgroundColor: "white",
        // opacity: 0.6
        // borderBottomWidth: 1,
        // borderTopWidth: 1
        //borderTopLeftRadius: 25,
        borderBottomLeftRadius: 15,
        marginHorizontal: 20,
    },
    imageStore:{
        width: width-100,
        height: 100,
        marginHorizontal: 20,
        borderTopLeftRadius: 15,
        //borderBottomLeftRadius: 50,
        borderTopRightRadius: 15,
        //borderBottomRightRadius: 50
        //borderRadius: 50
    },
    viewStoreImage:{
        marginRight: 10
    },
    storeTitle:{
        fontWeight: "bold",
        fontSize: 16,
        left: 10,
        top: 10,
        color: "white"
    },
    storeInformation:{
        paddingTop: 1,
        color: "gray",
        left: 10,
        top: 10
    },
    storeDescription:{
        paddingTop: 2,
        color: "gray",
        width: "75%"
    },
    icon:{
        marginTop: 20,
        marginRight: 30
    }
})
