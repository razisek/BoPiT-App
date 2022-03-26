import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ToastAndroid, StatusBar } from 'react-native'
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button } from 'react-native-paper';
import database from '@react-native-firebase/database';
const { width } = Dimensions.get('screen');

export class Suhu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operator: '<',
            valueSuhu: 0
        }
    }

    onSubmit() {
        const { operator, valueSuhu } = this.state;
        database()
            .ref('Automasi/')
            .once('value', snapshot => {
                const data = snapshot.val() ? snapshot.val() : {};
                const key = Object.keys({ ...data });
                const isThere = key.includes("Suhu");
                const suhu = data["Suhu"];

                let dataUpload = {
                    enable: isThere ? suhu.enable ? true : false : true,
                    operator: isThere ? suhu.operator == operator ? suhu.operator : operator : operator,
                    value: isThere ? suhu.value == valueSuhu ? suhu.value : valueSuhu : valueSuhu,
                }

                if (isThere) {
                    database()
                        .ref('Automasi/Suhu/')
                        .update(dataUpload);
                } else {
                    database()
                        .ref('Automasi/Suhu/')
                        .set(dataUpload);
                }
            });

        this.props.navigation.goBack();
        ToastAndroid.show("Data berhasil ditambah", 3000);
    }

    render() {
        const { operator, valueSuhu } = this.state;
        let increment = valueSuhu;
        return (
            <SafeAreaView style={{ backgroundColor: '#F4F5F9', flex: 1, marginHorizontal: 16 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.4} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='chevron-back-outline' size={24} color="#000000" style={{ padding: 4 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 8, fontSize: 16, color: '#0E1216', fontWeight: '500' }}>Kondisi Suhu</Text>
                </View>
                <View style={{ backgroundColor: '#E1E8EB', flexDirection: 'row', justifyContent: 'center', width: width * (73 / 100), alignSelf: 'center', borderRadius: 25, marginTop: 24 }}>
                    <TouchableWithoutFeedback onPress={() => this.setState({ operator: '<' })}>
                        <Text style={{ paddingHorizontal: 40, paddingVertical: 8, margin: 4, backgroundColor: operator == '<' ? '#007ACC' : 'transparent', borderRadius: 25, color: operator == '<' ? '#FFFFFF' : '#0E1216', fontSize: 20, fontWeight: '600' }}>{'<'}</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({ operator: '=' })}>
                        <Text style={{ paddingHorizontal: 40, paddingVertical: 8, margin: 4, backgroundColor: operator == '=' ? '#007ACC' : 'transparent', borderRadius: 25, color: operator == '=' ? '#FFFFFF' : '#0E1216', fontSize: 20, fontWeight: '600' }}>=</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.setState({ operator: '>' })}>
                        <Text style={{ paddingHorizontal: 40, paddingVertical: 8, margin: 4, backgroundColor: operator == '>' ? '#007ACC' : 'transparent', borderRadius: 25, color: operator == '>' ? '#FFFFFF' : '#0E1216', fontSize: 20, fontWeight: '600' }}>{'>'}</Text>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.setState({ valueSuhu: increment - 1 })}>
                        <Icon name='chevron-back-circle' size={24} color="#000000" style={{ marginHorizontal: 16 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, color: '#0E1216', fontWeight: '600' }}>{valueSuhu}°C</Text>
                    <TouchableOpacity onPress={() => this.setState({ valueSuhu: increment + 1 })}>
                        <Icon name='chevron-forward-circle' size={24} color="#000000" style={{ marginHorizontal: 16 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#0E1216' }}>0°C</Text>
                    <Slider
                        style={{ width: width * (65 / 100), height: 50 }}
                        minimumValue={0}
                        maximumValue={50}
                        minimumTrackTintColor="#007ACC"
                        maximumTrackTintColor="#000000"
                        value={valueSuhu}
                        onValueChange={(data) => this.setState({ valueSuhu: Math.trunc(data) })}
                    />
                    <Text style={{ color: '#0E1216' }}>50°C</Text>
                </View>
                <Button icon="content-save" mode="contained" color='#007ACC' onPress={() => this.onSubmit()} style={{ marginTop: 24, borderRadius: 25, width: width * (85 / 100), alignSelf: 'center' }} >
                    Simpan
                </Button>
            </SafeAreaView>
        )
    }
}

export default Suhu