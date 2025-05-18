
import React from 'react';

export const NavigationMenu: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 pt-4">
      <h2 className="text-lg font-bold mb-2 text-university-blue">Menu</h2>
      <a href="#" className="text-university-blue hover:text-university-orange transition-colors">Dashboard</a>
      <a href="#" className="text-university-blue hover:text-university-orange transition-colors">Departments</a>
      <a href="#" className="text-university-blue hover:text-university-orange transition-colors">Reports</a>
      <a href="#" className="text-university-blue hover:text-university-orange transition-colors">Settings</a>
    </div>
  );
};
