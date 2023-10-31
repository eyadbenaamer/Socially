import axios from "axios";

const submit = async (data, setSignupDetails) => {
  const API_URL = process.env.REACT_APP_API_URL;

  let formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
  }

  data.picture && formData.append("pictureName", data.picture.name);
  const response = await axios.post(`${API_URL}/signup`, formData).then(
    (resolved) => {
      const isSignedUp = true;
      return { isSignedUp, status: 200 };
    },
    (rejected) => {
      const isSignedUp = false,
        status = rejected.response.status;
      return { isSignedUp, status };
    }
  );
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
