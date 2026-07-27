import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkoutSession } from '../../hooks/useWorkout';
import { ExerciseSetCard, RestTimer } from '../components';
import { Exercise } from '../../types/workout.types';
import { STANDARD_EXERCISES } from '../../constants/workout.constants';

export const ActiveWorkoutScreen: React.FC = function ActiveWorkoutScreen() {
  const router = useRouter();

  const {
    activeSession,
    isTracking,
    isPaused,
    incrementDuration,
    updateNotes,
    addExerciseToSession,
    removeExerciseFromSession,
    addSetToExercise,
    removeSetFromExercise,
    updateSetMetrics,
    finishSession,
    abandonSession,
    pauseSession,
    resumeSession,
    isSaving,
  } = useWorkoutSession();

  // 1. Live workout duration timer hook
  useEffect(() => {
    let interval: any = null;
    if (isTracking && !isPaused) {
      interval = setInterval(() => {
        incrementDuration();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, isPaused, incrementDuration]);

  // 2. Rest Timer State
  const [restSeconds, setRestSeconds] = useState(0);
  const [restInitialSeconds, setRestInitialSeconds] = useState(0);
  const [isRestTimerActive, setIsRestTimerActive] = useState(false);
  const [isRestTimerVisible, setIsRestTimerVisible] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRestTimerVisible && isRestTimerActive && restSeconds > 0) {
      timer = setInterval(() => {
        setRestSeconds((prev) => {
          if (prev <= 1) {
            setIsRestTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRestTimerVisible, isRestTimerActive, restSeconds]);

  // Exercise selector modal state
  const [isSelectorVisible, setIsSelectorVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExercises = useMemo(() => {
    return STANDARD_EXERCISES.filter((ex) =>
      ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleStartTimerForSet = useCallback((exName: string) => {
    // Standard default rest time is 90 seconds
    const restTime = 90;
    setRestSeconds(restTime);
    setRestInitialSeconds(restTime);
    setIsRestTimerActive(true);
    setIsRestTimerVisible(true);
  }, []);

  const handleUpdateSet = useCallback(
    (exId: string, setIndex: number, updatedFields: any) => {
      updateSetMetrics(exId, setIndex, updatedFields);
      // If toggled completed: true, trigger the rest timer
      if (updatedFields.completed === true) {
        handleStartTimerForSet('');
      }
    },
    [updateSetMetrics, handleStartTimerForSet]
  );

  const handleAddExercise = useCallback(
    (ex: Exercise) => {
      addExerciseToSession(ex);
      setIsSelectorVisible(false);
      setSearchTerm('');
    },
    [addExerciseToSession]
  );

  const handleFinish = useCallback(async () => {
    if (!activeSession) return;
    try {
      await finishSession();
      router.push('/(app)/workout');
    } catch {
      Alert.alert('Save Failed', 'Could not save the workout log.');
    }
  }, [activeSession, finishSession, router]);

  const handleAbandon = useCallback(() => {
    Alert.alert(
      'Cancel Workout?',
      'Are you sure you want to discard this workout? Current progress will not be saved.',
      [
        { text: 'Keep Workout', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            abandonSession();
            router.push('/(app)/workout');
          },
        },
      ],
      { cancelable: true }
    );
  }, [abandonSession, router]);

  // Formatted Timer Display: HH:MM:SS
  const displayTimer = useMemo(() => {
    if (!activeSession) return '00:00:00';
    const secs = activeSession.durationSeconds || 0;
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [activeSession]);

  if (!isTracking || !activeSession) {
    return (
      <SafeAreaView className="flex-1 bg-zinc-950 items-center justify-center p-4">
        <Text className="text-zinc-500 text-sm font-semibold">No active workout session</Text>
        <TouchableOpacity
          onPress={() => router.push('/(app)/workout')}
          className="mt-4 bg-violet-600 px-6 py-2.5 rounded-xl"
        >
          <Text className="text-zinc-50 text-xs font-bold uppercase tracking-wider">Go to Dashboard</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <View className="flex-1 px-4 pt-4 gap-4">
        {/* Header Widget */}
        <View className="flex-row justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
          <View className="flex-1 gap-1">
            <Text className="text-zinc-50 text-base font-extrabold tracking-tight">
              {activeSession.name}
            </Text>
            <Text className="text-violet-400 text-sm font-mono tracking-widest tabular-nums">
              {displayTimer}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={isPaused ? resumeSession : pauseSession}
              className={`px-3.5 py-2 rounded-xl border ${
                isPaused
                  ? 'bg-violet-600 border-violet-500'
                  : 'bg-zinc-950 border-zinc-850'
              }`}
            >
              <Text className="text-zinc-50 text-xs font-extrabold">
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isSaving}
              onPress={handleFinish}
              className="bg-emerald-600 px-4 py-2 rounded-xl"
            >
              <Text className="text-zinc-50 text-xs font-extrabold">Finish</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable list of exercises and sets */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 160 }}>
          {/* Notes field */}
          <View className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-2xl gap-1.5">
            <Text className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">Session Notes</Text>
            <TextInput
              value={activeSession.notes}
              onChangeText={updateNotes}
              placeholder="How are you feeling today? Log mood, energy, or splits note..."
              placeholderTextColor="#52525b"
              multiline
              className="text-zinc-100 text-xs p-0 text-left"
            />
          </View>

          {/* Exercises list */}
          {activeSession.exercises.map((ex, exIdx) => (
            <View key={ex.id + '-' + exIdx} className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl gap-3">
              {/* Exercise Header */}
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-zinc-50 font-bold text-sm" numberOfLines={1}>
                    {ex.exerciseName}
                  </Text>
                  <Text className="text-zinc-500 text-[10px] capitalize font-medium">
                    {ex.primaryMuscleGroup}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeExerciseFromSession(ex.id)}
                  className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <Text className="text-red-400 text-[9px] font-bold">Remove</Text>
                </TouchableOpacity>
              </View>

              {/* Set log list */}
              <View>
                {ex.sets.map((set, setIdx) => (
                  <ExerciseSetCard
                    key={setIdx}
                    set={set}
                    index={setIdx}
                    defaultUnit="kg"
                    onUpdateSet={(idx, updated) => handleUpdateSet(ex.id, idx, updated)}
                    onDeleteSet={(idx) => removeSetFromExercise(ex.id, idx)}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={() => addSetToExercise(ex.id)}
                className="bg-zinc-950 border border-zinc-800 py-2 rounded-xl items-center justify-center"
              >
                <Text className="text-zinc-400 text-xs font-semibold">+ Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}

          {activeSession.exercises.length === 0 ? (
            <View className="py-12 bg-zinc-900/20 border border-dashed border-zinc-800 items-center justify-center rounded-2xl">
              <Text className="text-zinc-500 text-xs font-semibold">No exercises tracked yet</Text>
              <Text className="text-zinc-600 text-[10px] mt-1">Tap &apos;Add Exercise&apos; to begin logging sets</Text>
            </View>
          ) : null}

          {/* Discard Session Button */}
          <TouchableOpacity
            onPress={handleAbandon}
            className="bg-red-500/10 border border-red-500/30 py-3.5 rounded-xl items-center justify-center"
          >
            <Text className="text-red-400 text-xs font-bold uppercase tracking-wider">Discard Workout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Floating Rest Timer Widget */}
      {isRestTimerVisible ? (
        <View className="absolute bottom-4 left-4 right-4 z-55 items-center">
          <RestTimer
            seconds={restSeconds}
            initialSeconds={restInitialSeconds}
            isActive={isRestTimerActive}
            onPlayPause={() => setIsRestTimerActive(!isRestTimerActive)}
            onAddSeconds={(secs) => setRestSeconds((prev) => Math.max(0, prev + secs))}
            onClose={() => {
              setIsRestTimerVisible(false);
              setIsRestTimerActive(false);
            }}
          />
        </View>
      ) : (
        /* Standard Floating Action bar for adding exercises when timer is not active */
        <View className="absolute bottom-4 left-4 right-4 z-40 bg-zinc-900 border border-zinc-800 p-3.5 rounded-2xl flex-row gap-3 shadow-2xl">
          <TouchableOpacity
            onPress={() => setIsSelectorVisible(true)}
            className="flex-1 bg-violet-600 py-3 rounded-xl items-center justify-center shadow-lg shadow-violet-600/10"
          >
            <Text className="text-zinc-50 text-xs font-extrabold uppercase tracking-wide">
              + Add Exercise
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Exercise Selection Modal */}
      <Modal
        visible={isSelectorVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setIsSelectorVisible(false)}
      >
        <View className="flex-1 bg-zinc-950/95 justify-end pt-10">
          <View className="bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-4 flex-1">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-zinc-50 text-base font-bold">Add Exercise to Workout</Text>
              <TouchableOpacity
                onPress={() => setIsSelectorVisible(false)}
                className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 items-center justify-center"
              >
                <Text className="text-zinc-400 text-sm font-bold">×</Text>
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search exercise library..."
              placeholderTextColor="#71717a"
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 text-sm mb-4"
            />

            {/* FlatList Catalog */}
            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleAddExercise(item)}
                  className="py-3.5 border-b border-zinc-800/60 flex-row justify-between items-center"
                >
                  <View>
                    <Text className="text-zinc-100 font-semibold text-sm">{item.name}</Text>
                    <Text className="text-zinc-500 text-[10px] capitalize mt-0.5">
                      {item.primaryMuscleGroup} • {item.equipment}
                    </Text>
                  </View>
                  <Text className="text-zinc-400 text-sm">+</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View className="py-12 items-center justify-center">
                  <Text className="text-zinc-500 text-xs font-semibold">No exercises match search</Text>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
