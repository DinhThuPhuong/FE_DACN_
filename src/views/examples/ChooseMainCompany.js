import { useState, useEffect } from "react";
import { getAllMainCompanies, createBranchRequest, getProfile } from "../../components/API/apiService"; // Import API
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
    Button,
} from "reactstrap";
import Header from "components/Headers/Header";

const ChooseMainCompany = () => {
    const [companies, setCompanies] = useState([]); // Trạng thái lưu danh sách công ty
    const [loggedInCompanyId, setLoggedInCompanyId] = useState(null); // Trạng thái lưu id công ty đăng nhập
    const navigate = useNavigate();

    // Fetch danh sách công ty
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await getAllMainCompanies();
                setCompanies(data); // Lưu dữ liệu vào trạng thái
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        const fetchProfile = async () => {
            try {
                const profile = await getProfile(); // Lấy thông tin công ty đăng nhập
                setLoggedInCompanyId(profile.company.id); // Lưu id công ty đăng nhập
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchCompanies();
        fetchProfile();
    }, []);

    // Hàm xử lý khi người dùng nhấn "Yêu cầu"
    const handleRequest = async (mainCompanyId) => {
        if (!loggedInCompanyId) {
            alert("Không thể gửi yêu cầu: thông tin công ty đăng nhập không khả dụng.");
            return;
        }

        const branchRequest = {
            mainCompanyId, // Đổi tên thành mainCompanyId (công ty chính mà người dùng chọn)
            branchCompanyId: loggedInCompanyId, // Đổi tên thành branchCompanyId (công ty đăng nhập)
        };
        console.log("mainCompanyId:", mainCompanyId); // Log ID công ty chính
        console.log("branchCompanyId:", loggedInCompanyId); // Log ID công ty nhánh (công ty đăng nhập)

        try {
            await createBranchRequest(branchRequest);
            alert(`Yêu cầu cho công ty với ID ${mainCompanyId} đã được gửi thành công!`);
            navigate("/admin/icons"); // Chuyển hướng đến trang thành công
        } catch (error) {
            console.error("Error creating branch request:", error);
            alert(`Gửi yêu cầu thất bại cho công ty với ID ${mainCompanyId}.`);
        }
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                <h3 className="mb-0">Danh Sách Doanh Nghiệp</h3>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    {companies.length > 0 ? (
                                        companies.map((company) => (
                                            <Col lg="12" key={company.id} className="mb-4">
                                                <Card className="job-box" style={{ cursor: "pointer" }}>
                                                    <CardBody>
                                                        <Row>
                                                            {/* Logo */}
                                                            <Col md="2" className="d-flex align-items-center">
                                                                <img
                                                                    src={company.logoUrl}
                                                                    alt="Company Logo"
                                                                    className="img-fluid"
                                                                    style={{ maxHeight: "80px" }}
                                                                />
                                                            </Col>

                                                            {/* Thông tin công ty */}
                                                            <Col md="8">
                                                                <CardTitle tag="h2">
                                                                    <span style={{ fontWeight: "bold" }}>{company.name}</span>
                                                                </CardTitle>
                                                                <CardText tag="h4" className="mb-2">
                                                                    Ngành: {company.industries.join(", ")}
                                                                </CardText>
                                                                <CardText>{company.description}</CardText>
                                                                <CardText><strong>Quy mô công ty:</strong> {company.companySize}</CardText>
                                                                <CardText><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></CardText>
                                                            </Col>

                                                            {/* Nút Yêu cầu */}
                                                            <Col md="2" className="d-flex align-items-center justify-content-end">
                                                                <Button
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRequest(company.id); // Truyền mainCompanyId
                                                                    }}
                                                                >
                                                                    Yêu cầu
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        ))
                                    ) : (
                                        <Col>
                                            <CardBody>
                                                <CardText>Hiện tại không có doanh nghiệp nào.</CardText>
                                            </CardBody>
                                        </Col>
                                    )}
                                </Row>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default ChooseMainCompany;
