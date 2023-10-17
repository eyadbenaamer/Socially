axios
  .post("https://v2.convertapi.com/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentage = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      percentLoader.open({ percentage, speed: 20 });
    },
  })
  .then((resp) => {
    console.log(resp);
  })
  .catch((error) => console.log(error));
