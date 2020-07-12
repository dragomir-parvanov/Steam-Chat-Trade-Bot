const MAIN_SERVER_URL = process.env.NODE_ENV === "production" ? "https://hidden.domain" : "http://localhost";

export default MAIN_SERVER_URL;
