import React from 'react'
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon, Image } from 'react-native-elements'
import { size } from 'lodash'
import { Rating } from 'react-native-ratings'

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
        rating,
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
                        <View style = {styles.calification}>
                            <Icon 
                                type = "material-community"
                                name =  { rating === 0 
                                            ?   "star-outline"
                                            :   "star"
                                        }
                                size = {20}
                                style = {styles.scoreIcon}
                                color = { rating === 0 
                                            ?   "#898989"
                                            :   "#edaf0d"
                                        }
                            />
                            <Text style = {styles.score}>  
                                {
                                    rating === 0 
                                        ? "  - -"
                                        : "  " + parseFloat(rating).toFixed(1)
                                }
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
} 

const styles = StyleSheet.create({
    viewStore:{
        flex: 1,
        marginTop: 10,
        marginBottom: 10
    },
    viewStoreInfo:{
        flexDirection: "row",
        justifyContent: "space-between",
        //borderLeftWidth: 3,
        //borderRightWidth: 3,
        // borderTopWidth: 1,
        // borderBottomWidth: 3,
        width: width-60,
        //borderTopRightRadius: 25,
        borderBottomRightRadius: 95,
        borderColor: "#0489db",
        backgroundColor: "white",
        // borderBottomWidth: 1,
        // borderTopWidth: 1
        //borderTopLeftRadius: 25,
        borderBottomLeftRadius: 10,
        marginHorizontal: 10
    },
    imageStore:{
        width: width-60,
        height: 100,
        marginHorizontal: 10,
        borderTopLeftRadius: 10,
        //borderBottomLeftRadius: 50,
        borderTopRightRadius: 10,
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
        top: 5,
        color: "#073a9a"
    },
    storeInformation:{
        color: "gray",
        left: 10,
        top: 5
    },
    rating:{
        marginTop: 6,
        marginRight: 30
    },
    calification:{
        flexDirection: "row",
        justifyContent: "center",
        flex: 1,
        alignSelf: "center",
        padding: 5
    },
    scoreIcon:{
        color: "#073a9a"
    },
    score:{
        
    }
})
