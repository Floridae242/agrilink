import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { io, Socket } from 'socket.io-client';
import { api } from '../utils/api';

interface Event {
  id: string;
  type: string;
  temp: number | null;
  hum: number | null;
  at: string;
  place: string | null;
  note: string | null;
}

interface Lot {
  id: string;
  publicId: string;
  produce: string;
  farm: {
    name: string;
    district: string;
  };
  events: Event[];
}

interface SensorUpdate {
  lotId: string;
  lotPublicId: string;
  farmName: string;
  produce: string;
  event: Event;
  deviceName: string;
  timestamp: string;
}

export default function Logistics() {
  const [lot, setLot] = useState<Lot | null>(null);
  const [publicId, setPublicId] = useState('DEMOLOT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveUpdates, setLiveUpdates] = useState<SensorUpdate[]>([]);

  // Load lot data
  const loadLot = useCallback(async (lotPublicId: string) => {
    if (!lotPublicId.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const lotData = await api.getPublicLot(lotPublicId);
      setLot(lotData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lot');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const socketInstance = io(`${apiBase}/realtime`);

    socketInstance.on('connect', () => {
      console.log('Connected to realtime feed');
    });

    socketInstance.on('sensor:update', (data: SensorUpdate) => {
      console.log('Sensor update received:', data);
      setLiveUpdates(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 updates

      // Update current lot if it matches
      if (lot && data.lotPublicId === lot.publicId) {
        setLot(prevLot => {
          if (!prevLot) return prevLot;
          return {
            ...prevLot,
            events: [data.event, ...prevLot.events]
          };
        });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from realtime feed');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [lot]);

  // Load initial lot
  useEffect(() => {
    loadLot(publicId);
  }, [loadLot, publicId]);

  // Prepare chart data
  const chartData = React.useMemo(() => {
    if (!lot) return [];
    
    return lot.events
      .filter(event => event.temp !== null)
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
      .slice(-20) // Last 20 readings
      .map(event => ({
        time: new Date(event.at).toLocaleTimeString(),
        temp: event.temp,
        hum: event.hum || 0,
      }));
  }, [lot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLot(publicId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Smart Logistics & Cold Chain</h2>
        <p className="text-gray-600">Real-time IoT monitoring and temperature tracking</p>
      </div>

      {/* Lot Selector */}
      <Card>
        <CardHeader className="font-semibold">Select Lot for Monitoring</CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={publicId}
              onChange={(e) => setPublicId(e.target.value)}
              placeholder="Enter Lot Public ID (e.g., DEMOLOT)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load Lot'}
            </button>
          </form>
          {error && (
            <p className="mt-2 text-red-600 text-sm">{error}</p>
          )}
        </CardContent>
      </Card>

      {lot && (
        <>
          {/* Lot Info */}
          <Card>
            <CardHeader className="font-semibold">Lot Information</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <span className="font-medium">Public ID:</span>
                  <p className="text-gray-600">{lot.publicId}</p>
                </div>
                <div>
                  <span className="font-medium">Produce:</span>
                  <p className="text-gray-600">{lot.produce}</p>
                </div>
                <div>
                  <span className="font-medium">Farm:</span>
                  <p className="text-gray-600">{lot.farm.name}</p>
                </div>
                <div>
                  <span className="font-medium">District:</span>
                  <p className="text-gray-600">{lot.farm.district}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temperature & Humidity Chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader className="font-semibold">Temperature & Humidity Trends</CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="temp" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Temperature (°C)" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hum" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Humidity (%)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Event History */}
          <Card>
            <CardHeader className="font-semibold">Event History</CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                {lot.events.length === 0 ? (
                  <p className="text-gray-500">No events recorded yet</p>
                ) : (
                  <ul className="space-y-2">
                    {lot.events.map((event, i) => (
                      <li key={event.id || i} className="text-sm flex justify-between border-b pb-2">
                        <span>{new Date(event.at).toLocaleString()}</span>
                        <span className="font-medium">{event.type}</span>
                        <span>{event.place}</span>
                        <span>
                          {event.temp !== null && `${event.temp}°C`}
                          {event.hum !== null && ` / ${event.hum}%`}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Live Updates Feed */}
      {liveUpdates.length > 0 && (
        <Card>
          <CardHeader className="font-semibold">
            Live Sensor Updates 
            <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {liveUpdates.map((update, i) => (
                <li key={i} className="text-sm p-2 bg-green-50 rounded border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{update.lotPublicId}</span>
                    <span className="text-gray-500">{new Date(update.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-gray-600">
                    {update.farmName} - {update.produce} | Device: {update.deviceName}
                  </div>
                  <div className="font-medium">
                    Temp: {update.event.temp}°C
                    {update.event.hum && `, Humidity: ${update.event.hum}%`}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Test Commands */}
      <Card>
        <CardHeader className="font-semibold">Test IoT Integration</CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Use these curl commands to simulate sensor data:
          </p>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Using Demo Device API Key:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                curl -X POST http://localhost:8080/api/iot/ingest \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                &nbsp;&nbsp;-H "x-api-key: DEMO_IOT_KEY_123" \<br/>
                &nbsp;&nbsp;-d '{`{"lotPublicId":"DEMOLOT","temp":${Math.random() * 5 + 2},"hum":${Math.random() * 20 + 60},"location":"Greenhouse A"}`}'
              </code>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Using Master Key:</p>
              <code className="text-xs bg-gray-100 p-2 rounded block overflow-x-auto">
                curl -X POST http://localhost:8080/api/iot/ingest \<br/>
                &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                &nbsp;&nbsp;-H "x-api-key: MASTER_IOT_KEY_CHANGE_IN_PRODUCTION" \<br/>
                &nbsp;&nbsp;-d '{`{"lotPublicId":"DEMOLOT","temp":${Math.random() * 5 + 2},"hum":${Math.random() * 20 + 60},"location":"Cold Storage"}`}'
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
