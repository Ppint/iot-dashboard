export type AlertSeverity = "critical" | "none";

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
  alert_severity: AlertSeverity;
  alert_reasons: Array<string>;
}

export interface SensorSnapshot {
  id: string;
  data: SensorData;
}


