
import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { centers } from '@/data/centers';
import CenterCard from '@/components/CenterCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const CentersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredCenters = useMemo(() => {
    if (!searchQuery.trim()) return centers;
    
    const query = searchQuery.toLowerCase();
    return centers.filter(center => 
      center.name.toLowerCase().includes(query) || 
      center.shortName.toLowerCase().includes(query) ||
      center.description.toLowerCase().includes(query) ||
      center.headlineKPIs.some(kpi => kpi.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-university-lightGray flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-university-blue mb-2">University Centers</h1>
            <p className="text-gray-600">Monitoring and evaluating performance across all centers</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-64 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search centers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map(center => (
            <CenterCard key={center.id} center={center} />
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No centers found matching your search criteria.</p>
          </div>
        )}
      </main>
      <footer className="bg-university-blue text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
      </footer>
    </div>
  );
};

export default CentersPage;
