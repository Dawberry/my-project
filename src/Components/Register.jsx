import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { Link } from "react-router-dom";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';

const Register = () => {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
      console.log(JSON.stringify(response?.data));
      setSuccess(true);
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
        {success ? (
          <section className="text-center">
            <h1 className="text-2xl font-semibold text-green-600">Success!</h1>
            <p className="mt-4">
              <Link to="/login" className="text-blue-600 underline">Sign In</Link>
            </p>
          </section>
        ) : (
          <>
            <p
              ref={errRef}
              className={`${errMsg ? "text-red-500 mb-4" : "sr-only"}`}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label htmlFor="username" className="block font-medium">
                  Username
                  {user && (
                    <span className="ml-2 text-lg">
                      {validName ? '✔️' : '❌'}
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  id="username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                  required
                  aria-invalid={!validName}
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {userFocus && user && !validName && (
                  <p className="text-sm text-gray-600 mt-1">
                    4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block font-medium">
                  Password
                  {pwd && (
                    <span className="ml-2 text-lg">
                      {validPwd ? '✔️' : '❌'}
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  id="password"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required
                  aria-invalid={!validPwd}
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {pwdFocus && !validPwd && (
                  <p className="text-sm text-gray-600 mt-1">
                    8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_pwd" className="block font-medium">
                  Confirm Password
                  {matchPwd && (
                    <span className="ml-2 text-lg">
                      {validMatch ? '✔️' : '❌'}
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  value={matchPwd}
                  required
                  aria-invalid={!validMatch}
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                  className="w-full border px-3 py-2 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {matchFocus && !validMatch && (
                  <p className="text-sm text-gray-600 mt-1">
                    Must match the first password input field.
                  </p>
                )}
              </div>

              <button
                disabled={!validName || !validPwd || !validMatch}
                className={`w-full py-2 rounded bg-blue-600 text-white font-semibold 
                ${(!validName || !validPwd || !validMatch) ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
              >
                Sign Up
              </button>
            </form>

            <p className="mt-4 text-center text-sm">
              Already registered? <Link to="/login" className="text-blue-600 underline">Sign In</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
