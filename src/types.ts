/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MuxChannel {
  name: string;
  type: string; // e.g., HD, SD
  description?: string;
}

export interface MuxStation {
  id: string;
  name: string; // e.g., MUX TVRI Djoglo
  operator: string; // e.g., TVRI
  channelFreq: number; // e.g., UHF 34 (578 MHz)
  city: string;
  province: string;
  lat: number;
  lng: number;
  height?: number; // tower height in meters
  powerKw?: number; // transmitting power
  channels: string[]; // List of TV channels carried
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
  isSimulated?: boolean;
}

export interface ActionLog {
  timestamp: string;
  actionType: string;
  searchQuery?: string;
  stationName?: string;
  bearing?: number;
  distance?: number;
  signalStrength?: number;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface SignalRecommendation {
  bearing: number;
  distance: number;
  antennaType: "Sangat Direkomendasikan Yagi (Sektoral)" | "Antena Omnidirectional" | "Yagi Medium-Gain" | "Antena Indoor Grid/Loop";
  antennaHeightMeters: number;
  boosterNeeded: boolean;
  estSignalDb: number; // e.g. -65 dBm
  estSignalStatus: "SANGAT BAIK" | "BAIK" | "CUKUP" | "LEMAH" | "SANGAT LEMAH";
  description: string;
}

export interface DevSettings {
  googleMapsKey: string;
  gasUrl: string; // Google Apps Script Web App URL
  geminiKey: string;
  isSimulatedGas: boolean;
}
