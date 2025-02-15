export interface Crypto {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export const STREAM_MESSAGES = {
  paused: 'Stream Paused: New data fetches have been halted. Ongoing requests will complete. Use the refresh button to fetch new data.',
  inactive: 'Stream Stopped: All data fetches have been terminated, including any in-flight requests. Use the refresh button to fetch new data.',
  refreshed: 'Fetched the latest record.'
};

export enum STREAM_STATUS {
  Active = 'active',
  Paused = 'paused',
  Inactive = 'inactive',
}
