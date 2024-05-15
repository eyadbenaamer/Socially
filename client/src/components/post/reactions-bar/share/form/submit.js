import axiosClient from "utils/AxiosClient";

export const submit = (data, creatorId, postId) => {
  const formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
  }

  return axiosClient
    .post(`post/share?userId=${creatorId}&postId=${postId}`, formData)
    .then((response) => response.data);
};
