import React from 'react';
// import DataTable from '../../../Layouts/dataTable';
import { Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { EvaIcon } from '@paljs/ui/Icon';

function ZoneList() {
  return (
    <Row>
      <Card>
        <CardHeader>
          <EvaIcon name="pin-outline" /> Zone
        </CardHeader>
        <CardBody>
          <div className="zone-list">{/*<DataTable/>*/}</div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default ZoneList;
