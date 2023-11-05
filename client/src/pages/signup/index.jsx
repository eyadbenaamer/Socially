import Header from "components/header";
import Form from "./form";
import { useState } from "react";
import SetProfile from "./setProfile";
const Signup = () => {
  const [signupDetails, setSignupDetails] = useState({
    isSignedUp: false,
    message: "",
  });
  return (
    <>
      <Header />
      <h2>hello</h2>
      {!signupDetails.isSignedUp && (
        <>
          <Form setSignupDetails={setSignupDetails} />
          {signupDetails.isSignedUp === false && <>{signupDetails.message}</>}
        </>
      )}
      {signupDetails.isSignedUp && <SetProfile />}
    </>
  );
};
export default Signup;
