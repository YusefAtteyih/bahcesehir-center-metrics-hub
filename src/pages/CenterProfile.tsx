
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { centers } from '@/data/centers';
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
  
  const center = useMemo(() => 
    centers.find(c => c.id === centerId), 
    [centerId]
  );

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

  // Calculate overall performance percentage
  const performanceValues = center.kpis.map(kpi => (kpi.value / kpi.target) * 100);
  const averagePerformance = performanceValues.reduce((sum, val) => sum + val, 0) / performanceValues.length;

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
                <Badge variant="outline" className="mb-2">{center.category || 'Research Center'}</Badge>
                <h1 className="text-3xl font-bold text-university-blue">{center.name}</h1>
                <p className="text-xl text-gray-600">{center.shortName}</p>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-sm text-gray-500 mb-1">Overall Performance</p>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${averagePerformance >= 75 ? 'bg-green-500' : averagePerformance >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <p className="font-bold">{averagePerformance.toFixed(0)}%</p>
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
              {center.foundedYear && (
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Founded {center.foundedYear}</span>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid grid-cols-4 w-full md:w-[600px]">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{center.description}</p>
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

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Focus Areas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {center.headlineKPIs.map((kpi, index) => (
                          <Badge key={index} variant="secondary" className="capitalize">{kpi}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Key personnel at {center.shortName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {center.contacts && center.contacts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {center.contacts.map((contact, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border rounded-md">
                            <Avatar>
                              {contact.photo ? (
                                <AvatarImage src={contact.photo} alt={contact.name} />
                              ) : (
                                <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{contact.name}</p>
                              <p className="text-sm text-gray-500">{contact.role}</p>
                              <p className="text-sm text-university-blue">{contact.email}</p>
                              {contact.phone && <p className="text-sm">{contact.phone}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="mx-auto h-12 w-12 opacity-30 mb-2" />
                        <p>No team information available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Research, events, and publications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {center.recentActivities && center.recentActivities.length > 0 ? (
                      <div className="space-y-4">
                        {center.recentActivities.map((activity, index) => (
                          <div key={index} className="border-l-4 border-university-blue pl-4 py-2">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 capitalize">{activity.type}</Badge>
                              {activity.date && <span className="text-sm text-gray-500">{activity.date}</span>}
                            </div>
                            <h3 className="font-medium mt-1">{activity.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
                        <p>No recent activities available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Achievements</CardTitle>
                    <CardDescription>Major milestones and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {center.keyAchievements && center.keyAchievements.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2">
                        {center.keyAchievements.map((achievement, index) => (
                          <li key={index} className="text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <ChartBar className="mx-auto h-12 w-12 opacity-30 mb-2" />
                        <p>No achievements information available</p>
                      </div>
                    )}
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
