import React, { Component } from 'react';
import SEO from '../../components/SEO';
import Loadable from '@loadable/component';
import Row from '@paljs/ui/Row';
import Col from '@paljs/ui/Col';

class Dashboard extends Component {
  constructor(props: {} | Readonly<{}>) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'temp-timeseries',
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        },
      },
      series: [
        {
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
      ],
    };
  }

  render() {
    return (
      <div>
        <SEO title="Dashboard" />
        <Row>
          <Col breakPoint={{ xs: 12, md: 6 }}>
            <div className="mixed-chart">
              <LoadableChart options={this.state.options} series={this.state.series} type="line" width="500" />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
const LoadableChart = Loadable(() => import('react-apexcharts/src/react-apexcharts'));
