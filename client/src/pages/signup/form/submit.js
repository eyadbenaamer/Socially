const submit = async (data, setSignupDetails) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body: JSON.stringify(data),
  }).then((response) => {
    const status = response.status;
    return { isSignedUp: status === 200 ? true : false, status };
  });
  const { status } = response;
  const signupDetails =
    status === 200
      ? { isSignedUp: true, message: "Signed up successfully." }
      : status === 400
      ? { isSignedUp: false, message: "missing required fields" }
      : status === 409
      ? { isSignedUp: false, message: "The Email is used." }
      : status === 500
      ? { isSignedUp: false, message: "An error occured. Try again later." }
      : "";
  setSignupDetails(signupDetails);
};

export default submit;
