/**
 * Assistant Personalization Service
 * SelfOS v2.0.0 — Batch 13C
 */

export interface PersonalizationPreferences {
  readonly coachingTone: 'motivational' | 'analytical' | 'direct';
  readonly reminderFrequency: 'low' | 'medium' | 'high';
  readonly detailLevel: 'concise' | 'detailed';
}

export class AssistantPersonalizationService {
  private prefs: PersonalizationPreferences = {
    coachingTone: 'motivational',
    reminderFrequency: 'medium',
    detailLevel: 'concise',
  };

  getPreferences(): PersonalizationPreferences {
    return { ...this.prefs };
  }

  updatePreferences(newPrefs: Partial<PersonalizationPreferences>): PersonalizationPreferences {
    this.prefs = { ...this.prefs, ...newPrefs };
    return { ...this.prefs };
  }
}

export const assistantPersonalizationService = new AssistantPersonalizationService();
export default assistantPersonalizationService;
