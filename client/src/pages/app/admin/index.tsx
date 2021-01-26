import React from 'react';
import DataTable from '../../../Layouts/dataTable';
import { Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { EvaIcon } from '@paljs/ui/Icon';

function AdminList() {
  return (
    <Row>
      <Card>
        <CardHeader>
          <EvaIcon name="people-outline" /> Admin
        </CardHeader>
        <CardBody>
          <div className="admin-list">
            <DataTable />
          </div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default AdminList;
