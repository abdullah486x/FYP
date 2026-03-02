import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useScripts } from '../context/ScriptContext';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

export default function EditorScreen({ navigation, route }) {
  const { addScript, updateScript, getScript } = useScripts();

  // If a scriptId was passed in, we're editing an existing script
  const existingScript = route.params?.scriptId ? getScript(route.params.scriptId) : null;

  const [title, setTitle] = useState(existingScript?.title ?? '');
  const [content, setContent] = useState(existingScript?.content ?? '');
  const [language, setLanguage] = useState(existingScript?.language ?? 'en');
  const [showLangPicker, setShowLangPicker] = useState(false);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === language);
  const isRTL = selectedLang?.rtl ?? false;

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a script title.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Missing Content', 'Please enter your script content.');
      return;
    }

    if (existingScript) {
      await updateScript(existingScript.id, {
        title: title.trim(),
        content: content.trim(),
        language,
      });
      navigation.goBack();
    } else {
      const newScript = await addScript({
        title: title.trim(),
        content: content.trim(),
        language,
      });
      // Go straight to teleprompter after creating
      navigation.replace('Teleprompter', { scriptId: newScript.id });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title input */}
        <Text style={styles.label}>SCRIPT TITLE</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Product Review Intro"
          placeholderTextColor="#555"
          returnKeyType="next"
        />

        {/* Language picker */}
        <Text style={styles.label}>LANGUAGE</Text>
        <TouchableOpacity
          style={styles.langSelector}
          onPress={() => setShowLangPicker(!showLangPicker)}
        >
          <Text style={styles.langSelectorText}>
            {selectedLang?.flag}  {selectedLang?.label}
          </Text>
          <Text style={styles.chevron}>{showLangPicker ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showLangPicker && (
          <View style={styles.langDropdown}>
            {SUPPORTED_LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  language === lang.code && styles.langOptionSelected,
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLangPicker(false);
                }}
              >
                <Text style={styles.langOptionText}>
                  {lang.flag}  {lang.label}
                </Text>
                {language === lang.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Script content */}
        <View style={styles.contentHeader}>
          <Text style={styles.label}>SCRIPT CONTENT</Text>
          <Text style={styles.wordCount}>{wordCount} words</Text>
        </View>
        <TextInput
          style={[styles.contentInput, isRTL && styles.contentInputRTL]}
          value={content}
          onChangeText={setContent}
          placeholder="Type or paste your script here..."
          placeholderTextColor="#555"
          multiline
          textAlignVertical="top"
          writingDirection={isRTL ? 'rtl' : 'ltr'}
        />

        {/* Action buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>
              {existingScript ? 'Save Changes' : 'Save & Start ▶'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  titleInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 17,
    borderRadius: 10,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },

  // Language picker
  langSelector: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 4,
  },
  langSelectorText: {
    color: '#fff',
    fontSize: 16,
  },
  chevron: {
    color: '#888',
    fontSize: 12,
  },
  langDropdown: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  langOption: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  langOptionSelected: {
    backgroundColor: '#2a2a2a',
  },
  langOptionText: {
    color: '#fff',
    fontSize: 15,
  },
  checkmark: {
    color: '#e63946',
    fontWeight: '700',
    fontSize: 16,
  },

  // Content input
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordCount: {
    color: '#e63946',
    fontSize: 13,
    fontWeight: '700',
  },
  contentInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    padding: 14,
    minHeight: 280,
    lineHeight: 26,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    marginBottom: 24,
  },
  contentInputRTL: {
    textAlign: 'right',
  },

  // Buttons
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  cancelBtnText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 16,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#e63946',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
