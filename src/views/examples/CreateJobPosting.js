import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
    Container,
    Row,
    Col,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import { addJobPosting, getProfile } from "../../components/API/apiService.js";

const jobLevels = [
    "Junior",
    "Mid-level",
    "Senior",
    "Manager",
    "Lead"
];

// const jobTypes = [
//     "Full-time",
//     "Part-time",
//     "Internship"
// ];

const experienceRq = [
    "Chưa có kinh nghiệm",
    "1 năm kinh nghiệm",
    "2 năm kinh nghiệm",
    "3 năm kinh nghiệm",
    "4 năm kinh nghiệm",
    "5 năm kinh nghiệm",
    "Trên 5 năm kinh nghiệm"
];

const CreateJobPosting = () => {
    const [formData, setFormData] = useState({
        jobTitle: "",
        salaryRange: "",
        location: "",
        expiryDate: "",
        numberOfVacancies: "",
        benefits: "",
        responsibilities: "",
        specializedSkills: "",
        jobLevels: [],
        technologiesUsed: [],
        jobType: "Full-time",
        experienceRequired: "",

        additionalNotes: "",
    });
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const navigate = useNavigate();  // Khởi tạo useNavigate

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            if (checked) {
                setFormData({ ...formData, [name]: [...formData[name], value] });
            } else {
                setFormData({
                    ...formData,
                    [name]: formData[name].filter(item => item !== value)
                });
            }
        } else if (type === "select-multiple") {
            // Nếu là trường select với multiple
            setFormData({ ...formData, [name]: Array.from(e.target.selectedOptions, option => option.value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                setLocations(profile.company.addresses);
            } catch (error) {
                setErrorMessage('Không thể tải danh sách địa điểm. Vui lòng thử lại.');
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const formattedExpiryDate = new Date(formData.expiryDate).toISOString();

        const formDataToSend = {
            ...formData,
            expiryDate: formattedExpiryDate,
        };

        try {
            const response = await addJobPosting(formDataToSend);
            if (response) {
                setLoading(false);
                setSuccessMessage('Bài tuyển dụng đã được đăng thành công!');
                navigate('/admin/icons');
            } else {
                setLoading(false);
                setErrorMessage('Có lỗi xảy ra khi đăng bài tuyển dụng. Vui lòng thử lại sau!');
            }
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setErrorMessage(`Lỗi: ${error.response.data.message || "Có lỗi xảy ra"}`);
            } else {
                setErrorMessage('Có lỗi xảy ra khi đăng bài tuyển dụng. Vui lòng thử lại sau!');
            }
        }
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row className="justify-content-center">
                    <Col lg="10">
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <h3 className="mb-0">Form Đăng Tuyển Dụng</h3>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={handleSubmit}>
                                    <h6 className="heading-small text-muted mb-4">Thông tin công việc</h6>
                                    <div className="pl-lg-4">
                                        <Row>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="jobTitle">
                                                        Tiêu đề công việc
                                                    </label>
                                                    <Input
                                                        id="jobTitle"
                                                        name="jobTitle"
                                                        placeholder="Nhập tiêu đề công việc"
                                                        type="text"
                                                        value={formData.jobTitle}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col lg="6">
                                                <FormGroup>
                                                    <label className="form-control-label" htmlFor="salaryRange">
                                                        Mức lương
                                                    </label>
                                                    <Input
                                                        id="salaryRange"
                                                        name="salaryRange"
                                                        placeholder="Nhập mức lương"
                                                        type="text"
                                                        value={formData.salaryRange}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        {/* Địa điểm */}
                                        <Col lg="6">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="location">
                                                    Địa điểm
                                                </label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    type="select"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {locations.map((location, index) => (
                                                        <option key={index} value={location}>
                                                            {location}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                        {/* Ngày hết hạn */}
                                        <Col lg="6">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="expiryDate">
                                                    Ngày hết hạn
                                                </label>
                                                <Input
                                                    id="expiryDate"
                                                    name="expiryDate"
                                                    type="date"
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        {/* Cấp độ công việc */}
                                        <Col lg="6">
                                            <FormGroup>
                                                <label className="form-control-label">Cấp độ công việc</label>
                                                <div>
                                                    {jobLevels.map((level, index) => (
                                                        <FormGroup check key={index}>
                                                            <Input
                                                                id={`jobLevels-${index}`}
                                                                name="jobLevels"
                                                                type="checkbox"
                                                                value={level}
                                                                checked={formData.jobLevels.includes(level)}
                                                                onChange={handleChange}
                                                            />
                                                            <label htmlFor={`jobLevels-${index}`}>{level}</label>
                                                        </FormGroup>
                                                    ))}
                                                </div>
                                            </FormGroup>
                                        </Col>

                                        {/* Công nghệ sử dụng */}
                                        <Col lg="6">
                                            <FormGroup>
                                                <label className="form-control-label">Công nghệ sử dụng</label>
                                                <Input
                                                    id="technologiesUsed"
                                                    name="technologiesUsed"
                                                    type="select"
                                                    multiple
                                                    value={formData.technologiesUsed}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {["Java", "Spring Boot", "Docker", "Kubernetes"].map((tech, index) => (
                                                        <option key={index} value={tech}>
                                                            {tech}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                        {/* Số lượng vị trí */}
                                        <Col lg="6">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="numberOfVacancies">
                                                    Số lượng vị trí
                                                </label>
                                                <Input
                                                    id="numberOfVacancies"
                                                    name="numberOfVacancies"
                                                    placeholder="Nhập số lượng vị trí"
                                                    type="number"
                                                    value={formData.numberOfVacancies}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </FormGroup>
                                        </Col>

                                        {/* Yêu cầu kinh nghiệm */}
                                        <Col lg="6">
                                            <FormGroup>
                                                <label className="form-control-label">Kinh nghiệm yêu cầu</label>
                                                <Input
                                                    id="experienceRequired"
                                                    name="experienceRequired"
                                                    type="select"
                                                    value={formData.experienceRequired}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    {experienceRq.map((experience, index) => (
                                                        <option key={index} value={experience}>
                                                            {experience}
                                                        </option>
                                                    ))}
                                                </Input>
                                            </FormGroup>
                                        </Col>

                                        {/* Các trường bổ sung khác */}
                                        <Col lg="12">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="responsibilities">
                                                    Trách nhiệm công việc
                                                </label>
                                                <Input
                                                    id="responsibilities"
                                                    name="responsibilities"
                                                    placeholder="Nhập trách nhiệm công việc"
                                                    type="textarea"
                                                    value={formData.responsibilities}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col lg="12">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="benefits">
                                                    Phúc lợi
                                                </label>
                                                <Input
                                                    id="benefits"
                                                    name="benefits"
                                                    placeholder="Nhập phúc lợi"
                                                    type="textarea"
                                                    value={formData.benefits}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        <Col lg="12">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="specializedSkills">
                                                    Kỹ năng chuyên môn
                                                </label>
                                                <Input
                                                    id="specializedSkills"
                                                    name="specializedSkills"
                                                    placeholder="Nhập kỹ năng chuyên môn"
                                                    type="textarea"
                                                    value={formData.specializedSkills}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>

                                        {/* Ghi chú thêm */}
                                        <Col lg="12">
                                            <FormGroup>
                                                <label className="form-control-label" htmlFor="additionalNotes">
                                                    Ghi chú thêm
                                                </label>
                                                <Input
                                                    id="additionalNotes"
                                                    name="additionalNotes"
                                                    placeholder="Nhập ghi chú thêm"
                                                    type="textarea"
                                                    value={formData.additionalNotes}
                                                    onChange={handleChange}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </div>

                                    <div className="text-center">
                                        <Button className="mt-4" color="primary" type="submit" disabled={loading}>
                                            {loading ? 'Đang đăng...' : 'Đăng Tuyển'}
                                        </Button>
                                    </div>
                                </Form>

                                {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
                                {errorMessage && <div className="alert alert-danger mt-4">{errorMessage}</div>}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CreateJobPosting;
