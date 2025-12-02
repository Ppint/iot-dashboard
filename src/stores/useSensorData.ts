"use client";

import { useEffect, useState } from "react";
import { ensureAnonymousAuth, getFirebaseClient } from "@/lib/firebase/client";
import { onValue, ref } from "firebase/database";
import type { SensorData } from "@/types/sensor";

export interface HistoricalPoint {
  time: string;
  temperature: number;
  humidity: number;
  lux: number;
  soil: number;
}

export interface SensorQueryResult {
  current: SensorData | null;
  history: Array<HistoricalPoint>;
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number") return value;
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Number(value))
  ) {
    return Number(value);
  }
  return null;
}

function coerceSensorData(entry: unknown): SensorData | null {
  try {
    const obj: Record<string, unknown> =
      typeof entry === "string"
        ? (JSON.parse(entry) as Record<string, unknown>)
        : (entry as Record<string, unknown>);
    if (!obj || typeof obj !== "object") return null;
    const rt_ms = coerceNumber(obj["rt_ms"]);
    const pi_temp = coerceNumber(obj["pi_temp"]) ?? coerceNumber(obj["pi-temp"]);
    const pi_hum = coerceNumber(obj["pi_hum"]) ?? coerceNumber(obj["pi-hum"]);
    const lux = coerceNumber(obj["lux"]);
    const soil = coerceNumber(obj["soil"]);
    const ledRaw = obj["led"];
    const rainRaw = obj["rain"];
    const buttonPressedRaw = obj["button_pressed"];
    const ts_esp = coerceNumber(obj["ts_esp"]);
    const alertSeverityRaw = obj["alert_severity"];
    const alertReasonsRaw = obj["alert_reasons"];
    const leafColorRaw = obj["leaf_color"];

    if (rt_ms == null) return null;
    return {
      rt_ms,
      pi_temp: pi_temp ?? 0,
      pi_hum: pi_hum ?? 0,
      lux: lux ?? 0,
      soil: soil ?? 0,
      led:
        typeof ledRaw === "boolean"
          ? ledRaw
          : ledRaw === "true" || ledRaw === 1,
      rain:
        typeof rainRaw === "number"
          ? rainRaw
          : rainRaw === "1" || rainRaw === true
          ? 1
          : 0,
      button_pressed:
        typeof buttonPressedRaw === "boolean"
          ? buttonPressedRaw
          : buttonPressedRaw === "true" || buttonPressedRaw === 1,
      ts_esp: ts_esp ?? 0,
      alert_severity:
        alertSeverityRaw === "critical" ? "critical" : "none",
      alert_reasons: Array.isArray(alertReasonsRaw)
        ? (alertReasonsRaw.filter((v) => typeof v === "string") as Array<string>)
        : alertReasonsRaw && typeof alertReasonsRaw === "object"
        ? Object.values(alertReasonsRaw as Record<string, unknown>)
            .filter((v) => typeof v === "string")
            .map((v) => v as string)
        : typeof alertReasonsRaw === "string" && alertReasonsRaw.trim() !== ""
        ? [alertReasonsRaw]
        : [],
      leaf_color:
        typeof leafColorRaw === "string"
          ? /^(green)$/i.test(leafColorRaw)
            ? "Green"
            : /^(yellow)$/i.test(leafColorRaw)
            ? "Yellow"
            : "unknown"
          : "unknown",
    };
  } catch {
    return null;
  }
}

function mapToResult(
  raw: Record<string, unknown> | Array<unknown> | null
): SensorQueryResult {
  if (!raw) return { current: null, history: [] };
  const entries: Array<unknown> = Array.isArray(raw)
    ? raw.filter(Boolean)
    : Object.values(raw);
  const coerced: Array<SensorData> = entries
    .map((e) => coerceSensorData(e))
    .filter((e): e is SensorData => !!e);
  coerced.sort((a, b) => (a.rt_ms ?? 0) - (b.rt_ms ?? 0));
  const last24 = coerced.slice(-24);
  const history = last24.map((d) => ({
    time: new Date(d.rt_ms).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    temperature: d.pi_temp,
    humidity: d.pi_hum,
    lux: d.lux,
    soil: d.soil,
  }));
  const current = coerced.length > 0 ? coerced[coerced.length - 1] : null;
  return { current, history };
}

export function useSensorData() {
  const { db } = getFirebaseClient();
  const [data, setData] = useState<SensorQueryResult>({
    current: null,
    history: [],
  });

  useEffect(() => {
    let detachDatabaseListener: (() => void) | null = null;
    let isActive = true;

    (async () => {
      await ensureAnonymousAuth();
      if (!isActive) return;

      const mergedRef = ref(db, "sensor_data/merged");
      detachDatabaseListener = onValue(
        mergedRef,
        (snapshot) => {
          const raw = snapshot.val();
          const mapped = mapToResult(raw);
          setData(mapped);
        },
        (error) => {
          console.error("[useSensorData] onValue error", error);
          setData({ current: null, history: [] });
        }
      );
    })();

    return () => {
      isActive = false;
      if (detachDatabaseListener) detachDatabaseListener();
    };
  }, [db]);

  return data;
}
