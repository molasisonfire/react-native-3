import { useCallback, useLayoutEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import MapView, {Marker} from "react-native-maps";
import IconButton from "../UI/IconButton";

function Map({navigation}){
    const [selectedLocation, setSelectedLocation] = useState();
    
    function selectLocationHandler(event){

        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
        setSelectedLocation({lat: lat, lng: lng});
    }

    const savePickedLocationHandler= useCallback(() => {
        if(!selectedLocation){
            Alert.alert('No location picked', 'you have to pick a location first');
            return ;
        }
        navigation.navigate("AddPlace", { pickedLocation: selectedLocation } );    
    },[navigation, selectedLocation]);

    const region = {
        latitude: 37.78,
        longitude: -122.4,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: ({tintColor}) => <IconButton icon="save" size={24} color={tintColor} onPress={savePickedLocationHandler}/>
        })
    },[navigation, savePickedLocationHandler])

    return <MapView style={styles.map} initialRegion={region} onPress={selectLocationHandler}>
        { selectedLocation && <Marker title="picked location" coordinate={{latitude: selectedLocation.lat, longitude: selectedLocation.lng}} />}
    </MapView>
}

export default Map;

const styles = StyleSheet.create({
    map: {
        flex: 1,

    }
})