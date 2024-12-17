import { useState, useEffect } from "react";
import { getProfile, getJobPosting, deleteJobPosting } from "../../components/API/apiService";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  Container,
  Row,
  Col,
  CardHeader,
  Progress,
} from "reactstrap";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Header from "components/Headers/Header";

const Icons = () => {
  const [jobs, setJobs] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState({
    phoneVerified: false,
    companyVerified: false,
  });
  const navigate = useNavigate();

  // Fetch profile and authorization status
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setVerificationStatus({
          phoneVerified: profileData.company.phoneVerified,
          companyVerified: profileData.company.companyVerified,
        });
        setIsAuthorized(profileData.company.companyVerified && profileData.company.phoneVerified);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // Fetch job postings if authorized
  useEffect(() => {
    if (isAuthorized) {
      const fetchJobs = async () => {
        try {
          const jobData = await getJobPosting();
          setJobs(jobData);
        } catch (error) {
          console.error("Error fetching job data:", error);
        }
      };
      fetchJobs();
    }
  }, [isAuthorized]);

  // Handle job deletion
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài tuyển dụng này?")) {
      try {
        const success = await deleteJobPosting(id);
        if (success) {
          setJobs(jobs.filter((job) => job.id !== id));
          alert("Xóa bài tuyển dụng thành công!");
        } else {
          alert("Xóa bài tuyển dụng thất bại!");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Có lỗi xảy ra khi xóa bài tuyển dụng!");
      }
    }
  };

  const calculateProgress = () =>
    (Object.values(verificationStatus).filter(Boolean).length /
      Object.keys(verificationStatus).length) *
    100;

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            {!isAuthorized ? (
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h3 className="mb-0">Xin chào, Đinh Thu Phương</h3>
                  <p>Vui lòng thực hiện các bước xác thực dưới đây để bắt đầu đăng tin và nhận hồ sơ ứng tuyển cho tin tuyển dụng của bạn.</p>
                </CardHeader>
                <CardBody>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontWeight: "bold" }}>Xác Thực Thông Tin</span>
                    <span>Hoàn thành: {calculateProgress()}%</span>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <Progress value={calculateProgress()} color="success" style={{ height: "20px" }} />
                  </div>
                  <ul style={{ listStyleType: "none", padding: 0, marginTop: "20px" }}>
                    <li
                      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
                      onClick={() => navigate("/admin/verify-phone")}
                    >
                      <div
                        style={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          backgroundColor: verificationStatus.phoneVerified ? "green" : "gray",
                          marginRight: "10px",
                        }}
                      ></div>
                      Xác thực số điện thoại
                    </li>
                    <li
                      style={{ cursor: "pointer", display: "flex", alignItems: "center", marginTop: "10px" }}
                      onClick={() => navigate("/admin/verify-company")}
                    >
                      <div
                        style={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          backgroundColor: verificationStatus.companyVerified ? "green" : "gray",
                          marginRight: "10px",
                        }}
                      ></div>
                      Xác thực thông tin công ty
                    </li>
                  </ul>
                </CardBody>
              </Card>
            ) : (
              <Card className="shadow">
                <CardHeader className="bg-transparent">
                  <h3 className="mb-0">Danh Sách Bài Tuyển Dụng</h3>
                </CardHeader>
                <CardBody>
                  <Row>

                    {/* Button to create job posting */}
                    <button
                      className="btn btn-success mt-3 mb-4"  // Đổi từ btn-primary thành btn-success và thêm class mb-4 để có khoảng cách dưới
                      onClick={() => navigate("/admin/createJobPosting")}
                    >
                      Tạo Bài Tuyển Dụng
                    </button>

                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <Col lg="12" key={job.id} className="mb-4">
                          <Card
                            className="job-box"
                            style={{ cursor: "pointer" }}
                          >
                            <CardBody>
                              <Row>
                                {/* Logo */}
                                <Col md="2" className="d-flex align-items-center">
                                  <img
                                    src={job.logoUrl}
                                    alt="Company Logo"
                                    className="img-fluid"
                                    style={{ maxHeight: "80px" }}
                                  />
                                </Col>

                                {/* Job Information */}
                                <Col md="8">
                                  <CardTitle tag="h2">
                                    <span style={{ color: "red" }}>[{job.jobLevels.join("/")}]</span>{" "}
                                    <span style={{ fontWeight: "bold" }}>{job.jobTitle}</span>
                                  </CardTitle>
                                  <CardSubtitle tag="h4" className="mb-2">
                                    {job.companyName}
                                  </CardSubtitle>
                                  <CardText>
                                    <span style={{ color: "red" }}>{job.salaryRange}</span> •{" "}
                                    {job.jobLevels.join("/")}
                                  </CardText>
                                  <CardText>{job.location}</CardText>
                                  <div>
                                    {job.technologiesUsed.map((tech, index) => (
                                      <span
                                        key={index}
                                        style={{
                                          marginRight: "5px",
                                          padding: "3px 10px",
                                          backgroundColor: "#e7f3ff",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                  <CardText className="mt-2" style={{ color: "#777" }}>
                                    {job.postedDate}
                                  </CardText>
                                </Col>

                                {/* Icons for Edit, Delete, and View */}
                                <Col md="2" className="d-flex align-items-center justify-content-end">
                                  <FaEdit
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/edit-job/${job.id}`);
                                    }}
                                    style={{ cursor: "pointer", marginRight: "10px" }}
                                  />

                                  <FaTrash
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(job.id);
                                    }}
                                    style={{ cursor: "pointer", marginRight: "10px" }}
                                  />
                                  <FaEye
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/admin/job-detail/${job.id}`);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                </Col>
                              </Row>
                            </CardBody>

                          </Card>
                        </Col>
                      ))
                    ) : (
                      <Col>
                        <CardBody>
                          <CardText>Hiện tại không có bài tuyển dụng nào.</CardText>
                        </CardBody>
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Icons;
