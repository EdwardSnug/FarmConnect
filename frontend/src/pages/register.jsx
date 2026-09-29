// import { useState } from "react";
// import { auth, googleProvider } from "../api/firebase";
// import { signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
// import "../styles/components.css";
// import { Link, useNavigate } from "react-router-dom";
// import logoGreen from '../assets/logo-green.svg';

// function Register() {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [success, setSuccess] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");
//         setSuccess(false);
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//             setSuccess(true);
//             navigate("/"); // Redirect to login page after successful registration
//         } catch (err) {
//             setError(err.message);
//         }
//         setLoading(false);
//     };

//     // const handleGoogleSignup = async () => {
//     //     setLoading(true);
//     //     setError("");
//     //     try {
//     //         await signInWithPopup(auth, googleProvider);
//     //         setSuccess(true);
//     //         navigate("/"); // Redirect to login page after successful Google signup
//     //     } catch (err) {
//     //         setError(err.message);
//     //     }
//     //     setLoading(false);
//     // };

//     return (
//         <div className="register-container">
//             <img className="signup-logo" src={logoGreen} alt="Farmers Market Hub Logo" />
//             <h2>Register</h2>
//             <form onSubmit={handleSubmit} className="register-form">
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                 />
//                 <button type="submit" disabled={loading}>
//                     {loading ? "Registering..." : "Register"}
//                 </button>
//                 {/* <button
//                     type="button"
//                     className="google-btn"
//                     onClick={handleGoogleSignup}
//                     disabled={loading}
//                     style={{ marginTop: "10px" }}
//                 >
//                     {loading ? "Processing..." : "Sign up with Google"}
//                 </button> */}
//                 {error && <p className="error">{error}</p>}
//                 {success && <p className="success">Registration successful!</p>}
//             </form>
//             <h4>
//                 Have account? Please <Link to="/">Log in</Link>.
//             </h4>
//         </div>
//     );
// }

// export default Register;

import { useState } from "react";
import { auth } from "../api/firebase";
import {
    createUserWithEmailAndPassword,
    updateProfile
} from "firebase/auth";
import "../styles/components.css";
import { Link, useNavigate } from "react-router-dom";
import logoGreen from "../assets/logo-green.svg";

function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [county, setCounty] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [phoneValid, setPhoneValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const counties = [
        "Baringo",
        "Bomet",
        "Bungoma",
        "Busia",
        "Elgeyo-Marakwet",
        "Embu",
        "Garissa",
        "Homa Bay",
        "Isiolo",
        "Kajiado",
        "Kakamega",
        "Kericho",
        "Kiambu",
        "Kilifi",
        "Kirinyaga",
        "Kisii",
        "Kisumu",
        "Kitui",
        "Kwale",
        "Laikipia",
        "Lamu",
        "Machakos",
        "Makueni",
        "Mandera",
        "Marsabit",
        "Meru",
        "Migori",
        "Marsabit",
        "Murang'a",
        "Nairobi",
        "Nakuru",
        "Nandi",
        "Narok",
        "Nyamira",
        "Nyandarua",
        "Nyeri",
        "Samburu",
        "Siaya",
        "Taita-Taveta",
        "Tana River",
        "Tharaka-Nithi",
        "Trans Nzoia",
        "Turkana",
        "Uasin Gishu",
        "Vihiga",
        "Wajir",
        "West Pokot"
    ];

    // Validate Kenyan phone number
    const validatePhoneNumber = (phone) => {
        const cleaned = phone.replace(/[\s-]/g, "");

        const kenyanPhoneRegex =
            /^(?:07\d{8}|01\d{8}|2547\d{8}|2541\d{8}|\+2547\d{8}|\+2541\d{8})$/;

        return kenyanPhoneRegex.test(cleaned);
    };

    // Format phone number to 254XXXXXXXXX
    const formatPhoneNumber = (phone) => {
        let formattedPhone = phone
            .replace(/[\s-]/g, "")
            .trim();

        if (formattedPhone.startsWith("+254")) {
            formattedPhone = formattedPhone.substring(1);
        } else if (
            formattedPhone.startsWith("07") ||
            formattedPhone.startsWith("01")
        ) {
            formattedPhone =
                "254" + formattedPhone.substring(1);
        }

        return formattedPhone;
    };

    // Validate phone while typing
    const handlePhoneChange = (e) => {
        const value = e.target.value;

        setPhoneNumber(value);

        const cleaned = value.replace(/[\s-]/g, "");

        // Don't show an error while the user is still typing
        if (cleaned.length < 10) {
            setPhoneError("");
            setPhoneValid(false);
            return;
        }

        if (validatePhoneNumber(value)) {
            setPhoneError("");
            setPhoneValid(true);
        } else {
            setPhoneError(
                "Please enter a valid Kenyan phone number."
            );
            setPhoneValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setSuccess(false);

        // Final phone validation before registration
        if (!validatePhoneNumber(phoneNumber)) {
            setPhoneError(
                "Please enter a valid Kenyan phone number, e.g. 0712345678."
            );
            setPhoneValid(false);
            setLoading(false);
            return;
        }

        try {
            // Convert phone number to 254 format
            const formattedPhone =
                formatPhoneNumber(phoneNumber);

            // Create Firebase account
            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            const user = userCredential.user;

            // Store full name in Firebase profile
            await updateProfile(user, {
                displayName: fullName
            });

            // Store additional profile information locally
            localStorage.setItem(
                `farmconnect_profile_${user.uid}`,
                JSON.stringify({
                    fullName: fullName,
                    phoneNumber: formattedPhone,
                    county: county
                })
            );

            setSuccess(true);

            // Redirect to login page
            navigate("/");
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    return (
        <div className="register-container">

            <img
                className="signup-logo"
                src={logoGreen}
                alt="Farmers Market Hub Logo"
            />

            <h2>Register</h2>

            <form
                onSubmit={handleSubmit}
                className="register-form"
            >

                {/* Full Name */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={e =>
                        setFullName(e.target.value)
                    }
                    required
                />

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e =>
                        setEmail(e.target.value)
                    }
                    required
                />

                {/* Phone Number */}
                <input
                    type="tel"
                    placeholder="Phone Number (e.g. 0712345678)"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required
                />

                {/* Phone validation message */}
                {phoneValid && (
                    <p className="success">
                        ✓ Valid phone number
                    </p>
                )}

                {phoneError && (
                    <p className="error">
                        {phoneError}
                    </p>
                )}

                {/* County */}
                <select
                    value={county}
                    onChange={e =>
                        setCounty(e.target.value)
                    }
                    required
                >
                    <option value="">
                        Select County
                    </option>

                    {counties.map(countyName => (
                        <option
                            key={countyName}
                            value={countyName}
                        >
                            {countyName}
                        </option>
                    ))}
                </select>

                {/* Password */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e =>
                        setPassword(e.target.value)
                    }
                    required
                />

                {/* Register button */}
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Registering..."
                        : "Register"}
                </button>

                {/* General error */}
                {error && (
                    <p className="error">
                        {error}
                    </p>
                )}

                {/* Registration success */}
                {success && (
                    <p className="success">
                        Registration successful!
                    </p>
                )}

            </form>

            <h4>
                Have account? Please{" "}
                <Link to="/">Log in</Link>.
            </h4>

        </div>
    );
}

export default Register;