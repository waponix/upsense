import React from 'react';
import SEO from '../../../components/SEO';
import { getCompanies } from '../../../services/api';

const Dashboard = () => {
    const load = async () => {
        const companies = await getCompanies();

        console.log(companies);
    };

  return (
    <div>
      <SEO title="Home" />
      <button onClick={load}>Companies</button>
    </div>
  );
};
export default Dashboard;
