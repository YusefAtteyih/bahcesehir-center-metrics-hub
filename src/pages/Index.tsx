
import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-university-lightGray flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
      <footer className="bg-university-blue text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Bahcesehir University - Center Performance System</p>
      </footer>
    </div>
  );
};

export default Index;
