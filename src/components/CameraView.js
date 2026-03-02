import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// ─────────────────────────────────────────────────────────────────
// PLACEHOLDER — Replace this with the real camera once you've
// installed react-native-vision-camera.
//
// Steps:
//   1. npm install react-native-vision-camera
//   2. cd ios && pod install && cd ..
//   3. Add permissions to Info.plist (iOS) and AndroidManifest.xml
//   4. Replace the <View> below with:
//
//   import { Camera, useCameraDevice } from 'react-native-vision-camera';
//
//   export default function CameraView({ height, cameraPosition }) {
//     const device = useCameraDevice(cameraPosition);
//     if (!device) return <View style={{ height, backgroundColor: '#111' }} />;
//     return (
//       <Camera
//         style={{ height }}
//         device={device}
//         isActive={true}
//         video={true}
//         audio={true}
//       />
//     );
//   }
// ─────────────────────────────────────────────────────────────────

export default function CameraView({ height, cameraPosition, isRecording }) {
  return (
    <View style={[styles.placeholder, { height }]}>
      <Text style={styles.icon}>📹</Text>
      <Text style={styles.label}>Camera Preview</Text>
      <Text style={styles.sub}>({cameraPosition} camera)</Text>
      <Text style={styles.hint}>
        Install react-native-vision-camera{'\n'}and replace this component
      </Text>
      {isRecording && <Text style={styles.rec}>● REC</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 48,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    color: '#888',
    fontSize: 14,
  },
  hint: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  rec: {
    color: '#e63946',
    fontWeight: '800',
    marginTop: 10,
    fontSize: 16,
  },
});
