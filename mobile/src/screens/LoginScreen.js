import React, {useState} from "react";
import { SafeAreaView, View, StyleSheet, StatusBar , TextInput, Button,TouchableOpacity, Text, Alert, LogBox} from "react-native";
import TextAnimation from "../components/logo"; // Make sure the path is correct
import { navigate } from "../../App";
// import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeToken, getToken, removeToken } from "../functions/storage";


const apiBaseUrl = 'http://www.leetsocial.com';
const jwtDecode = require('jwt-decode');
   
const LoginScreen = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('testing@test.com'); //remove later this is for testing
    // const [email, setEmail] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('password'); //remove later this is for testing
    // const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
        // ... additional state fields as needed

    const handleLogin = () => {
            const payload = {
                    email:email,
                    password:password,
                };
            fetch(apiBaseUrl+'/api/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then (async res => {
                try{
                    const jsonRes = await res.json();
                    if (res.status != 200){
                        setIsError(true);
                        setMessage(jsonRes.error);
                    }
                    else {
                        setIsError(false);
                        const token = jsonRes.accessToken;
                        await storeToken(token);
                        const decoded = jwtDecode(token);
                        navigate('LoginSuccess', {userData:decoded});
                    }
                }catch (err){
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
        };
    
    
    const handleSignUp = () => {
        if (password !== confirmPassword) {
            setMessage("Passwords don't match");
            setIsError(true);
        } else {

        const payload = {
            email:email,
            password:password,
            firstName:firstName,
            lastName:lastName,
            };
            fetch(apiBaseUrl+'/api/signup',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
            .then (async res => {
                try{
                    const jsonRes = await res.json();
                    if (res.status != 201){
                        setIsError(true);
                        setMessage('Error: ' + jsonRes.error);
                    }
                    else {
                        setIsError(false);
                        navigate('SignUpSuccess', {data: jsonRes});
                    }
                }catch (err){
                    console.log(err);
                }  
            })
            .catch(err => {
                console.log(err);
            });
        }
        };



    const getMessage = () => {
        const status = isError ? 'Error: ' : 'Success: ';
        return status + message;
    }


    return (
        <SafeAreaView style={styles.container}>
                    <View style={styles.centeredView}>
                        <TextAnimation />
                    </View>
                    <View style={styles.loginContainer}>
                    <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                    {isSignUp && (
                        <>
                        <TextInput
                            style={styles.input}
                            placeholder="First Name"
                            placeholderTextColor={'black'}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            placeholderTextColor={'black'}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        </>
                    )}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor={'black'}
                            value={email}
                            // onChangeText={newText => setEmail(newText)}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={'black'}
                            // secureTextEntry
                            value={password}
                            // onChangeText={newText => setPassword(newText)}
                            autoCapitalize="none"
                        />
                        {isSignUp && (
                            <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            placeholderTextColor={'black'}
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            />
                        
                        )}
                        <Button
                            title={isSignUp ? "Sign Up" : "Login"}
                            onPress={isSignUp ? handleSignUp : handleLogin}
                        />
                        <TouchableOpacity
                            onPress={() => setIsSignUp(!isSignUp)}
                            style={styles.toggleButton}
                        >
                            <Text style={styles.toggleButtonText}>
                            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                            </Text>
                        </TouchableOpacity>
                    </View>
            </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3c4749',
        flex: 1,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
    },
    loginContainer: {
        margin: 20,
        padding: 20,
        backgroundColor: '#2e2f38', // Darker grey background for the form
        borderRadius: 5,
        elevation: 10, // Elevation for Android (adds shadow effect)
        // For iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: 'black', // White text for the inputs
        backgroundColor: 'white', // Even darker grey for the input fields
    },
    toggleButton: {
        marginTop: 20,
      },
      toggleButtonText: {
        color: '#3797EF',
      },
});


export default LoginScreen;