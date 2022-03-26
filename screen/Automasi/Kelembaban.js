import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback, Dimensions, ToastAndroid, StatusBar } from 'react-native'
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, TextInput } from 'react-native-paper';
import database from '@react-native-firebase/database';
const { width } = Dimensions.get('screen');

export class Kelembaban extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operator: '<',
            valueKelembaban: 50,
            threshold: '',
            error: false
        }
    }

    onSubmit() {
        const { operator, valueKelembaban, threshold } = this.state;
        let AmbangBatas = threshold == '' ? 60 : parseInt(threshold);
        if (threshold > 100) {
            this.setState({ error: true })
            ToastAndroid.show("Ambang Batas tidak lebih dari 100%!", 3000);
        } else {
            database()
                .ref('Automation/')
                .once('value', snapshot => {
                    const data = snapshot.val() ? snapshot.val() : {};
                    const key = Object.keys({ ...data });
                    const isThere = key.includes("Moisture");
                    const kelembaban = data["Moisture"];

                    let dataUpload = {
                        Enable: isThere ? kelembaban.Enable ? true : false : true,
                        Operator: isThere ? kelembaban.Operator == operator ? kelembaban.Operator : operator : operator,
                        Value: isThere ? kelembaban.Value == valueKelembaban ? kelembaban.Value : valueKelembaban : valueKelembaban,
                        Threshold: isThere ? kelembaban.Threshold == AmbangBatas ? kelembaban.Threshold : AmbangBatas : AmbangBatas,
                    }

                    if (isThere) {
                        database()
                            .ref('Automation/Moisture/')
                            .update(dataUpload);
                    } else {
                        database()
                            .ref('Automation/Moisture/')
                            .set(dataUpload);
                    }

                });
        }

        this.props.navigation.goBack();
        ToastAndroid.show("Data berhasil ditambah", 3000);
    }

    render() {
        const { operator, valueKelembaban, threshold, error } = this.state;
        let increment = valueKelembaban;
        return (
            <SafeAreaView style={{ backgroundColor: '#F4F5F9', flex: 1, marginHorizontal: 16 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.4} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='chevron-back-outline' size={24} color="#000000" style={{ padding: 4 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 8, fontSize: 16, color: '#0E1216', fontWeight: '500' }}>Kondisi Kelembaban</Text>
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
                    <TouchableOpacity onPress={() => this.setState({ valueKelembaban: increment - 1 })}>
                        <Icon name='chevron-back-circle' size={24} color="#000000" style={{ marginHorizontal: 16 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 30, color: '#0E1216', fontWeight: '600' }}>{valueKelembaban}%</Text>
                    <TouchableOpacity onPress={() => this.setState({ valueKelembaban: increment + 1 })}>
                        <Icon name='chevron-forward-circle' size={24} color="#000000" style={{ marginHorizontal: 16 }} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#0E1216' }}>0%</Text>
                    <Slider
                        style={{ width: width * (65 / 100), height: 50 }}
                        minimumValue={0}
                        maximumValue={100}
                        minimumTrackTintColor="#007ACC"
                        maximumTrackTintColor="#000000"
                        value={valueKelembaban}
                        onValueChange={(data) => this.setState({ valueKelembaban: Math.trunc(data) })}
                    />
                    <Text style={{ color: '#0E1216' }}>100%</Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <TextInput
                        label="Ambang Batas Kelembaban"
                        value={threshold}
                        keyboardType="numeric"
                        mode='outlined'
                        error={error}
                        maxLength={2}
                        theme={{ colors: { primary: "#007ACC" } }}
                        onChangeText={text => this.setState({ threshold: text })}
                    />
                    <Text style={{ paddingHorizontal: 5, paddingTop: 5, color: '#858585', fontSize: 12 }}>*batas penyiraman</Text>
                </View>
                <Button icon="content-save" mode="contained" color='#007ACC' onPress={() => this.onSubmit()} style={{ marginTop: 24, borderRadius: 25, width: width * (85 / 100), alignSelf: 'center' }} >
                    Simpan
                </Button>
            </SafeAreaView>
        )
    }
}

export default Kelembaban