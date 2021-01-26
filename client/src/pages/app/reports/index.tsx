import React from 'react';
import DataTable from '../../../Layouts/dataTable';
import { Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { EvaIcon } from '@paljs/ui/Icon';

function Reports() {
  return (
    <Row>
      <Card>
        <CardHeader>
          <EvaIcon name="layers-outline" /> Reports
        </CardHeader>
        <CardBody>
          <div className="reports">{/*<DataTable/>*/}</div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default Reports;
