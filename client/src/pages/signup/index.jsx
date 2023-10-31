import Header from "components/header";
import Form from "./form";
import { useState } from "react";
const Signup = () => {
  const [signupDetails, setSignupDetails] = useState({
    isSignedUp: false,
    message: "",
  });
  return (
    <>
      <Header />
      <h2>hello</h2>
      <Form setSignupDetails={setSignupDetails} />
      {signupDetails.isSignedUp === false && <>{signupDetails.message}</>}
    </>
  );
};
export default Signup;
