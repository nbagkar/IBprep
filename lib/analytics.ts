// Analytics utility for Google Analytics 4
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackButtonClick = (
  buttonName: string,
  location?: string,
  additionalData?: Record<string, any>
) => {
  trackEvent('button_click', 'engagement', buttonName);
  
  // Also track as a custom event with more details
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'button_click', {
      button_name: buttonName,
      location: location || 'unknown',
      ...additionalData,
    });
  }
};

export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'G-6FQNVYMMMN', {
      page_path: url,
    });
  }
}; 