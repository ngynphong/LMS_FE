import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { googleLoginApi } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';

const GoogleCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleAuthResponse } = useAuth(); // Hàm xử lý authentication response
    const processingRef = useRef(false); // Prevent multiple processing

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
      
        if (error) {
            console.error("Google OAuth error:", error);
            navigate('/auth?error=google_auth_failed');
            return;
        }

        if (code && !processingRef.current) {
            processingRef.current = true;

            const sendCodeToBackend = async (authorizationCode: string) => {
                try {

                    // Sử dụng googleLoginApi từ authService (đã được fix để dùng publicAxios)
                    const response = await googleLoginApi(authorizationCode);

                    if (response && response.token) {
                        console.log("Đăng nhập Google thành công, nhận được token");

                        // Sử dụng handleAuthResponse từ AuthContext để cập nhật state
                        handleAuthResponse(response);

                        // Đăng nhập thành công, điều hướng đến trang chính
                        navigate('/');
                    } else {
                        throw new Error("Không nhận được token từ backend.");
                    }

                } catch (err) {
                    console.error("Đăng nhập Google thất bại:", err);

                    // Điều hướng về trang đăng nhập với lỗi cụ thể
                    if (err instanceof Error) {
                        navigate(`/auth?error=google_auth_failed&message=${encodeURIComponent(err.message)}`);
                    } else {
                        navigate('/auth?error=google_auth_failed');
                    }
                }
            };

            sendCodeToBackend(code);
        } else if (!code) {
            console.log('GoogleCallbackPage: Không tìm thấy authorization code');
            navigate('/auth');
        }

    }, [searchParams, navigate, handleAuthResponse]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
            <p className="mt-4 text-xl font-semibold text-gray-700">Đang xử lý đăng nhập Google...</p>
            <p className="mt-2 text-sm text-gray-500 text-center max-w-md">
                Vui lòng đợi trong khi chúng tôi xác nhận thông tin đăng nhập của bạn.
            </p>
        </div>
    );
};

export default GoogleCallbackPage;
