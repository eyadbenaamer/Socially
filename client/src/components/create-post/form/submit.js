import axios from "axios";

export const submit = async (data, token) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
  }

  await fetch(`${API_URL}posts/create_post`, {
    method: "POST",
    body: formData,
    headers: { Authorization: token },
  });
  console.log(`Bearer ${token}`);
};
