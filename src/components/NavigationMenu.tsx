
import React from 'react';
import { Link } from 'react-router-dom';

export const NavigationMenu: React.FC = () => {
  return (
    <div className="flex flex-col space-y-4 pt-4">
      <h2 className="text-lg font-bold mb-2 text-university-blue">Menu</h2>
      <Link to="/" className="text-university-blue hover:text-university-orange transition-colors">Dashboard</Link>
      <Link to="/centers" className="text-university-blue hover:text-university-orange transition-colors">Centers</Link>
      <Link to="#" className="text-university-blue hover:text-university-orange transition-colors">Reports</Link>
      <Link to="#" className="text-university-blue hover:text-university-orange transition-colors">Settings</Link>
    </div>
  );
};
