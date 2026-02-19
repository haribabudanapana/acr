export interface EnvConfig {
  BASE_URL: string;
  TEST_ENV: string;
  USERNAME: string;
  PASSWORD: string;
  BROWSER: string;
  OS: string;
  APPUSERNAME: string;
  APPPASSWORD: string;
  ACR_PUBLIC_SITE_URL: string;
  ACR_LOGIN_URL: string;
  ACR_LOGIN_API_ENDPOINT: string;
}

export const ENV: EnvConfig = {
  BASE_URL: 'https://alznetdashboard-uat.acr.org/',
  TEST_ENV: 'uat',
  USERNAME: 'acrstaff121@gmail.com',
  PASSWORD: 'Password@123$',
  BROWSER: 'chrome',
  OS: 'windows',
  APPUSERNAME: 'siteuseralznet@gmail.com',
  APPPASSWORD: 'SU2025@dashboard',
  // Public-facing site URL for navigation in tests
  ACR_PUBLIC_SITE_URL: process.env.ACR_PUBLIC_SITE_URL || 'https://alznetproviders-uat.acr.org/',
  // ACR login page endpoint for login flow
  ACR_LOGIN_URL: process.env.ACR_LOGIN_URL || 'https://login-uat.acr.org/',
  // ACR login API endpoint for programmatic login (if needed)
  ACR_LOGIN_API_ENDPOINT: process.env.ACR_LOGIN_API_ENDPOINT || 'https://login-uat.acr.org/api/authenticate'
};
