import { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Text, Image } from "react-native";
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location";
import OulinedButton from "../UI/OutlinedButton";
import { Colors } from "../../constants/colors";
import { getMapPreview } from "../../util/location";
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native";

function LocationPicker({onLocationPicked}){
    const [locationPermissionInformation , requestPermission] = useForegroundPermissions(); 
    const [pickedLocation, setPickedLocation ] = useState();
    const nav = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();

    

    useEffect(()=>{
        if(isFocused && route.params){
            const mapPickedLocation = route.params.pickedLocation;

            setPickedLocation(mapPickedLocation);
        
        }

    },[route, isFocused]);

    async function verifyPermissions(){
        if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }
        if(locationPermissionInformation.status === PermissionStatus.DENIED){
            Alert.Alert('Insufficient Permissions!', 'You need to grant location permissions to use this app.');
            return false;
        }
 
        return true;
    }

    async function getLocation(){
        const hasPermission = await verifyPermissions();

        if(!hasPermission){
            return;
        }

        const location = await getCurrentPositionAsync();
        console.log(location);

        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        });
    }

    useEffect(()=> {
        onLocationPicked(pickedLocation);
    },[pickedLocation, onLocationPicked]);

    function pickOnMapHandler(){
        nav.navigate("Map");

    }

    let locationPreview = <Text> No location picked. </Text>

    if(pickedLocation){
        locationPreview= (<Image style={styles.mapPreviewImage} source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}}/>)
    }

    return <View>
        <View style={styles.mapPreview}>
            {locationPreview}
        </View>
        <View style={styles.actions}>
        <OulinedButton icon="location" onPress={getLocation}>Locate User</OulinedButton>
            <OulinedButton icon="map" onPress={pickOnMapHandler}>Pick on Map</OulinedButton>
        </View>
    </View>
}

export default LocationPicker;

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    mapPreviewImage:{
        width: '100%',
        height: '100%',
        borderRadius: 4
    }
})