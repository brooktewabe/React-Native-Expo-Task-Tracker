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
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [inputCount, setInputCount] = useState(0);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);

        if (enrolled) {
          handleBiometricAuth(); // Attempt biometric authentication on component mount
        } else {
          alertComponent(
            'Biometric record not found',
            'Please login with your passcode',
            'OK',
            () => {} // Do nothing here, simply fall back to passcode entry
          );
        }
      } else {
        alertComponent(
          'Biometric Authentication not supported',
          'Please enter your passcode',
          'OK',
          () => {} // Do nothing here, simply fall back to passcode entry
        );
      }
    })();
  }, []);

  const fallBackToDefaultAuth = () => {
    console.log('fall back to password authentication');
  };

  const alertComponent = (title, message, btnTxt, btnFunc) => {
    return Alert.alert(title, message, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
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
        {/* <Image 
          source={ImagesAssets.icon}
          style={styles.image}
        /> */}
        <Text style={styles.title}>Enter Your Passcode</Text>
        <View style={styles.passcodeContainer}>{renderPasscodeDots()}</View>

        <View style={styles.keypad}>
          {[1, 4, 7].map((digit) => (
            <View key={digit} style={styles.keypadRow}>
              {[digit, digit + 1, digit + 2].map((btnDigit) => (
                <TouchableOpacity
                  key={btnDigit}
                  style={styles.keypadButton}
                  onPress={() => handlePasscodeInput(btnDigit.toString())}
                >
                  <Text style={styles.keypadButtonText}>{btnDigit}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keypadButton}
              onPress={() => handlePasscodeInput('0')}
            >
              <Text style={styles.keypadButtonText}>0</Text>
            </TouchableOpacity>
          </View>
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
    flexDirection: 'column', // Stack rows vertically
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    width: 210, // Fixed width to ensure 3 buttons per row
    justifyContent: 'center',
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
    justifyContent: 'center',
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
