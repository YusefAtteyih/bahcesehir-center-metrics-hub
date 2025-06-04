
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useOrganizations } from '@/hooks/useOrganizations';
import KpiTable from '@/components/KpiTable';
import { ChartBar, CalendarIcon, GlobeIcon, MapPin, Users, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const CenterProfilePage: React.FC = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const { data: centers, isLoading } = useOrganizations('center');
  
  const center = useMemo(() => 
    centers?.find(c => c.id === centerId), 
    [centers, centerId]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-university-lightGray flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading center information...</p>
        </main>
        <footer className="bg-university-blue text-white p-4 text-center">
          <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
        </footer>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="min-h-screen bg-university-lightGray flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 text-center">
          <h1 className="text-3xl font-bold text-university-blue mb-4">Center Not Found</h1>
          <p className="mb-6">The center you are looking for does not exist.</p>
          <Button asChild>
            <Link to="/centers">Back to Centers</Link>
          </Button>
        </main>
        <footer className="bg-university-blue text-white p-4 text-center">
          <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-university-lightGray flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button variant="outline" asChild size="sm">
              <Link to="/centers">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Centers
              </Link>
            </Button>
            <Button variant="outline" asChild size="sm">
              <Link to={`/centers/${center.id}`}>
                <ChartBar className="mr-2 h-4 w-4" />
                Performance Data
              </Link>
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <Badge variant="outline" className="mb-2">Research Center</Badge>
                <h1 className="text-3xl font-bold text-university-blue">{center.name}</h1>
                <p className="text-xl text-gray-600">{center.short_name}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                  <p className="font-bold">Active</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
              {center.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{center.location}</span>
                </div>
              )}
              {center.website && (
                <div className="flex items-center">
                  <GlobeIcon className="h-4 w-4 mr-1" />
                  <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-university-blue hover:underline">{center.website}</a>
                </div>
              )}
              {center.founded_year && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Founded {center.founded_year}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-2 w-full md:w-[400px]">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{center.description || 'No description available.'}</p>
                    </CardContent>
                  </Card>
                  
                  {center.mission && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Mission</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{center.mission}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {center.vision && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Vision</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{center.vision}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Performance Indicators</CardTitle>
                    <CardDescription>Performance metrics for {center.short_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <ChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="font-medium mb-2">No KPI Data Available</p>
                      <p className="text-sm mb-4">KPI information will be displayed here once configured.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="bg-university-blue text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
      </footer>
    </div>
  );
};

export default CenterProfilePage;
