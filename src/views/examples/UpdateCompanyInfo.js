import { useState, useEffect } from 'react';
import Header from "components/Headers/Header";
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import { getProfile, getCompanyById, updateCompanyInfo } from '../../components/API/apiService'; // Đảm bảo đường dẫn đúng

const UpdateCompanyInfo = () => {
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        email: '',
        phoneNumber: '',
        companySize: '',
        foundedYear: '',
        description: '',
        headquarters: '',
        logoUrl: '',
        addresses: '',
        skills: '',
        industries: '',
        compensationBenefits: '',
    });

    const [addressesList, setAddressesList] = useState([]);
    const [skillsList, setSkillsList] = useState([]);
    const [industriesList, setIndustriesList] = useState([]);
    const [compensationList, setCompensationList] = useState([]);
    const [logoFile, setLogoFile] = useState(null); // Dùng để lưu logo đã chọn

    // Hàm để lấy thông tin người dùng và công ty từ API
    const fetchUserProfile = async () => {
        try {
            const profileData = await getProfile(); // Lấy dữ liệu hồ sơ người dùng
            const companyId = profileData.company.id; // Giả sử bạn có trường companyId trong response

            if (companyId) {
                // Sau khi lấy companyId, bạn có thể gọi API khác để lấy thông tin công ty
                const companyData = await getCompanyById(companyId); // Thực hiện truy vấn API với companyId
                setFormData({
                    name: companyData.name || '',
                    website: companyData.website || '',
                    email: companyData.email || '',
                    phoneNumber: companyData.phoneNumber || '',
                    companySize: companyData.companySize || '',
                    foundedYear: companyData.foundedYear || '',
                    description: companyData.description || '',
                    headquarters: companyData.headquarters || '',
                    logoUrl: companyData.logoUrl || '',
                    addresses: companyData.addresses.join(', ') || '',
                    skills: companyData.skills.join(', ') || '',
                    industries: companyData.industries.join(', ') || '',
                    compensationBenefits: companyData.compensationBenefits.join(', ') || '',
                });
                setAddressesList(companyData.addresses || []);
                setSkillsList(companyData.skills || []);
                setIndustriesList(companyData.industries || []);
                setCompensationList(companyData.compensationBenefits || []);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    // Gọi fetchUserProfile khi component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleAddToList = (type, value) => {
        if (type === 'addresses') {
            setAddressesList([...addressesList, value]);
        } else if (type === 'skills') {
            setSkillsList([...skillsList, value]);
        } else if (type === 'industries') {
            setIndustriesList([...industriesList, value]);
        } else if (type === 'compensationBenefits') {
            setCompensationList([...compensationList, value]);
        }
    };

    const handleCreateCompany = async () => {
        const profileData = await getProfile(); // Lấy dữ liệu hồ sơ người dùng
        const companyId = profileData.company.id; // Giả sử bạn có trường companyId trong response

        // Tạo đối tượng companyRequest mà không bao gồm email
        const companyRequest = {
            name: formData.name,
            website: formData.website,
            phoneNumber: formData.phoneNumber,
            companySize: formData.companySize,
            foundedYear: formData.foundedYear,
            description: formData.description,
            headquarters: formData.headquarters,
            logoUrl: formData.logoUrl, // Gửi URL logo
            addresses: addressesList,
            skills: skillsList,
            industries: industriesList,
            compensationBenefits: compensationList,
        };

        const file = logoFile; // Gán file logo nếu có

        try {
            // Gọi API updateCompanyInfo
            const response = await updateCompanyInfo(companyId, companyRequest, file);
            console.log('Công ty đã được cập nhật:', response);
            alert('Công ty đã được cập nhật!');
            resetForm(); // Reset form sau khi thành công
        } catch (error) {
            console.error('Lỗi khi cập nhật công ty:', error);
            alert('Đã có lỗi xảy ra khi cập nhật công ty');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            website: '',
            email: '',
            phoneNumber: '',
            companySize: '',
            foundedYear: '',
            description: '',
            headquarters: '',
            logoUrl: '',
            addresses: '',
            skills: '',
            industries: '',
            compensationBenefits: '',
        });
        setAddressesList([]);
        setSkillsList([]);
        setIndustriesList([]);
        setCompensationList([]);
        setLogoFile(null); // Reset logo
    };

    // Hàm để xử lý chọn file logo
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, logoUrl: reader.result }); // Cập nhật URL ảnh
            };
            reader.readAsDataURL(file);
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
                                <h3 className="mb-0">Chỉnh sửa thông tin công ty</h3>
                            </CardHeader>
                            <CardBody>
                                <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>


                                    <div style={{ marginTop: '20px', backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                        <form>
                                            {/* Khung Logo */}
                                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                                <label htmlFor="logoUrl" style={{ display: 'block', marginBottom: '10px' }}>Logo Công Ty</label>
                                                <div
                                                    style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        border: '2px dashed #ccc',
                                                        margin: '0 auto',
                                                        backgroundImage: `url(${formData.logoUrl})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() => document.getElementById('logoUpload').click()}
                                                >
                                                    {!formData.logoUrl && <span style={{ display: 'block', paddingTop: '50px', color: '#ccc' }}>Click để chọn logo</span>}
                                                </div>
                                                <input
                                                    id="logoUpload"
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                />
                                            </div>

                                            {/* Các mục nhập thông tin công ty */}
                                            <h6 style={{ color: '#6c757d', marginBottom: '15px', fontSize: '18px' }}>Thông tin công ty</h6>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                                {[{ id: 'name', label: 'Tên công ty', type: 'text', placeholder: 'Nhập tên công ty' },
                                                { id: 'website', label: 'Website', type: 'text', placeholder: 'Nhập website công ty' },
                                                { id: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email công ty', disabled: true },
                                                { id: 'phoneNumber', label: 'Số điện thoại', type: 'text', placeholder: 'Nhập số điện thoại' },
                                                { id: 'companySize', label: 'Quy mô công ty', type: 'text', placeholder: 'Nhập quy mô công ty' },
                                                { id: 'foundedYear', label: 'Năm thành lập', type: 'number', placeholder: 'Nhập năm thành lập' },
                                                { id: 'description', label: 'Mô tả công ty', type: 'text', placeholder: 'Nhập mô tả công ty' },
                                                { id: 'headquarters', label: 'Trụ sở chính', type: 'text', placeholder: 'Nhập trụ sở chính' }]
                                                    .map((field) => (
                                                        <div key={field.id}>
                                                            <label htmlFor={field.id} style={{ display: 'block', marginBottom: '5px' }}>{field.label}</label>
                                                            <input
                                                                id={field.id}
                                                                type={field.type}
                                                                placeholder={field.placeholder}
                                                                value={formData[field.id]}
                                                                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                                                                disabled={field.disabled || false} // Nếu là email thì không cho sửa
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '12px',
                                                                    border: '1px solid #ccc',
                                                                    borderRadius: '4px',
                                                                    boxSizing: 'border-box',
                                                                }}
                                                            />
                                                        </div>
                                                    ))}
                                            </div>

                                            {/* Các mục nhập động */}
                                            {['addresses', 'skills', 'industries', 'compensationBenefits'].map((type) => (
                                                <div key={type} style={{ marginBottom: '20px' }}>
                                                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>{`Nhập ${type}`}</label>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <input
                                                            type="text"
                                                            placeholder={`Nhập các ${type} (phân tách bằng dấu phẩy)`}
                                                            onChange={(e) => setFormData({ ...formData, [type]: e.target.value })}
                                                            value={formData[type]}
                                                            style={{
                                                                flex: '1',
                                                                padding: '8px',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '4px',
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            style={{
                                                                padding: '8px 12px',
                                                                backgroundColor: '#007bff',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                            }}
                                                            onClick={() => handleAddToList(type, formData[type])}
                                                        >
                                                            Thêm
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Submit Button */}
                                            <div style={{ textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    style={{
                                                        padding: '12px 20px',
                                                        backgroundColor: '#28a745',
                                                        color: '#fff',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={handleCreateCompany}
                                                >
                                                    Cập nhật công ty
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default UpdateCompanyInfo;
