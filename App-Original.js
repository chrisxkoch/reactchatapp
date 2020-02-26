import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Button, Alert, Text } from 'react-native';



export default class HelloWorld extends Component {
    constructor(props) {
        super(props);
        this.state = { text: '' };
    }

    // alert the user input
    alertMyText(input = []) {
        Alert.alert(input.text);
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={styles.box1}></View>

                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => this.setState({ text })}
                    value={this.state.text}
                    placeholder='Type here ...'
                />
                <Text>You wrote: {this.state.text}</Text>


                <View style={styles.box2}></View>
                <Button
                    onPress={() => {
                        this.alertMyText({ text: this.state.text });
                    }}
                    title="Press Me"
                />
                <View style={styles.box3}></View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    box1: {
        flex: 20,
        backgroundColor: 'blue'
    },
    box2: {
        flex: 20,
        backgroundColor: 'red'
    },
    box3: {
        flex: 20,
        backgroundColor: 'black'
    }
});