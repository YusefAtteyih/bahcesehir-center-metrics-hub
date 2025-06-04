import React, { useState, useMemo } from 'react';
import OrganizationCard from '@/components/OrganizationCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useDepartments, useFaculties } from '@/hooks/useSupabaseData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const DepartmentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const { userRole } = useUser();
  const { data: faculties = [] } = useFaculties();
  const { data: departments, isLoading, error } = useDepartments(
    selectedFaculty === 'all' ? undefined : selectedFaculty
  );

  const filteredDepartments = useMemo(() => {
    if (!departments || !searchQuery.trim()) return departments || [];
    const query = searchQuery.toLowerCase();
    return departments.filter((department) =>
      department.name.toLowerCase().includes(query) ||
      department.short_name.toLowerCase().includes(query) ||
      (department.description && department.description.toLowerCase().includes(query))
    );
  }, [departments, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Error loading departments. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">University Departments</h1>
          <p className="text-gray-600">
            {userRole === 'evaluator'
              ? 'Monitoring and evaluating performance across all departments'
              : 'Browse and compare with other university departments'}
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Select
            value={selectedFaculty}
            onValueChange={setSelectedFaculty}
          >
            <SelectTrigger className="sm:w-48 w-full">
              <SelectValue placeholder="Filter by faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              {faculties.map((fac) => (
                <SelectItem key={fac.id} value={fac.id}>
                  {fac.short_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDepartments.map((department) => (
          <OrganizationCard key={department.id} organization={department} />
        ))}
      </div>

      {filteredDepartments.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchQuery ? 'No departments found matching your search criteria.' : 'No departments available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
