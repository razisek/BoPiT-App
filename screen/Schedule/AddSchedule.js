import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, Dimensions, ToastAndroid, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, TextInput } from 'react-native-paper';
const { width } = Dimensions.get('screen');
import DatePicker from 'react-native-date-picker';
import database from '@react-native-firebase/database';

export class AddSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            runtime: '',
            error: false
        }
    }

    onSubmit() {
        const { date, runtime } = this.state;
        let hour = date.getHours();
        let minute = date.getMinutes();

        if (runtime > 60) {
            this.setState({ error: true })
            ToastAndroid.show("Waktu berjalan tidak lebih dari 60 menit!", 3000);
        } else {
            let dataUpload =
            {
                Enable: true,
                Minute: minute,
                Runtime: runtime == '' ? 1 : parseInt(runtime)
            }

            database()
                .ref('Schedule/' + hour)
                .set(dataUpload);

            this.props.navigation.goBack();
            ToastAndroid.show("Data berhasil ditambah", 3000);
        }

    }

    render() {
        const { date, runtime, error } = this.state;
        return (
            <SafeAreaView style={{ backgroundColor: '#F4F5F9', flex: 1, marginHorizontal: 16 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                    <TouchableOpacity activeOpacity={0.4} onPress={() => this.props.navigation.goBack()}>
                        <Icon name='chevron-back-outline' size={24} color="#000000" style={{ padding: 4 }} />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: 8, fontSize: 16, color: '#0E1216', fontWeight: '500' }}>Tambah Jadwal</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 24, alignItems: 'center' }}>
                    <DatePicker
                        date={date}
                        mode='time'
                        is24hourSource='locale'
                        locale='id'
                        onDateChange={(date) => this.setState({ date: date })}
                        fadeToColor='#F4F5F9'
                    />
                </View>
                <View>
                    <TextInput
                        label="Waktu Penyiraman"
                        value={runtime}
                        keyboardType="numeric"
                        mode='outlined'
                        error={error}
                        maxLength={2}
                        theme={{ colors: { primary: "#007ACC" } }}
                        onChangeText={text => this.setState({ runtime: text })}
                    />
                    <Text style={{ paddingHorizontal: 5, paddingTop: 5, color: '#858585', fontSize: 12 }}>*dalam menit</Text>
                </View>
                <Button icon="content-save" mode="contained" color='#007ACC' onPress={() => this.onSubmit()} style={{ marginTop: 24, borderRadius: 25, width: width * (85 / 100), alignSelf: 'center' }} >
                    Simpan
                </Button>
            </SafeAreaView>
        )
    }
}

export default AddSchedule
