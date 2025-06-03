
import React, { useState, useMemo } from 'react';
import OrganizationCard from '@/components/OrganizationCard';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { useOrganizations } from '@/hooks/useOrganizations';
import type { OrganizationType } from '@/types/organization';

const OrganizationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<OrganizationType | 'all'>('all');
  const { userRole } = useUser();
  
  const { data: organizations, isLoading, error } = useOrganizations(
    selectedType === 'all' ? undefined : selectedType
  );
  
  const filteredOrganizations = useMemo(() => {
    if (!organizations || !searchQuery.trim()) return organizations || [];
    
    const query = searchQuery.toLowerCase();
    return organizations.filter(org => 
      org.name.toLowerCase().includes(query) || 
      org.short_name.toLowerCase().includes(query) ||
      (org.description && org.description.toLowerCase().includes(query)) ||
      org.type.toLowerCase().includes(query)
    );
  }, [organizations, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading organizations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Error loading organizations. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">University Organizations</h1>
          <p className="text-gray-600">
            {userRole === 'evaluator' 
              ? 'Monitoring and evaluating performance across all organizations' 
              : 'Browse and explore university faculties, departments, and centers'}
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search organizations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Select value={selectedType} onValueChange={(value) => setSelectedType(value as OrganizationType | 'all')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="faculty">Faculties</SelectItem>
              <SelectItem value="department">Departments</SelectItem>
              <SelectItem value="center">Centers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrganizations.map(organization => (
          <OrganizationCard key={organization.id} organization={organization} />
        ))}
      </div>

      {filteredOrganizations.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchQuery || selectedType !== 'all' 
              ? 'No organizations found matching your criteria.' 
              : 'No organizations available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrganizationsPage;
