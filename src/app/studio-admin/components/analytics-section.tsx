"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock, 
  Star, 
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Palette,
  User
} from 'lucide-react';

// Mock data for analytics
const mockRevenueData = [
  { month: 'Jan', revenue: 8500 },
  { month: 'Feb', revenue: 9200 },
  { month: 'Mar', revenue: 10500 },
  { month: 'Apr', revenue: 9800 },
  { month: 'May', revenue: 11200 },
  { month: 'Jun', revenue: 12500 },
  { month: 'Jul', revenue: 13000 },
  { month: 'Aug', revenue: 12800 },
  { month: 'Sep', revenue: 13500 },
  { month: 'Oct', revenue: 14200 },
  { month: 'Nov', revenue: 15000 },
  { month: 'Dec', revenue: 16500 }
];

const mockAppointmentsData = [
  { month: 'Jan', count: 42 },
  { month: 'Feb', count: 48 },
  { month: 'Mar', count: 56 },
  { month: 'Apr', count: 52 },
  { month: 'May', count: 58 },
  { month: 'Jun', count: 64 },
  { month: 'Jul', count: 68 },
  { month: 'Aug', count: 65 },
  { month: 'Sep', count: 72 },
  { month: 'Oct', count: 76 },
  { month: 'Nov', count: 82 },
  { month: 'Dec', count: 88 }
];

const mockArtistPerformance = [
  { name: 'Akira Tanaka', appointments: 28, revenue: 8400, rating: 4.9 },
  { name: 'Sarah Chen', appointments: 22, revenue: 6600, rating: 4.8 },
  { name: 'Miguel Rodriguez', appointments: 18, revenue: 5400, rating: 4.7 },
  { name: 'Jade Kim', appointments: 14, revenue: 2800, rating: 4.5 },
  { name: 'David Wilson', appointments: 10, revenue: 5000, rating: 4.9 }
];

const mockPopularStyles = [
  { style: 'Japanese', count: 32, percentage: 25 },
  { style: 'Traditional', count: 28, percentage: 22 },
  { style: 'Neo-Traditional', count: 18, percentage: 14 },
  { style: 'Blackwork', count: 16, percentage: 12 },
  { style: 'Watercolor', count: 14, percentage: 11 },
  { style: 'Fine Line', count: 12, percentage: 9 },
  { style: 'Other', count: 9, percentage: 7 }
];

export default function AnalyticsSection() {
  const [timeframe, setTimeframe] = useState("year");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Calculate summary metrics
  const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalAppointments = mockAppointmentsData.reduce((sum, item) => sum + item.count, 0);
  const averageRating = mockArtistPerformance.reduce((sum, artist) => sum + artist.rating, 0) / mockArtistPerformance.length;
  
  // Calculate month-over-month changes
  const revenueChange = ((mockRevenueData[11].revenue - mockRevenueData[10].revenue) / mockRevenueData[10].revenue) * 100;
  const appointmentsChange = ((mockAppointmentsData[11].count - mockAppointmentsData[10].count) / mockAppointmentsData[10].count) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Revenue</CardDescription>
                <CardTitle className="text-3xl">${totalRevenue.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {revenueChange >= 0 ? (
                    <div className="flex items-center text-green-500">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      <span>{revenueChange.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      <span>{Math.abs(revenueChange).toFixed(1)}%</span>
                    </div>
                  )}
                  <span className="text-muted-foreground text-sm ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Appointments</CardDescription>
                <CardTitle className="text-3xl">{totalAppointments}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {appointmentsChange >= 0 ? (
                    <div className="flex items-center text-green-500">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      <span>{appointmentsChange.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      <span>{Math.abs(appointmentsChange).toFixed(1)}%</span>
                    </div>
                  )}
                  <span className="text-muted-foreground text-sm ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Average Rating</CardDescription>
                <CardTitle className="text-3xl">{averageRating.toFixed(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-sm ml-2">
                    based on {mockArtistPerformance.reduce((sum, artist) => sum + artist.appointments, 0)} sessions
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Avg. Session Value</CardDescription>
                <CardTitle className="text-3xl">
                  ${(totalRevenue / totalAppointments).toFixed(0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Avg. duration: 2.5 hours
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly revenue for the past year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end space-x-2">
                  {mockRevenueData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t-sm" 
                        style={{ 
                          height: `${(item.revenue / Math.max(...mockRevenueData.map(d => d.revenue))) * 200}px` 
                        }}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-2">{item.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Popular Styles</CardTitle>
                <CardDescription>
                  Distribution of tattoo styles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPopularStyles.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <Palette className="h-4 w-4 mr-2 text-primary" />
                          <span>{item.style}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.count} appointments</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="artists" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Artist Performance</CardTitle>
              <CardDescription>
                Comparison of artist metrics for the current period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Artist</th>
                      <th className="text-right py-3 px-4">Appointments</th>
                      <th className="text-right py-3 px-4">Revenue</th>
                      <th className="text-right py-3 px-4">Avg. Session Value</th>
                      <th className="text-right py-3 px-4">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockArtistPerformance.map((artist, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {artist.name}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">{artist.appointments}</td>
                        <td className="text-right py-3 px-4">${artist.revenue.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          ${(artist.revenue / artist.appointments).toFixed(0)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end">
                            <span className="mr-2">{artist.rating.toFixed(1)}</span>
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>
                  Detailed revenue analysis for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end space-x-2">
                  {mockRevenueData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t-sm" 
                        style={{ 
                          height: `${(item.revenue / Math.max(...mockRevenueData.map(d => d.revenue))) * 200}px` 
                        }}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-2">{item.month}</div>
                      <div className="text-xs font-medium">${item.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="w-full flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Monthly</p>
                    <p className="text-2xl font-bold">
                      ${(totalRevenue / mockRevenueData.length).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Highest Month</p>
                    <p className="text-2xl font-bold">
                      ${Math.max(...mockRevenueData.map(d => d.revenue)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="appointments" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>
                  Monthly appointment volume for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-end space-x-2">
                  {mockAppointmentsData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-primary rounded-t-sm" 
                        style={{ 
                          height: `${(item.count / Math.max(...mockAppointmentsData.map(d => d.count))) * 200}px` 
                        }}
                      ></div>
                      <div className="text-xs text-muted-foreground mt-2">{item.month}</div>
                      <div className="text-xs font-medium">{item.count}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="w-full flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                    <p className="text-2xl font-bold">{totalAppointments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Monthly</p>
                    <p className="text-2xl font-bold">
                      {(totalAppointments / mockAppointmentsData.length).toFixed(0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-2xl font-bold">98%</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
