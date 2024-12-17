import { useState, useEffect } from "react";
import { getAllBranchRequests, createBranchRequest, getProfile } from "../../components/API/apiService"; // Import API
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

const ConfirmInfo = () => {
    const [branchRequests, setBranchRequests] = useState([]); // Trạng thái lưu danh sách yêu cầu công ty con
    const [loggedInCompanyId, setLoggedInCompanyId] = useState(null); // Trạng thái lưu id công ty đăng nhập
    const navigate = useNavigate();

    // Fetch thông tin công ty đăng nhập và danh sách yêu cầu xác thực của công ty con
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile(); // Lấy thông tin công ty đăng nhập
                setLoggedInCompanyId(profile.company.id); // Lưu id công ty đăng nhập
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        const fetchBranchRequests = async () => {
            try {
                if (loggedInCompanyId) {
                    const data = await getAllBranchRequests(loggedInCompanyId); // Truy vấn yêu cầu công ty con
                    setBranchRequests(data); // Lưu dữ liệu vào trạng thái
                    console.log(data);
                }
            } catch (error) {
                console.error("Error fetching branch requests:", error);
            }
        };

        fetchProfile();
        fetchBranchRequests();
    }, [loggedInCompanyId]); // Fetch dữ liệu khi loggedInCompanyId thay đổi

    // Hàm xử lý khi người dùng nhấn "Yêu cầu"
    const handleRequest = async (branchCompanyId) => {
        if (!loggedInCompanyId) {
            alert("Không thể gửi yêu cầu: thông tin công ty đăng nhập không khả dụng.");
            return;
        }

        const branchRequest = {
            mainCompanyId: loggedInCompanyId, // Đổi tên loggedInCompanyId thành mainCompanyId
            branchCompanyId, // Đổi tên selectedCompanyId thành branchCompanyId
        };
        console.log("mainCompanyId:", loggedInCompanyId); // Log ID công ty chính
        console.log("branchCompanyId:", branchCompanyId); // Log ID công ty nhánh

        try {
            await createBranchRequest(branchRequest);
            alert(`Yêu cầu cho công ty với ID ${branchCompanyId} đã được gửi thành công!`);
        } catch (error) {
            console.error("Error creating branch request:", error);
            alert(`Gửi yêu cầu thất bại cho công ty với ID ${branchCompanyId}.`);
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
                                <h3 className="mb-0">Danh Sách Yêu Cầu Từ Công Ty Con</h3>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    {branchRequests.length > 0 ? (
                                        branchRequests.map((request) => (
                                            <Col lg="12" key={request.id} className="mb-4">
                                                <Card className="job-box" style={{ cursor: "pointer" }}>
                                                    <CardBody>
                                                        <Row>
                                                            {/* Logo công ty con */}
                                                            <Col md="2" className="d-flex align-items-center">
                                                                <img
                                                                    src={request.branchCompany.logoUrl}
                                                                    alt="Branch Company Logo"
                                                                    className="img-fluid"
                                                                    style={{ maxHeight: "80px" }}
                                                                />
                                                            </Col>

                                                            {/* Thông tin công ty con */}
                                                            <Col md="8">
                                                                <CardTitle tag="h2">
                                                                    <span style={{ fontWeight: "bold" }}>
                                                                        {request.branchCompany.name}
                                                                    </span>
                                                                </CardTitle>
                                                                <CardText className="mb-2">
                                                                    Ngành :
                                                                    {request.branchCompany.industries &&
                                                                        Array.isArray(request.branchCompany.industries) &&
                                                                        request.branchCompany.industries.length > 0
                                                                        ? request.branchCompany.industries.join(", ")
                                                                        : "Chưa có thông tin ngành nghề"}
                                                                </CardText>
                                                                <CardText>
                                                                    <strong>Email:</strong> {request.branchCompany.email}
                                                                </CardText>
                                                                <CardText>
                                                                    <strong>Website:</strong>{" "}
                                                                    <a
                                                                        href={request.branchCompany.website}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                    >
                                                                        {request.branchCompany.website}
                                                                    </a>
                                                                </CardText>
                                                                <CardText>
                                                                    {request.branchCompany.description}
                                                                </CardText>
                                                                <CardText>
                                                                    <strong>Trạng thái yêu cầu:</strong> {request.requestStatus}
                                                                </CardText>

                                                                <CardText>
                                                                    <strong>Ngày gửi yêu cầu:</strong>{" "}
                                                                    {new Date(request.requestDate).toLocaleString()}
                                                                </CardText>

                                                            </Col>

                                                            {/* Nút Yêu cầu */}
                                                            <Col md="2" className="d-flex align-items-center justify-content-end">
                                                                <Button
                                                                    color="primary"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleRequest(request.branchCompany.id); // Truyền branchCompanyId
                                                                    }}
                                                                    disabled={
                                                                        request.requestStatus === "Đã phê duyệt" ||
                                                                        request.requestStatus === "Đang chờ"
                                                                    }
                                                                >
                                                                    {request.requestStatus === "Đã phê duyệt"
                                                                        ? "Đã phê duyệt"
                                                                        : request.requestStatus === "Đang chờ"
                                                                            ? "Đang chờ"
                                                                            : "Yêu cầu"}
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
                                                <CardText>Hiện tại không có yêu cầu nào từ công ty con.</CardText>
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

export default ConfirmInfo;
