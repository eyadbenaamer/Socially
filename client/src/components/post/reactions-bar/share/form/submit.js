export const submit = (data, token, creatorId, postId) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
  }

  return fetch(`${API_URL}/post/share?userId=${creatorId}&postId=${postId}`, {
    method: "POST",
    body: formData,
    headers: { Authorization: token },
  }).then((response) => response.json());
};
