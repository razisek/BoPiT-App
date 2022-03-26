import React, { Component } from 'react'
import { SafeAreaView, Text, View, StatusBar, StyleSheet, ScrollView, TouchableOpacity, ToastAndroid, Dimensions } from 'react-native'
import { Switch, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import { MyModal } from '../../component';
// import DateTimePicker from '@react-native-community/datetimepicker';
const { height } = Dimensions.get('screen');

export class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
            data: {},
            oriData: {},
            modalVisible: false,
            keyTodel: '',
        }
    }

    componentDidMount() {
        database()
            .ref('Schedule/')
            .on('value', snapshot => {
                const getData = snapshot.val() ? snapshot.val() : {};
                this.setState({
                    data: getData,
                    key: Object.keys(getData)
                })
            });
    }

    updateSchedule(key) {
        const { data } = this.state;
        let isEnable = data[key].Enable ? false : true;
        let updateData = {
            Enable: isEnable,
        }
        database()
            .ref('Schedule/' + key)
            .update(updateData);
    }

    setDeleteContent = (visible, key) => {
        this.setState({ modalVisible: visible, keyTodel: key });
    }

    async onDelete() {
        const { keyTodel } = this.state;
        await database().ref('Schedule/' + keyTodel).remove();
        this.setDeleteContent(false, '');
        ToastAndroid.show("Data berhasil di hapus", 3000);
    }

    render() {
        const { data, key } = this.state;
        return (
            <SafeAreaView style={{ backgroundColor: "#F4F5F9", flex: 1 }}>
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
                <ScrollView vertical={true} showsVerticalScrollIndicator={false} overScrollMode="always">
                    <View style={{ marginHorizontal: 16, marginBottom: 200 }}>
                        <View style={styles.txtHeader}>
                            <Text style={{ fontSize: 28, color: "#000", fontWeight: '600' }}>Jadwal</Text>
                        </View>
                        {Object.keys(data).length != 0 ? key.map((ress, i) => {
                            return (
                                <TouchableOpacity activeOpacity={1} key={ress} style={styles.boxSchedule} onLongPress={() => this.setDeleteContent(true, ress)} >
                                    <View>
                                        <Text style={{ fontSize: 24, color: "#0E1216", fontWeight: '600' }}>{ress.toString().length == 2 ? ress : "0" + ress}:{data[ress].Minute.toString().length == 2 ? data[ress].Minute : "0" + data[ress].Minute}</Text>
                                        <Text style={{ fontSize: 12 }}>Setiap Hari</Text>
                                    </View>
                                    <View>
                                        <Switch color="#007ACC" value={data[ress].Enable} onValueChange={() => this.updateSchedule(ress)} />
                                    </View>
                                </TouchableOpacity>
                            )
                        }) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: height * (30 / 100) }}>
                                <Icon name='hourglass-outline' size={50} color="#BDBDBD" />
                                <Text style={{ marginTop: 8 }}>Jadwal masih kosong</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
                <FAB
                    style={styles.fab}
                    icon={() => <Icon name="add-outline" size={23} color="#FFF" />}
                    onPress={() => this.props.navigation.navigate("AddSchedule")}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    txtHeader: {
        marginTop: 24
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#007ACC",
    },
    boxSchedule: {
        backgroundColor: '#FFFFFF',
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
    }
});

export default Schedule