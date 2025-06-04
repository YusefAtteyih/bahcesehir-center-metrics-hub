
import React, { useState, useMemo } from 'react';
import CenterCard from '@/components/CenterCard';
import { Input } from '@/components/ui/input';
import { Search, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';
import { useCenters } from '@/hooks/useSupabaseData';

const CentersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { userRole } = useUser();
  const { data: centers, isLoading, error } = useCenters();
  
  const filteredCenters = useMemo(() => {
    if (!centers || !searchQuery.trim()) return centers || [];
    
    const query = searchQuery.toLowerCase();
    return centers.filter(center => 
      center.name.toLowerCase().includes(query) || 
      center.short_name.toLowerCase().includes(query) ||
      (center.description && center.description.toLowerCase().includes(query))
    );
  }, [centers, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-university-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading centers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Error loading centers. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-university-blue">University Centers</h1>
          <p className="text-gray-600">
            {userRole === 'evaluator' 
              ? 'Monitoring and evaluating performance across all centers' 
              : 'Browse and compare with other university centers'}
          </p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search centers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter size={16} />
            <span>Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map(center => (
          <CenterCard key={center.id} center={center} />
        ))}
      </div>

      {filteredCenters.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            {searchQuery ? 'No centers found matching your search criteria.' : 'No centers available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default CentersPage;
