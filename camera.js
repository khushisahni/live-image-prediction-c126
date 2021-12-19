import * as React from 'react'
import { Button, Image, View, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class Imagepicking extends React.Component{
    state = {image: null}
    render(){
        let {image} = this.state
        return(
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Button
                title = 'Pick an Image'
                onPress = {this.pickimage}
                />
            </View>
        )
    }
    componentDidMount(){
        this.getpermissions()
    }

    getpermissions = async()=>{
        if(Platform.OS !== 'web'){
            const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if(status !== 'granted'){alert('Please give permissions')}
        }
    }
    pickimage = async()=>{
        try{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4,3],
                quality: 1
            })
            if(!result.cancelled){
                this.setState({
                    image: result.data
                })
                console.log(result.uri)
                this.uploadimage(result.uri)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    uploadimage = async(uri)=>{
        const data = new FormData()
        let filename = uri.split('/')[uri.split('/').length - 1]
        let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
        const filetoupload = {
            uri: uri,
            name: filename,
            type: type
        }
        data.append('alphabet', filetoupload)
        fetch('http://34b8-2405-201-17-e816-887e-dc2d-32e9-582.ngrok.io/predict-alphabet',{
            method: 'POST',
            body: data,
            headers: {
                'content-type': 'multipart/form-data'
            }
        })
        .then((response) => response.json()) 
        .then((result) => { console.log("Success:", result); }) 
        .catch((error) => { console.error("Error:", error); });
    }
}