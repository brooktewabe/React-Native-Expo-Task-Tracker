import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { ImagesAssets } from "../../assets/ImagesAssets";

const Login = ({ onLoginSuccess }) => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [inputCount, setInputCount] = useState(0);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, mess, btnTxt, btnFunc) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    if (!isBiometricAvailable) {
      return alertComponent(
        'Please enter your passcode',
        'Biometric Authentication not supported',
        'OK',
        () => fallBackToDefaultAuth()
      );
    }

    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      return alertComponent(
        'Biometric record not found',
        'Please login with your passcode',
        'OK',
        () => fallBackToDefaultAuth()
      );
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    if (biometricAuth.success) {
      console.log('Biometric authentication success');
      onLoginSuccess(); 
    } else {
      alertComponent(
        'Authentication failed',
        'Biometric Authentication failed',
        'OK',
        () => {}
      );
    }
  };

  const handlePasscodeInput = (digit) => {
    const newPasscode = passcode + digit;
    if (inputCount < 3) {
      setPasscode(newPasscode);
      setInputCount(inputCount + 1);
    } else {
      setPasscode(newPasscode);
      setInputCount(inputCount + 1);
      handlePasscodeAuth(newPasscode);
    }
  };

  const handlePasscodeAuth = (enteredPasscode) => {
    if (enteredPasscode === '1234') { 
      console.log('Passcode authentication success');
      setPasscode(''); 
      setInputCount(0); 
      onLoginSuccess(); 
    } else {
      Alert.alert('Authentication failed', 'Incorrect passcode', [
        {
          text: 'OK',
          onPress: () => {
            setPasscode(''); 
            setInputCount(0); 
          },
        },
      ]);
    }
  };

  const renderPasscodeDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.dot, { backgroundColor: i < inputCount ? '#000' : '#FFF' }]}
        />
      );
    }
    return dots;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Image 
          source={ImagesAssets.logoIcon}
          style={styles.image}
        />
        <Text style={styles.title}>Enter Your Passcode</Text>
        <View style={styles.passcodeContainer}>{renderPasscodeDots()}</View>

        <View style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
            <TouchableOpacity
              key={digit}
              style={styles.keypadButton}
              onPress={() => handlePasscodeInput(digit.toString())}
            >
              <Text style={styles.keypadButtonText}>{digit}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {isBiometricSupported && (
          <TouchableOpacity onPress={handleBiometricAuth}>
            <Image
              source={ImagesAssets.bioIcon}
              style={{ width: 64, height: 64 }}
            />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  innerContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    // padding: 20,
    // borderRadius: 10,
    // elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  passcodeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: 'silver',
    margin: 5,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  keypadButton: {
    width: 70,
    height: 70,
    alignItems: 'center',
    borderRadius: 35,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  keypadButtonText: {
    fontSize: 24,
  },
  image: {
    width: "20%",
    height: "15%",
    resizeMode: "contain",
    marginBottom: 20,
  },
});

export default Login;
