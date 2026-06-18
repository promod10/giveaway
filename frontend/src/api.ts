import axios from 'axios';

// Get backend API URL from environment variables or default to localhost:3001
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/giveaway';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface GiveawayRequest {
  platform: string;
  postUrl: string;
  winnersCount: number;
}

export interface GiveawayResponse {
  message: string;
  winners: string[];
  giveawayId: string;
}

export interface GiveawayHistoryItem {
  _id: string;
  platform: string;
  postUrl: string;
  winnersCount: number;
  winners: string[];
  createdAt: string;
}

export const api = {
  pickWinner: async (data: GiveawayRequest): Promise<GiveawayResponse> => {
    const response = await apiClient.post<GiveawayResponse>('/pick-winner', data);
    return response.data;
  },

  getHistory: async (): Promise<GiveawayHistoryItem[]> => {
    const response = await apiClient.get<GiveawayHistoryItem[]>('/history');
    return response.data;
  },
};
