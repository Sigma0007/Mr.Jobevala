import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const MSG91_URL = "https://control.msg91.com/api/v5/otp";

export const sendOtpSms = async (mobile) => {
    try {
        // India number
        const phone = mobile.startsWith("91")
            ? mobile
            : `91${mobile}`;

        const response = await axios.post(
            MSG91_URL,
            {
                template_id: process.env.MSG91_TEMPLATE_ID,
                mobile: phone,
                otp_length: Number(process.env.MSG91_OTP_LENGTH || 4),
                otp_expiry: Number(process.env.MSG91_OTP_EXPIRY || 5),
            },
            {
                headers: {
                    authkey: process.env.MSG91_AUTH_KEY,
                    accept: "application/json",
                    "content-type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(
            "MSG91 error:",
            error.response?.data || error.message
        );

        throw new Error(
            error.response?.data?.message || "Unable to send OTP"
        );
    }
};