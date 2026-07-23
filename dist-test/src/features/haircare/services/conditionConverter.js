"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hairConditionConverter = void 0;
const firestore_1 = require("firebase/firestore");
exports.hairConditionConverter = {
    toFirestore(condition) {
        return {
            userId: condition.userId,
            recordDate: condition.recordDate,
            hairType: condition.hairType,
            porosity: condition.porosity,
            scalpType: condition.scalpType,
            hairDensity: condition.hairDensity,
            sheddingLevel: condition.sheddingLevel,
            dandruffLevel: condition.dandruffLevel,
            itchinessLevel: condition.itchinessLevel,
            oilinessLevel: condition.oilinessLevel,
            drynessLevel: condition.drynessLevel,
            breakageLevel: condition.breakageLevel,
            frizzLevel: condition.frizzLevel,
            shineLevel: condition.shineLevel,
            overallHealth: condition.overallHealth,
            stressLevel: condition.stressLevel ?? null,
            sleepHours: condition.sleepHours ?? null,
            waterIntakeLiters: condition.waterIntakeLiters ?? null,
            notes: condition.notes ?? null,
            createdAt: condition.createdAt instanceof Date ? firestore_1.Timestamp.fromDate(condition.createdAt) : firestore_1.Timestamp.now(),
            updatedAt: firestore_1.Timestamp.now(),
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options);
        return {
            id: snapshot.id,
            userId: data.userId || '',
            recordDate: data.recordDate || '',
            hairType: data.hairType || 'wavy',
            porosity: data.porosity || 'medium',
            scalpType: data.scalpType || 'normal',
            hairDensity: data.hairDensity || 'medium',
            sheddingLevel: data.sheddingLevel ?? 1,
            dandruffLevel: data.dandruffLevel ?? 1,
            itchinessLevel: data.itchinessLevel ?? 1,
            oilinessLevel: data.oilinessLevel ?? 1,
            drynessLevel: data.drynessLevel ?? 1,
            breakageLevel: data.breakageLevel ?? 1,
            frizzLevel: data.frizzLevel ?? 1,
            shineLevel: data.shineLevel ?? 3,
            overallHealth: data.overallHealth ?? 8,
            stressLevel: data.stressLevel || undefined,
            sleepHours: data.sleepHours || undefined,
            waterIntakeLiters: data.waterIntakeLiters || undefined,
            notes: data.notes || undefined,
            createdAt: data.createdAt instanceof firestore_1.Timestamp ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt instanceof firestore_1.Timestamp ? data.updatedAt.toDate() : new Date(),
        };
    },
};
