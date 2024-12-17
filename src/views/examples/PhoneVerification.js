import React, { useState, useEffect } from "react";
import { mdiShieldCheck, mdiAccountCheck, mdiPhoneInTalk } from '@mdi/js';
import Icon from '@mdi/react';
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap";
import Header from "components/Headers/Header"; // Import header
import { otpRequest, validateOtp, getProfile } from "../../components/API/apiService.js"; // Import các hàm API

const PhoneVerification = () => {
    const [otpVisible, setOtpVisible] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        // Lấy số điện thoại từ API khi component được mount
        const fetchProfile = async () => {
            try {
                const profile = await getProfile();
                // Chuyển số điện thoại từ dạng +84 thành 0
                const formattedPhone = profile.company.phoneNumber ? profile.company.phoneNumber.replace("+84", "0") : "";
                setPhoneNumber(formattedPhone); // Gán số điện thoại nếu có
            } catch (error) {
                console.error("Lỗi khi lấy thông tin hồ sơ:", error);
                displayToast("Lỗi khi lấy thông tin số điện thoại.");
            }
        };
        fetchProfile();
    }, []);

    // Hàm hiển thị thông báo dạng toast
    const displayToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSendCode = async () => {
        try {
            if (!phoneNumber || !/^0\d{9,10}$/.test(phoneNumber)) { // Kiểm tra định dạng số điện thoại
                displayToast("Vui lòng nhập số điện thoại hợp lệ.");
                return;
            }

            // Đổi số điện thoại từ dạng bắt đầu bằng 0 sang +84
            const formattedPhoneNumber = phoneNumber.replace(/^0/, "+84");

            const accountId = localStorage.getItem("accountId"); // Lấy accountId từ localStorage
            const response = await otpRequest(accountId, formattedPhoneNumber);

            console.log(response.message); // In ra message trả về
            setOtpVisible(true);
            displayToast("Đã gửi mã xác thực! Vui lòng kiểm tra điện thoại của bạn.");
        } catch (error) {
            displayToast("Lỗi khi gửi mã xác thực. Vui lòng thử lại.");
        }
    };

    // Xử lý khi click vào nút Xác thực
    const handleVerify = async () => {
        try {
            if (otpCode.length !== 6) {
                displayToast("Vui lòng nhập đúng mã OTP gồm 6 chữ số.");
                return;
            }
            const accountId = localStorage.getItem("accountId"); // Lấy accountId từ localStorage
            const response = await validateOtp(accountId, otpCode);
            displayToast(response); // Hiển thị chuỗi trả về từ API
        } catch (error) {
            displayToast("Lỗi khi xác thực mã OTP. Vui lòng thử lại.");
        }
    };

    // Hàm kiểm tra chỉ cho phép nhập số
    const validateOtpInput = (e) => {
        setOtpCode(e.target.value.replace(/\D/g, ""));
    };

    return (
        <>
            <Header />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="bg-transparent">
                                <h3 className="mb-0">Xác thực số điện thoại</h3>
                            </CardHeader>
                            <CardBody>
                                <div className="content-wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
                                    <div
                                        className="card"
                                        style={{
                                            padding: '20px',
                                            border: '1px solid #ddd',
                                            borderRadius: '10px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <h4 style={{ marginBottom: '10px' }}>Xác Thực Số Điện Thoại</h4>
                                        <p style={{ color: '#666', marginBottom: '20px' }}>
                                            Vui lòng xác thực số điện thoại để bảo mật tài khoản và nâng cao uy tín của bạn.
                                        </p>

                                        {/* Phần nhập số điện thoại và nút gửi mã xác thực */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                                            <label htmlFor="phoneNumber" style={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                                                Số điện thoại:
                                            </label>
                                            <input
                                                type="text"
                                                id="phoneNumber"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))} // Chỉ cho phép nhập số
                                                placeholder="Nhập số điện thoại"
                                                style={{
                                                    borderRadius: '5px',
                                                    border: '1px solid #ced4da',
                                                    padding: '0.5rem',
                                                    fontSize: '14px',
                                                    width: '200px',
                                                    textAlign: 'center',
                                                }}
                                            />

                                            <button
                                                onClick={handleSendCode}
                                                style={{
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    padding: '0.5rem 1rem',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.3s',
                                                }}
                                                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                                                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                                            >
                                                Gửi mã xác thực
                                            </button>
                                        </div>

                                        {/* Phần nhập mã OTP */}
                                        {otpVisible && (
                                            <div style={{ marginTop: '20px' }}>
                                                <input
                                                    type="text"
                                                    id="otpCode"
                                                    value={otpCode}
                                                    onChange={validateOtpInput}
                                                    placeholder="Nhập mã OTP"
                                                    style={{
                                                        borderRadius: '5px',
                                                        border: '1px solid #ced4da',
                                                        padding: '0.5rem',
                                                        fontSize: '14px',
                                                        width: '200px',
                                                        textAlign: 'center',
                                                    }}
                                                />
                                                <button
                                                    onClick={handleVerify}
                                                    style={{
                                                        marginLeft: '10px',
                                                        backgroundColor: '#28a745',
                                                        color: 'white',
                                                        padding: '0.5rem 1rem',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.3s',
                                                    }}
                                                    onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
                                                    onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
                                                >
                                                    Xác thực
                                                </button>
                                            </div>
                                        )}

                                        {/* Toast thông báo */}
                                        {showToast && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: '20px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    backgroundColor: '#007bff',
                                                    color: 'white',
                                                    padding: '15px 20px',
                                                    borderRadius: '5px',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    fontSize: '14px',
                                                    zIndex: '9999',
                                                }}
                                            >
                                                {toastMessage}
                                            </div>
                                        )}

                                        {/* Lợi ích khi xác thực số điện thoại */}
                                        <div style={{ marginTop: '30px' }}>
                                            <h5 style={{ color: '#555' }}>Lợi ích khi xác thực số điện thoại:</h5>
                                            <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                                    <Icon path={mdiShieldCheck} size={1} color="#28a745" style={{ marginRight: '10px' }} />
                                                    <span>Tăng cường bảo mật tài khoản nhà tuyển dụng, chống kẻ xấu giả mạo.</span>
                                                </li>
                                                <li style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                                    <Icon path={mdiAccountCheck} size={1} color="#007bff" style={{ marginRight: '10px' }} />
                                                    <span>Nâng cao mức độ uy tín của thương hiệu tuyển dụng.</span>
                                                </li>
                                                <li style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Icon path={mdiPhoneInTalk} size={1} color="#17a2b8" style={{ marginRight: '10px' }} />
                                                    <span>Được hỗ trợ nhanh chóng khi có vấn đề phát sinh.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </Row>
            </Container>
        </>
    );
};

export default PhoneVerification;
