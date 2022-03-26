import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

export class AddAutomasi extends Component {
    render() {
        return (
            <SafeAreaView style={{ backgroundColor: '#F4F5F9', flex: 1, marginHorizontal: 16 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.4} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='chevron-back-outline' size={24} color="#000000" style={{ padding: 4 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 8, fontSize: 16, color: '#0E1216', fontWeight: '500' }}>Membuat Automasi</Text>
                </View>
                <Text style={{ marginVertical: 16, fontWeight: '600', color: '#0E1216', fontSize: 18 }}>Pilih Kondisi Automasi</Text>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Suhu")} activeOpacity={0.5} style={{ backgroundColor: '#FFFFFF', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginVertical: 4 }}>
                        <Image source={require('../../assets/land_temp.png')} style={{ resizeMode: 'stretch', width: 50, height: 50 }} />
                        <Text style={{ color: '#0E1216', fontSize: 16 }}>Suhu</Text>
                    </View>
                    <Icon name='chevron-forward-outline' size={28} color="#BDBDBD" style={{ marginRight: 8 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.props.navigation.navigate("Kelembaban")} activeOpacity={0.5} style={{ backgroundColor: '#FFFFFF', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 16, marginVertical: 4 }}>
                        <Image source={require('../../assets/land_humi.png')} style={{ resizeMode: 'stretch', width: 50, height: 50 }} />
                        <Text style={{ color: '#0E1216', fontSize: 16 }}>Kelembaban</Text>
                    </View>
                    <Icon name='chevron-forward-outline' size={28} color="#BDBDBD" style={{ marginRight: 8 }} />
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

export default AddAutomasi
