
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-university-lightGray flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-university-blue mb-2">Department Evaluation Dashboard</h1>
              <p className="text-gray-600">Evaluating and monitoring performance across all university departments</p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link to="/centers">View All Centers</Link>
            </Button>
          </div>
          <Dashboard />
        </div>
      </main>
      <footer className="bg-university-blue text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Bahcesehir University - Department Evaluation System</p>
      </footer>
    </div>
  );
};

export default Index;
