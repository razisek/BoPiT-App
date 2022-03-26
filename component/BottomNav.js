import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomNav = ({ state, descriptors, navigation }) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const Ikon = () => {
                    if (label == "Beranda") {
                        return isFocused ? <Icon name="home" size={20} color="#007ACC" /> : <Icon name="home-outline" size={20} color="#333333" />;
                    }
                    if (label == "Jadwal") {
                        return isFocused ? <Icon name="alarm" size={20} color="#007ACC" /> : <Icon name="alarm-outline" size={20} color="#333333" />;
                    }
                    if (label == "Automasi") {
                        return isFocused ? <Icon name="water" size={20} color="#007ACC" /> : <Icon name="water-outline" size={20} color="#333333" />;
                    }
                    if (label == "Statistik") {
                        return isFocused ? <Icon name="bar-chart" size={20} color="#007ACC" /> : <Icon name="bar-chart-outline" size={20} color="#333333" />;
                    }
                }

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.TabItem}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Ikon />
                        </View>
                        <Text style={{ color: isFocused ? '#007ACC' : '#333333', fontWeight: '700', fontFamily: 'NunitoSans' }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        paddingVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,

        elevation: 24,
    },
    TabItem: {
        alignContent: 'center',
    },
});

export default BottomNav;