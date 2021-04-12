import React from 'react'
import MapView from 'react-native-maps'
import openMap from 'react-native-open-maps'

export default function MapStore({ location, name, height }) {

    const openAppMap = () => {
        openMap({
            latitude: location. latitude,
            longitude: location.longitude,
            zoom: 19,
            quety : name
        })
    }

    return (
        <MapView
            style = {{ height: height, width: "100%" }}
            initialRegion = {location}
            onPress = {openAppMap}
        >
            <MapView.Marker
                coordinate = {{
                    latitude: location.latitude,
                    longitude: location.longitude
                }}
            />
        </MapView>
    )
}
