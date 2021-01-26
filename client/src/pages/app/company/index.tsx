import { Accordion, AccordionItem, AccordionRefObject } from '@paljs/ui/Accordion';
import { Button } from '@paljs/ui/Button';
import { Card, CardBody } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';
import { List, ListItem } from '@paljs/ui/List';
import React, { useRef, useState } from 'react';
import SEO from '../../../components/SEO';
import { getCompanies } from '../../../services/api';

const Dashboard = () => {
  const accordionRef = useRef<AccordionRefObject>(null);
  const style = { marginBottom: '1.5rem' };

  let [companies, setCompanies] = useState([]);

  const loadCompanies = async () => {
    setCompanies(await getCompanies());
  };

  const CompanyList = () => {
    const record = companies.map((company) => {
      return (
        <tr>
          <td>{company.name}</td>
          <td>{company.createdAt}</td>
        </tr>
      );
    });

    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Created at</th>
          </tr>
        </thead>
        <tbody>{record}</tbody>
      </table>
    );
  };

  return (
    <>
      <SEO title="Dashboard" />
      <Row>
        <Col breakPoint={{ xs: 12, lg: 6 }}>
          <Card>
            <header>Companies</header>
            <CardBody>
              <Row>
                <Col breakPoint={{ xs: 12, lg: 12 }}>
                  <Button onClick={loadCompanies}>Load</Button>
                  <CompanyList />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Dashboard;
