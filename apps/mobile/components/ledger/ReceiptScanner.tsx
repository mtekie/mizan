import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MizanColors } from '@mizan/ui-tokens';

export function ReceiptScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.msg}>We need camera permission to scan receipts.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
           <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Position receipt in frame</Text>
          <View style={styles.scanRegion} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 400,
    backgroundColor: '#000',
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  msg: { color: '#fff', marginBottom: 16 },
  btn: { backgroundColor: MizanColors.mintPrimary, padding: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontFamily: 'Inter_700Bold' },
  camera: { flex: 1, width: '100%' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanRegion: {
    width: 280,
    height: 350,
    borderWidth: 2,
    borderColor: MizanColors.mintPrimary,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  overlayText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    fontSize: 16,
  }
});
