import React from 'react';
import { Row } from 'react-bootstrap';
import { Card, CardBody, CardHeader } from '@paljs/ui';
import { EvaIcon } from '@paljs/ui/Icon';

function Options() {
  return (
    <Row>
      <Card>
        <CardHeader>
          <EvaIcon name="options-2-outline" /> Settings
        </CardHeader>
        <CardBody>
          <div className="options"></div>
        </CardBody>
      </Card>
    </Row>
  );
}

export default Options;
