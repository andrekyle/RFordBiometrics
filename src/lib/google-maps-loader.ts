// Dynamically loads the Google Maps API script using the env variable
// so the API key is never hardcoded in source or HTML.

let loadPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  if (typeof google !== 'undefined' && google.maps) {
    return Promise.resolve();
  }

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('VITE_GOOGLE_MAPS_API_KEY is not set in environment variables');
      reject(new Error('Google Maps API key is missing'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function getGoogleMapsApiKey(): string {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
}
