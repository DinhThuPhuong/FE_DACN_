import React, { useState, useEffect } from "react";
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Container, Row, Col } from "reactstrap";
import { getProfile } from "components/API/apiService.js"; // Import hàm từ apiService.js
import UserHeader from "components/Headers/UserHeader.js";

const Profile = () => {
  const [profileData, setProfileData] = useState({
    companyName: "",
    addresses: [],
    website: "",
    email: "",
    phoneNumber: "",
    description: "",
    city: "",
    country: "",
    jobTitle: "",
    university: "",
    skills: [],
    industries: [],
    compensationBenefits: [],
    logoUrl: "",
    mediaPath: "",
    headquarters: "",
    numberOfBranches: 0,
    compensationBenefits: [],
    avatar: "",
  });

  // Sử dụng useEffect để lấy dữ liệu từ API khi component được render
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(); // Sử dụng hàm getProfile từ apiService.js
        // Cập nhật thông tin profile
        setProfileData({
          companyName: data.company.name || "",
          website: data.company.website || "",
          email: data.company.email || "",
          addresses: data.company.addresses || [],
          phoneNumber: data.company.phoneNumber || "",
          description: data.company.description || "",
          city: data.company.headquarters?.split(",")[0] || "",
          country: data.company.headquarters?.split(",")[1] || "",
          // jobTitle: "", // Bạn có thể bổ sung trường này nếu cần
          // university: "", // Bạn có thể bổ sung trường này nếu cần
          skills: data.company.skills || [],
          industries: data.company.industries || [],
          compensationBenefits: data.company.compensationBenefits || [],
          logoUrl: data.company.logoUrl || "",
          mediaPath: data.company.mediaPath || "",
          avatar: data.company.avatar?.url || "", // Chắc chắn rằng avatar có URL
          headquarters: data.company.headquarters || "",
          numberOfBranches: data.company.numberOfBranches || 0,
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []); // Chạy một lần khi component được render lần đầu

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={profileData.avatar || require("../../assets/img/theme/team-4-800x800.jpg")} // Thêm ảnh đại diện nếu có
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">{profileData.numberOfBranches}</span>
                        <span className="description">Branches</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>{profileData.companyName}</h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    {profileData.city}, {profileData.country}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    {profileData.jobTitle}
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    {profileData.university}
                  </div>
                  <hr className="my-4" />
                  <p>{profileData.description}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My account</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      Settings
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">User information</h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-company-name">
                            Company Name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.companyName || ""}
                            id="input-company-name"
                            placeholder="Company Name"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-email">
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.email || ""}
                            id="input-email"
                            placeholder="Email"
                            type="email"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-phone">
                            Phone Number
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.phoneNumber || ""}
                            id="input-phone"
                            placeholder="Phone Number"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="input-website">
                            Website
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.website || ""}
                            id="input-website"
                            placeholder="Website"
                            type="text"
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">Description</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>Description</label>
                      <Input
                        className="form-control-alternative"
                        value={profileData.description || ""}
                        rows="4"
                        type="textarea"
                        readOnly
                      />
                    </FormGroup>
                  </div>

                  {/* Skills */}
                  <h6 className="heading-small text-muted mb-4">Skills</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <ul>
                        {profileData.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    </FormGroup>
                  </div>

                  {/* Industries */}
                  <h6 className="heading-small text-muted mb-4">Industries</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <ul>
                        {profileData.industries.map((industry, index) => (
                          <li key={index}>{industry}</li>
                        ))}
                      </ul>
                    </FormGroup>
                  </div>

                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">Address</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <ul>
                        {profileData.addresses.map((address, index) => (
                          <li key={index}>{address}</li>
                        ))}
                      </ul>
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
