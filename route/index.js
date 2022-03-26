import React from 'react'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as screen from '../screen';
import { BottomNav } from '../component';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const config = {
    animation: 'spring',
    config: {
        stiffness: 1000,
        damping: 500,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
    },
};

const MainApp = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomNav {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Beranda" component={screen.Home} />
            <Tab.Screen name="Statistik" component={screen.Chart} />
            <Tab.Screen name="Jadwal" component={screen.Schedule} />
            <Tab.Screen name="Automasi" component={screen.Automasi} />
        </Tab.Navigator>
    )
}

const Route = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            transitionSpec: {
                open: config,
                close: config,
            },
        }}>
            <Stack.Screen name="Home" component={MainApp} />
            <Stack.Screen name="AddAutomasi" component={screen.AddAutomasi} />
            <Stack.Screen name="Kelembaban" component={screen.Kelembaban} />
            <Stack.Screen name="Suhu" component={screen.Suhu} />
            <Stack.Screen name="AddSchedule" component={screen.AddSchedule} />
        </Stack.Navigator>
    )
}

export default Route;