import axios from 'axios';

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  const response = await api.get<GuestbookEntry[]>('/guestbook');
  return response.data;
};

export const createGuestbookEntry = async (data: { name: string; message: string }): Promise<GuestbookEntry> => {
  const response = await api.post<GuestbookEntry>('/guestbook', data);
  return response.data;
};