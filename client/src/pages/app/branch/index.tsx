import React from 'react';
import DataTable from '../../../Layouts/dataTable';
import { Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { EvaIcon } from '@paljs/ui/Icon';

function BranchList() {
  return (
    <Row>
      <Card>
        <CardHeader>
          <EvaIcon name="grid-outline" /> Branch
        </CardHeader>
        <CardBody>
          <div className="branch-list">
            <DataTable />
          </div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default BranchList;
