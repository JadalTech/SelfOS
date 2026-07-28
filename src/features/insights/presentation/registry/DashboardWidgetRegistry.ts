/**
 * Dynamic Dashboard Widget Registry
 * SelfOS v1.5.0 — Batch 12B
 */

export interface WidgetMetadata {
  readonly id: string;
  readonly title: string;
  readonly defaultVisible: boolean;
  readonly defaultOrder: number;
}

export interface WidgetUserPreferences {
  readonly visible: boolean;
  readonly order: number;
  readonly favorite: boolean;
  readonly collapsed: boolean;
}

export class DashboardWidgetRegistry {
  private static readonly AVAILABLE_WIDGETS: Record<string, WidgetMetadata> = {
    'health-score-card': { id: 'health-score-card', title: 'Overall Health Index', defaultVisible: true, defaultOrder: 0 },
    'insights-timeline': { id: 'insights-timeline', title: 'Daily Health Insights', defaultVisible: true, defaultOrder: 1 },
    'correlations-matrix': { id: 'correlations-matrix', title: 'Cross-module Correlations', defaultVisible: true, defaultOrder: 2 },
    'habit-streaks': { id: 'habit-streaks', title: 'Active Habits & Patterns', defaultVisible: true, defaultOrder: 3 },
    'recommendations-panel': { id: 'recommendations-panel', title: 'Action Recommendations', defaultVisible: true, defaultOrder: 4 },
    'prediction-projections': { id: 'prediction-projections', title: 'Wellness Projections', defaultVisible: true, defaultOrder: 5 },
  };

  private preferences: Record<string, WidgetUserPreferences> = {};

  constructor() {
    // Initialize default preferences
    Object.keys(DashboardWidgetRegistry.AVAILABLE_WIDGETS).forEach((key) => {
      const meta = DashboardWidgetRegistry.AVAILABLE_WIDGETS[key];
      this.preferences[key] = {
        visible: meta.defaultVisible,
        order: meta.defaultOrder,
        favorite: false,
        collapsed: false,
      };
    });
  }

  getSortedWidgets(): WidgetMetadata[] {
    return Object.values(DashboardWidgetRegistry.AVAILABLE_WIDGETS)
      .filter((w) => this.preferences[w.id]?.visible ?? true)
      .sort((a, b) => {
        const orderA = this.preferences[a.id]?.order ?? a.defaultOrder;
        const orderB = this.preferences[b.id]?.order ?? b.defaultOrder;
        return orderA - orderB;
      });
  }

  updateWidgetPreferences(id: string, updates: Partial<WidgetUserPreferences>): void {
    if (this.preferences[id]) {
      this.preferences[id] = {
        ...this.preferences[id],
        ...updates,
      };
    }
  }

  getWidgetPreference(id: string): WidgetUserPreferences | null {
    return this.preferences[id] || null;
  }
}

export const dashboardWidgetRegistry = new DashboardWidgetRegistry();
export default dashboardWidgetRegistry;
