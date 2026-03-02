import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SPEED_PRESETS = [25, 50, 75, 100, 150];

export default function ScrollSpeedControl({ speed, onSpeedChange }) {
  function decrease() {
    onSpeedChange(Math.max(10, speed - 10));
  }

  function increase() {
    onSpeedChange(Math.min(200, speed + 10));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>SPEED</Text>
      <View style={styles.row}>

        {/* Fine decrease */}
        <TouchableOpacity style={styles.stepBtn} onPress={decrease}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>

        {/* Speed presets */}
        <View style={styles.presets}>
          {SPEED_PRESETS.map(preset => (
            <TouchableOpacity
              key={preset}
              style={[styles.preset, speed === preset && styles.presetActive]}
              onPress={() => onSpeedChange(preset)}
            >
              <Text style={[styles.presetText, speed === preset && styles.presetTextActive]}>
                {preset}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fine increase */}
        <TouchableOpacity style={styles.stepBtn} onPress={increase}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  label: {
    color: '#888',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 28,
  },
  presets: {
    flexDirection: 'row',
    gap: 6,
  },
  preset: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  presetActive: {
    backgroundColor: '#e63946',
  },
  presetText: {
    color: '#777',
    fontSize: 13,
  },
  presetTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
