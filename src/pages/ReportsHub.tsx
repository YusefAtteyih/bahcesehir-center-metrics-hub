
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ListFilter } from 'lucide-react';

const ReportsHub: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-university-blue">Reports Hub</h1>
        <p className="text-gray-600 mt-1">Review and manage all center reports</p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Center Reports</CardTitle>
              <CardDescription>All submitted reports from centers</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ListFilter size={16} />
              <span>Filter Reports</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-6">
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="all">All Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { center: "BAUBUS", type: "Quarterly", date: "May 15, 2025" },
                    { center: "BAUGRAL", type: "Monthly", date: "May 18, 2025" },
                    { center: "BAUDEC", type: "KPI Update", date: "May 20, 2025" },
                    { center: "BAUARA", type: "Quarterly", date: "May 21, 2025" },
                    { center: "BAUDEV", type: "Annual", date: "May 19, 2025" }
                  ].map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.center}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="reviewed">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center</TableHead>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Reviewed On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { center: "BAUID", type: "Monthly", date: "May 10, 2025", status: "Approved" },
                    { center: "BAUCOM", type: "Quarterly", date: "May 8, 2025", status: "Approved" },
                    { center: "BAUDH", type: "KPI Update", date: "May 5, 2025", status: "Needs Revision" }
                  ].map((report, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{report.center}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={report.status === "Approved" 
                            ? "bg-green-50 text-green-700 hover:bg-green-50" 
                            : "bg-red-50 text-red-700 hover:bg-red-50"}
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="all">
              <div className="text-center py-12 text-gray-500">
                All reports will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsHub;
