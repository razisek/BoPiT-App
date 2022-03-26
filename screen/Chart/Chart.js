import React, { PureComponent } from 'react'
import { Text, View, SafeAreaView, StatusBar, ScrollView, StyleSheet, Dimensions } from 'react-native'
import { BarChart } from "react-native-chart-kit";
import { Picker } from '@react-native-picker/picker';
import database from '@react-native-firebase/database';
import moment from 'moment'
import 'moment/locale/id'
moment.locale('id')

export class ChartStatistic extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            listTanggal: [],
            dataset: [],
            totalDebit: 0,
            totalRuntime: 0,
            selectedDay: '1 Januari 1970'
        }
    }

    componentDidMount() {
        let today = moment().format('LL');
        database()
            .ref('Log/')
            .on('value', snapshot => {
                const data = snapshot.val();
                let array = [];
                let listTanggal = [];
                Object.keys(data).forEach(function (key) {
                    let tanggal = moment.unix(key).format('LL');
                    if (!listTanggal.includes(tanggal)) listTanggal.push(tanggal);
                    array.push({
                        tanggal: tanggal,
                        jam: moment.unix(key).hour(),
                        debit: data[key].TotalUsage,
                        time: data[key].Runtime
                    })
                });
                this.setState({
                    data: array,
                    listTanggal: listTanggal,
                    selectedDay: ''
                })
            });
    }

    NumberAddCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    getDebitTotal(array) {
        let total = 0;
        for (let i = 0; i < array.length; i++) {
            total += array[i].debit;
        }
        return total;
    }

    onUpdateChart(tanggal) {
        const { data } = this.state;
        let totalDebit = 0;
        let totalRuntime = 0;
        const selected = data.filter(item => item.tanggal.indexOf(tanggal) !== -1);
        let dataset = [
            this.getDebitTotal(selected.filter(item => item.jam === 0)),
            this.getDebitTotal(selected.filter(item => item.jam === 1)),
            this.getDebitTotal(selected.filter(item => item.jam === 2)),
            this.getDebitTotal(selected.filter(item => item.jam === 3)),
            this.getDebitTotal(selected.filter(item => item.jam === 4)),
            this.getDebitTotal(selected.filter(item => item.jam === 5)),
            this.getDebitTotal(selected.filter(item => item.jam === 6)),
            this.getDebitTotal(selected.filter(item => item.jam === 7)),
            this.getDebitTotal(selected.filter(item => item.jam === 8)),
            this.getDebitTotal(selected.filter(item => item.jam === 9)),
            this.getDebitTotal(selected.filter(item => item.jam === 10)),
            this.getDebitTotal(selected.filter(item => item.jam === 11)),
            this.getDebitTotal(selected.filter(item => item.jam === 12)),
            this.getDebitTotal(selected.filter(item => item.jam === 13)),
            this.getDebitTotal(selected.filter(item => item.jam === 14)),
            this.getDebitTotal(selected.filter(item => item.jam === 15)),
            this.getDebitTotal(selected.filter(item => item.jam === 16)),
            this.getDebitTotal(selected.filter(item => item.jam === 17)),
            this.getDebitTotal(selected.filter(item => item.jam === 18)),
            this.getDebitTotal(selected.filter(item => item.jam === 19)),
            this.getDebitTotal(selected.filter(item => item.jam === 20)),
            this.getDebitTotal(selected.filter(item => item.jam === 21)),
            this.getDebitTotal(selected.filter(item => item.jam === 22)),
            this.getDebitTotal(selected.filter(item => item.jam === 23))
        ];
        for (let i = 0; i < selected.length; i++) {
            totalDebit += selected[i].debit;
            totalRuntime += selected[i].time
        }

        this.setState({
            dataset: dataset,
            totalDebit: this.NumberAddCommas(totalDebit),
            totalRuntime: `${parseInt(totalRuntime / 60)}m${totalRuntime % 60}s`
        })
    }

    render() {
        const { listTanggal, selectedDay, dataset, totalDebit, totalRuntime } = this.state;
        const dataChart = {
            labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            datasets: [
                {
                    data: dataset,
                    colors: [(opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`, (opacity = 1) => `#007ACC`,]
                }
            ]
        }
        return (
            <SafeAreaView style={{ backgroundColor: "#F4F5F9", flex: 1 }}>
                <StatusBar backgroundColor="#F4F5F9" barStyle="dark-content" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: 16, marginBottom: 200 }}>
                        <View style={styles.txtHeader}>
                            <Text style={{ fontSize: 28, color: "#000", fontWeight: '600' }}>Statistik</Text>
                        </View>
                        <View style={styles.boxTanggal}>
                            <Picker
                                mode="dropdown"
                                selectedValue={selectedDay}
                                style={{ height: 50, width: '100%' }}
                                itemStyle={{ color: "#323232", fontWeight: '600' }}
                                onValueChange={(itemValue) => {
                                    this.onUpdateChart(itemValue);
                                    this.setState({ selectedDay: itemValue })
                                    console.log(itemValue)
                                }}
                            >
                                {listTanggal.map((data, i) => {
                                    return (
                                        <Picker.Item key={i} label={data} value={data} />
                                    )
                                })}
                            </Picker>
                        </View>
                        <View style={styles.boxChart}>
                            <ScrollView horizontal style={{ borderRadius: 8, backgroundColor: 'transparent' }} showsHorizontalScrollIndicator={false}>
                                <BarChart
                                    style={{
                                        marginVertical: 8,
                                        borderRadius: 16,
                                        marginHorizontal: 8
                                    }}
                                    showValuesOnTopOfBars={true}
                                    showBarTops={false}
                                    data={dataChart}
                                    fromZero={true}
                                    withCustomBarColorFromData={true}
                                    flatColor={true}
                                    width={(24 * Dimensions.get("window").width) / 5}
                                    height={Dimensions.get("window").width / 2}
                                    chartConfig={{
                                        backgroundColor: "transparent",
                                        backgroundGradientFrom: "#ffffff",
                                        backgroundGradientTo: "#ffffff",
                                        backgroundGradientFromOpacity: 0,
                                        backgroundGradientToOpacity: 0,
                                        decimalPlaces: 2,
                                        color: (opacity = 1) => `#007ACC`,
                                        labelColor: () => '#323232',
                                    }}
                                />
                            </ScrollView>
                            <Text style={{ color: "#323232", alignSelf: 'center' }}>Jam</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={styles.boxDetail}>
                                <Text style={{ color: "#001414", fontSize: 16, fontWeight: '600' }}>Total Air</Text>
                                <Text style={{ color: "#001414", fontSize: 20, fontWeight: '800', marginTop: 8 }}>{totalDebit}ml</Text>
                            </View>
                            <View style={styles.boxDetail}>
                                <Text style={{ color: "#001414", fontSize: 16, fontWeight: '600' }}>Total Waktu</Text>
                                <Text style={{ color: "#001414", fontSize: 20, fontWeight: '800', marginTop: 8 }}>{totalRuntime}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    txtHeader: {
        marginVertical: 24
    },
    graphStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    boxChart: {
        marginVertical: 8,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,

        elevation: 2,
    },
    boxTanggal: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    boxDetail: {
        alignItems: 'center',
        width: '49%',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    }
});

export default ChartStatistic