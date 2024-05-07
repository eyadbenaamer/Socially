export const submit = async (data, media, token) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
  }
  if (media) {
    for (const file in media) {
      formData.append("media", media[file]);
    }
  }

  return fetch(`${API_URL}/post/create`, {
    method: "POST",
    body: formData,
    headers: { Authorization: token },
  }).then((response) => response.json());
};
