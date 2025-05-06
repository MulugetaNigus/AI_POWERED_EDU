// Subscription plan levels in order of increasing access
export type SubscriptionPlan = 'free' | 'standard' | 'premium';

// Feature access requirements
export const featureRequirements: Record<string, SubscriptionPlan> = {
  // Free features
  'exam': 'free',
  'basic-chat': 'free',
  'basic-image-analysis': 'free',
  
  // Standard features
  'tuned-chat': 'standard',
  'quiz-summaries': 'standard',
  'community': 'standard',
  'enhanced-image-analysis': 'standard',
  
  // Premium features
  'advanced-image-analysis': 'premium',
  'detailed-quiz-analytics': 'premium',
  'educational-resources': 'premium',
  'priority-support': 'premium'
};

// Plan hierarchy for access control
const planHierarchy: Record<SubscriptionPlan, number> = {
  'free': 0,
  'standard': 1,
  'premium': 2
};

/**
 * Check if a user has access to a specific feature based on their subscription plan
 * @param userPlan The user's current subscription plan
 * @param featureKey The feature key to check access for
 * @returns Boolean indicating if the user has access
 */
export const hasFeatureAccess = (userPlan: SubscriptionPlan, featureKey: string): boolean => {
  // If the feature doesn't exist in our requirements, default to requiring premium
  const requiredPlan = featureRequirements[featureKey] || 'premium';
  
  // Check if user's plan level is greater than or equal to the required plan level
  return planHierarchy[userPlan] >= planHierarchy[requiredPlan];
};

/**
 * Get the required plan name for a specific feature
 * @param featureKey The feature key to check
 * @returns The name of the plan required for this feature
 */
export const getRequiredPlanForFeature = (featureKey: string): SubscriptionPlan => {
  return featureRequirements[featureKey] || 'premium';
};

/**
 * Format a plan name for display
 * @param plan The plan identifier
 * @returns Formatted plan name
 */
export const formatPlanName = (plan: SubscriptionPlan): string => {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
};
