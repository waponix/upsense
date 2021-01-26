import React from 'react';
import DataTable from '../../../Layouts/dataTable';
import { Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { EvaIcon } from '@paljs/ui/Icon';

function HubsList() {
  return (
    <Row>
      <Card>
        <CardHeader>
          <EvaIcon name="radio-outline" /> Hubs
        </CardHeader>
        <CardBody>
          <div className="hubs-list">
            <DataTable />
          </div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default HubsList;
