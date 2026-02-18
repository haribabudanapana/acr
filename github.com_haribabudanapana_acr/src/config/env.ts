/**
 * Environment configuration for ACR automation.
 *
 * This file centralizes all environment-specific constants and settings.
 * All test specs and page objects should import from here for consistency.
 */

// Public site base URL for Site Feasibility & Registration flows
// Can be overridden via process.env if needed for CI/CD flexibility
export const ACR_PUBLIC_SITE_URL: string = process.env.ACR_PUBLIC_SITE_URL || "https://acr-public-site.example.com";

// Export as ENV object for convenient destructuring and backward compatibility
export const ENV = {
  ACR_PUBLIC_SITE_URL,
  // Add other environment variables here as needed
};

export default ENV;
