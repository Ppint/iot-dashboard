"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Droplets,
  Sun,
  Sprout,
  CloudRain,
  Cpu,
  Power,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import { useSensorData } from "@/stores/useSensorData";

export default function IoTDashboard() {
  const { current, history } = useSensorData();

  const currentData = current;
  const historicalData = history;

  const severity = currentData?.alert_severity ?? "none";
  const alertReasons: Array<string> = currentData?.alert_reasons ?? [];

  const getSensorStatus = (value: number, type: string) => {
    switch (type) {
      case "temperature":
        if (value < 18) return { status: "Low", variant: "muted" as const };
        if (value > 30)
          return { status: "High", variant: "destructive" as const };
        return { status: "Optimal", variant: "success" as const };
      case "humidity":
        if (value < 30) return { status: "Low", variant: "muted" as const };
        if (value > 70)
          return { status: "High", variant: "destructive" as const };
        return { status: "Good", variant: "success" as const };
      case "light":
        if (value < 100) return { status: "Dark", variant: "muted" as const };
        if (value > 300)
          return { status: "Bright", variant: "default" as const };
        return { status: "Good", variant: "success" as const };
      case "soil":
        if (value < 30) return { status: "Dry", variant: "destructive" as const };
        if (value > 70) return { status: "Wet", variant: "default" as const };
        return { status: "Moist", variant: "success" as const };
      default:
        return { status: "Unknown", variant: "muted" as const };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-background/60 backdrop-blur">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-semibold text-foreground text-balance">
            IoT Environmental Monitor
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Real-time sensor data dashboard
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Current Status */}
        <Card className={severity === "critical" ? "border-red-500 border-4" : undefined}>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            {severity === "critical" ? (
              <div>
                <p className="text-base font-medium text-destructive">CRITICAL</p>
                {alertReasons.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside text-sm text-destructive">
                    {alertReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <p className="text-base font-medium text-foreground">NORMAL</p>
            )}
          </CardContent>
        </Card>
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Temperature Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temperature</CardTitle>
              <Thermometer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {typeof currentData?.pi_temp === "number"
                  ? `${currentData.pi_temp.toFixed(1)}°C`
                  : "—"}
              </div>
              <Badge
                className="mt-2"
                variant={
                  getSensorStatus(currentData?.pi_temp ?? NaN, "temperature")
                    .variant
                }
              >
                {
                  getSensorStatus(currentData?.pi_temp ?? NaN, "temperature")
                    .status
                }
              </Badge>
            </CardContent>
          </Card>

          {/* Humidity Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Humidity</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {typeof currentData?.pi_hum === "number"
                  ? `${currentData.pi_hum.toFixed(1)}%`
                  : "—"}
              </div>
              <Badge
                className="mt-2"
                variant={
                  getSensorStatus(currentData?.pi_hum ?? NaN, "humidity")
                    .variant
                }
              >
                {getSensorStatus(currentData?.pi_hum ?? NaN, "humidity").status}
              </Badge>
            </CardContent>
          </Card>

          {/* Light Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Light Level</CardTitle>
              <Sun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {typeof currentData?.lux === "number"
                  ? `${currentData.lux.toFixed(0)} lux`
                  : "—"}
              </div>
              <Badge
                className="mt-2"
                variant={
                  getSensorStatus(currentData?.lux ?? NaN, "light").variant
                }
              >
                {getSensorStatus(currentData?.lux ?? NaN, "light").status}
              </Badge>
            </CardContent>
          </Card>

          {/* Soil Moisture Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Soil Moisture
              </CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground">
                {typeof currentData?.soil === "number" ? `${currentData.soil.toFixed(0)}%` : "—"}
              </div>
              <Badge
                className="mt-2"
                variant={
                  getSensorStatus(currentData?.soil ?? NaN, "soil").variant
                }
              >
                {getSensorStatus(currentData?.soil ?? NaN, "soil").status}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Device Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LED Status</CardTitle>
              <Power className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={currentData?.led ? "success" : "muted"}>
                {currentData?.led ? "ON" : "OFF"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rain Sensor</CardTitle>
              <CloudRain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={!currentData?.rain ? "default" : "muted"}>
                {!currentData?.rain ? "RAIN DETECTED" : "NO RAIN"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Badge variant={currentData ? "success" : "muted"}>
                {currentData ? "ONLINE" : "OFFLINE"}
              </Badge>
              <p className="text-xs text-neutral-400 mt-2">
                Last update:{" "}
                {typeof currentData?.rt_ms === "number"
                  ? new Date(currentData.rt_ms).toLocaleTimeString()
                  : "—"}
              </p>
            </CardContent>
          </Card>
        </div>
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Temperature & Humidity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Temperature & Humidity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData}>
                    <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(23,23,23,0.9)",
                        border: "1px solid #262626",
                        borderRadius: 8,
                        color: "#e5e7eb",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      name="Temperature (°C)"
                    />
                    <Line
                      type="monotone"
                      dataKey="humidity"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Humidity (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Light Level Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Light Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={historicalData}>
                    <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(23,23,23,0.9)",
                        border: "1px solid #262626",
                        borderRadius: 8,
                        color: "#e5e7eb",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="lux"
                      stroke="#a78bfa"
                      fill="#a78bfa"
                      fillOpacity={0.25}
                      name="Light (lux)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Soil Moisture Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Soil Moisture Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 12 }}
                      tickMargin={8}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(23,23,23,0.9)",
                        border: "1px solid #262626",
                        borderRadius: 8,
                        color: "#e5e7eb",
                      }}
                    />
                    <Bar
                      dataKey="soil"
                      fill="#f59e0b"
                      name="Soil Moisture"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
