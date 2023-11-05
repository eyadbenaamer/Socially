export const submit = async (data, media, token) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const formData = new FormData();
  for (const property in data) {
    formData.append(property, data[property]);
  }
  if (media) {
    // let filesNames = { photos: [], videos: [] };
    // for (const file in media) {
    //   media[file].type.startsWith("video")
    //     ? filesNames.videos.push(media[file].name)
    //     : filesNames.photos.push(media[file].name);
    // }
    // formData.append("filesNames", JSON.stringify(filesNames));
    for (const file in media) {
      formData.append("media", media[file]);
    }
  }

  return await fetch(`${API_URL}/posts/create_post`, {
    method: "POST",
    body: formData,
    headers: { Authorization: token },
  }).then((response) => response.json());
};
