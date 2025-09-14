export interface TouristRequest {
  id: string;
  touristId: string;
  touristName: string;
  location: string;
  destination: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  guideId?: string;
  notes?: string;
  createdAt: Date;
}

export interface SOSAlert {
  id: string;
  touristId: string;
  touristName: string;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  message: string;
  status: 'active' | 'responding' | 'resolved';
  respondingGuideId?: string;
  createdAt: Date;
}

export interface Guide {
  id: string;
  email: string;
  name: string;
  phone?: string;
  activeRequests: number;
  rating: number;
  isAvailable: boolean;
}