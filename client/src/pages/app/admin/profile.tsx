import React from 'react';
import SEO from '../../../components/SEO';
import Col from '@paljs/ui/Col';
import { Card, CardBody } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import { graphql } from 'gatsby';

// export const query = graphql`
//     query AdminProfile {
//         mdx(title: { eq: "Using a Theme" }) {
//             id
//             title
//         }
//     }
// `
const Profile = ({ data }) => {
  return (
    <div>
      <SEO title="Profile" />
      <Row>
        <Col breakPoint={{ xs: 12, md: 6 }}>
          <Card>
            <header>Profile</header>
            <CardBody>{data.site.siteMetadata.description}</CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>I will not close if you click outside me. Don't even try to press escape key.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export const query = graphql`
  query ProfilePageQuery {
    site {
      siteMetadata {
        description
      }
    }
  }
`;
export default Profile;
