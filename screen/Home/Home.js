import React, { Component } from 'react'
import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View, PermissionsAndroid, Alert, TouchableWithoutFeedback } from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gps: false,
            cuaca: [],
            kelembabanTanah: '',
            suhuTanah: '',
            kelembabanUdara: '',
            suhuUdara: '',
            status: false,
        }
    }

    componentDidMount() {
        database()
            .ref('SensorData/')
            .on('value', snapshot => {
                const data = snapshot.val();
                this.setState({
                    kelembabanTanah: data.SoilMoisture,
                    suhuTanah: data.SoilTemperature,
                    kelembabanUdara: data.AirHumidity,
                    suhuUdara: data.AirTemperature,
                })
            });
        database()
            .ref('AutoSprinkler/')
            .on('value', snapshot => {
                const data = snapshot.val();
                this.setState({
                    status: data
                })
            });
        this.focusListener = this.props.navigation.addListener('focus', () => {
            this.requestLocation();
            this.getNowLocation();
        })
    }

    componentDidUpdate() {
        if (this.state.gps) {
            this.getNowLocation();
        }
    }

    async getCuaca(lat, long) {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lang=id&lat=${lat}&lon=${long}&appid=cf51960bd16773824d4f3a2078433f9a`)
            .then(res => res.json())
            .catch(err => {
                return {
                    success: false,
                    message: "Mohon Maaf Telah Terjadi Kesalahan",
                }
            })
        this.setState({ cuaca: response })
    }

    async requestLocation() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            } else {
                Alert.alert("Peringatan!", "Izinkan akses lokasi Anda.");
            }
        } catch (err) {
            Alert.alert("Lokasi Eror", "Eror mendapatkan lokasi.");
        }
    }

    getNowLocation() {
        if (this.state.gps) {
            this.setState({ gps: false })
        } else {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.getCuaca(position.coords.latitude, position.coords.longitude)
                    this.setState({ location: position, gps: true })
                },
                (error) => {
                    this.setState({ location: false, locterr: error, gps: false })
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        }
    }

    updateStatus() {
        const { status } = this.state;
        let statusUpdate = status ? false : true;

        database()
            .ref("AutoSprinkler")
            .set(statusUpdate);
    }

    render() {
        const { cuaca, kelembabanTanah, kelembabanUdara, suhuTanah, suhuUdara, status } = this.state;
        return (
            <SafeAreaView style={{ backgroundColor: "#F4F5F9", flex: 1 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <ScrollView vertical={true} showsVerticalScrollIndicator={false} overScrollMode="always">
                    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
                        <View style={styles.txtHeader}>
                            <Text style={{ fontSize: 28, color: "#000", fontWeight: '600' }}>Beranda</Text>
                        </View>
                        <View style={{ backgroundColor: '#FFFFFF', marginTop: 24, borderRadius: 10 }}>
                            {cuaca.length != 0 && (
                                <View style={{ margin: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <View>
                                        <Text style={{ color: '#0E1216', fontSize: 16, fontWeight: '500' }}>{cuaca.name}</Text>
                                        <Text style={{ color: '#0E1216', fontSize: 13, fontWeight: '300' }}>{moment().format('LT')} . {moment().format('L')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={{ uri: `http://openweathermap.org/img/wn/${cuaca.weather[0].icon}@2x.png` }} style={{ resizeMode: 'stretch', width: 75, height: 75, marginHorizontal: 8 }} />
                                        <View style={{ alignItems: 'center' }}>
                                            <Text style={{ color: '#0E1216', fontSize: 35 }}>{(cuaca.main.temp - 273).toFixed(1)}°C</Text>
                                            <Text style={{ color: '#0E1216', fontSize: 10, fontWeight: '300', width: '80%', textAlign: 'center' }}>{cuaca.weather[0].description}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                        <Text style={{ marginVertical: 24, fontSize: 17, color: '#0E1216', fontWeight: '500' }}>Perangkat</Text>
                        <View style={styles.boxPerangkat}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../assets/keran.png')} style={{ resizeMode: 'stretch', width: 50, height: 50 }} />
                                <Text style={{ fontSize: 20, fontWeight: '600', color: '#1d1d21', marginLeft: 16 }}>Penyiraman</Text>
                            </View>
                            <View style={{ marginLeft: 4, borderWidth: status ? 0 : 1, borderRadius: 100, borderColor: '#BDBDBD', backgroundColor: status ? '#42B1E0' : 'transparent' }}>
                                <Icon onPress={() => this.updateStatus()} name='power-outline' size={24} color={status ? "#FFFFFF" : "#BDBDBD"} style={{ padding: 8 }} />
                            </View>
                        </View>
                        <Text style={{ marginVertical: 24, fontSize: 17, color: '#0E1216', fontWeight: '500' }}>Rincian Sensor</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ padding: 16, backgroundColor: '#FFFFFF', width: '45%', margin: 8, alignItems: 'center', borderRadius: 10 }}>
                                <Image source={require('../../assets/land_temp.png')} style={{ resizeMode: 'stretch', width: 75, height: 75 }} />
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#131418', textAlign: 'center' }}>Suhu Tanah</Text>
                                <Text>{suhuTanah}°C</Text>
                            </View>
                            <View style={{ padding: 16, backgroundColor: '#FFFFFF', width: '45%', margin: 8, alignItems: 'center', borderRadius: 10 }}>
                                <Image source={require('../../assets/land_humi.png')} style={{ resizeMode: 'stretch', width: 75, height: 75 }} />
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#131418', textAlign: 'center' }}>Kelembaban Tanah</Text>
                                <Text>{kelembabanTanah}%</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ padding: 16, backgroundColor: '#FFFFFF', width: '45%', margin: 8, alignItems: 'center', borderRadius: 10 }}>
                                <Image source={require('../../assets/air_temp.png')} style={{ resizeMode: 'stretch', width: 75, height: 75 }} />
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#131418', textAlign: 'center' }}>Suhu Udara</Text>
                                <Text>{suhuUdara}°C</Text>
                            </View>
                            <View style={{ padding: 16, backgroundColor: '#FFFFFF', width: '45%', margin: 8, alignItems: 'center', borderRadius: 10 }}>
                                <Image source={require('../../assets/air_humi.png')} style={{ resizeMode: 'stretch', width: 75, height: 75 }} />
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#131418', textAlign: 'center' }}>Kelembaban Udara</Text>
                                <Text>{kelembabanUdara}%</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    txtHeader: {
        marginTop: 24
    },
    boxPerangkat: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        margin: 8,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default Home