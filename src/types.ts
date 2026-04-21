export interface Species {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  habitat: string;
  behavior: string;
  characteristics: string[];
  imageUrl: string;
  status: 'Least Concern' | 'Vulnerable' | 'Endangered' | 'Critically Endangered';
  location: {
    lat: number;
    lng: number;
    park: string;
    district: string;
  };
}

export interface AnimalMovement {
  id: string;
  speciesId: string;
  coordinates: [number, number];
  timestamp: number;
  type: 'live' | 'predicted';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}
