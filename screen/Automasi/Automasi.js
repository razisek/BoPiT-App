import React, { Component } from 'react'
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, ToastAndroid, Dimensions, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { FAB, Switch } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { MyModal } from '../../component';
const { height } = Dimensions.get("screen")

export class Automasi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            modalVisible: false,
            keyTodel: '',
        }
    }

    componentDidMount() {
        database()
            .ref('Automation/')
            .on('value', snapshot => {
                const data = snapshot.val() ? snapshot.val() : {};
                this.setState({
                    data: data,
                })
            });
    }

    setDeleteContent = (visible, key) => {
        this.setState({ modalVisible: visible, keyTodel: key });
    }

    async onDelete() {
        const { keyTodel } = this.state;
        await database().ref('Automation/' + keyTodel).remove();
        this.setDeleteContent(false, '');
        ToastAndroid.show("Data berhasil di hapus", 3000);
    }

    updateAutomasi(key) {
        const { data } = this.state;
        const updateData = {
            Enable: data[key].Enable ? false : true,
        }

        database()
            .ref('Automation/' + key)
            .update(updateData);
    }

    render() {
        const { data } = this.state;
        return (
            <SafeAreaView style={{ backgroundColor: '#F4F5F9', flex: 1 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <MyModal
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setDeleteContent(!this.state.modalVisible, '');
                    }}
                >
                    <Text style={{ fontFamily: 'NunitoSans', fontWeight: '700', color: '#000000', fontSize: 17 }}>Konfirmasi</Text>
                    <Text style={{ fontFamily: 'NunitoSans', fontWeight: '400', color: '#0E1216', margin: 16 }}>Apakah ingin menghapus?</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text onPress={() => this.onDelete()} style={{ marginHorizontal: 16, fontWeight: '800', color: '#FE6464' }}>Hapus</Text>
                        <Text onPress={() => this.setDeleteContent(false, '')} style={{ marginHorizontal: 16, fontWeight: '800', color: '#7ED320' }}>Batal</Text>
                    </View>
                </MyModal>
                <View style={{ marginHorizontal: 16 }}>
                    <View style={{ marginTop: 24 }}>
                        <Text style={{ fontSize: 28, color: "#000", fontWeight: '600' }}>Automasi</Text>
                    </View>
                </View>
                <View style={{ marginHorizontal: 16 }}>
                    {data["Moisture"] != undefined && (
                        <TouchableOpacity activeOpacity={1} style={{
                            backgroundColor: data["Moisture"].Enable ? '#007ACC' : '#BDBDBD',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            padding: 16,
                            marginTop: 24,
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.58,
                            shadowRadius: 16.00,

                            elevation: 10,
                        }} onLongPress={() => this.setDeleteContent(true, "Moisture")} >
                            <View>
                                <Text style={{ fontSize: 20, color: "#FFFFFF", fontWeight: '600' }}>Kelembaban</Text>
                                <Text style={{ marginTop: 4, marginLeft: 4, color: '#FFFFFF', }}>{data["Moisture"].Operator + " " + data["Moisture"].Value}%</Text>
                            </View>
                            <View>
                                <Switch color="#75c8ff" value={data["Moisture"].Enable} onValueChange={() => this.updateAutomasi("Moisture")} />
                            </View>
                        </TouchableOpacity>
                    )}

                    {data["Suhu"] != undefined && (
                        <TouchableOpacity activeOpacity={1} style={{
                            backgroundColor: data["Suhu"].enable ? '#007ACC' : '#BDBDBD',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexDirection: 'row',
                            padding: 16,
                            marginTop: 24,
                            borderRadius: 10,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.58,
                            shadowRadius: 16.00,

                            elevation: 10,
                        }} onLongPress={() => this.setDeleteContent(true, "Suhu")} >
                            <View>
                                <Text style={{ fontSize: 20, color: "#FFFFFF", fontWeight: '600' }}>Suhu</Text>
                                <Text style={{ marginTop: 4, marginLeft: 4, color: '#FFFFFF', }}>{data["Suhu"].operator + " " + data["Suhu"].value}°C</Text>
                            </View>
                            <View>
                                <Switch color="#75c8ff" value={data["Suhu"].Enable} onValueChange={() => this.updateAutomasi("Suhu")} />
                            </View>
                        </TouchableOpacity>
                    )}
                    {data["Moisture"] == undefined && data["Suhu"] == undefined && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height * (30 / 100) }}>
                            <Icon name='sad-outline' size={50} color="#BDBDBD" />
                            <Text style={{ marginTop: 8 }}>Automasi masih kosong</Text>
                        </View>
                    )}
                </View>
                <FAB
                    style={styles.fab}
                    icon={() => <Icon name="add-outline" size={23} color="#FFF" />}
                    onPress={() => this.props.navigation.navigate("Kelembaban")}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#007ACC",
    },
});

export default Automasi
