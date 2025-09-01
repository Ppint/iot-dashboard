export interface SensorData {
  button_pressed: boolean;
  led: boolean;
  lux: number;
  pi_hum: number;
  pi_temp: number;
  rain: number;
  rt_ms: number;
  soil: number;
  ts_esp: number;
}

export interface SensorSnapshot {
  id: string;
  data: SensorData;
}


