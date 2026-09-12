import { useEffect, useState } from "react";
import customerservice from "../../customer/customerservice";

export default function MSGLogin() {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://verify.msg91.com/otp-provider.js";
    script.async = true;

    script.onload = () => {
      const configuration = {
        widgetId: import.meta.env.VITE_MSG91_WIDGET_ID,
        tokenAuth: import.meta.env.VITE_MSG91_TOKEN_AUTH,

        exposeMethods: true,

        success: (data) => {
          console.log("MSG91 success:", data);

          // This callback contains the verified token.
          console.log("Access token:", data);
        },

        failure: (error) => {
          console.error("MSG91 failure:", error);
        },
      };

      window.initSendOTP(configuration);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const sendOTP = () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      alert("Enter a valid Indian mobile number");
      return;
    }

    setLoading(true);

    window.sendOtp(
      `91${mobile}`,
      (data) => {
        console.log("OTP sent:", data);
        setOtpSent(true);
        setLoading(false);
      },
      (error) => {
        console.error("Send OTP error:", error);
        setLoading(false);
      },
    );
  };

  const verifyOTP = () => {
    if (!otp || otp.length !== 4) {
      alert("Enter 6 digit OTP");
      return;
    }

    setLoading(true);

    window.verifyOtp(
      otp,
      async (data) => {
        console.log("OTP verified:", data);

        /*
         * data should contain the verified token.
         * Send that token to your Node.js backend.
         */

        const accessToken =
          data?.message || data?.["access-token"] || data?.token;

        if (!accessToken) {
          console.error("Access token not found:", data);
          setLoading(false);
          return;
        }

        try {
          const response = await customerservice.msg91WidgetVerify({
            accessToken,
            mobile,
          });

          console.log("Backend response:", response);

          if (!response.success) {
            alert(response.message || "Verification failed");
            return;
          }

          // Login successful
          localStorage.setItem("token", response.token);

          alert("Login successful");
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("OTP verification failed:", error);
        setLoading(false);
      },
    );
  };

  return (
    <div>
      {!otpSent ? (
        <>
          <input
            type="tel"
            maxLength={10}
            placeholder="Enter mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <button onClick={sendOTP} disabled={loading}>
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOTP} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={() => {
              window.retryOtp(
                null,
                (data) => console.log("OTP resent:", data),
                (error) => console.error("Resend error:", error),
              );
            }}
          >
            Resend OTP
          </button>
        </>
      )}
    </div>
  );
}
