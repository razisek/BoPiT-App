import * as React from 'react';
import { Modal, View } from 'react-native';

export default class MyModal extends React.PureComponent {

    render() {
        return (
            <Modal
                animationType="fade"
                statusBarTranslucent
                transparent={true}
                visible={this.props.visible}
                {...this.props}
            >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <View style={{
                            margin: 16,
                            backgroundColor: "white",
                            borderRadius: 16,
                            padding: 16,
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 5
                        }}>
                            {this.props.children}
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}