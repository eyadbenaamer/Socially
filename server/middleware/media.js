import fs from "fs";
import sharp from "sharp";

export const compressImages = async (req, res, next) => {
  try {
    // let { media } = req.files;
    for (const key in req.files) {
      let item = req.files[key];
      if (key) {
        item = item.map((file, index) => {
          if (file.mimetype.startsWith("image")) {
            //compress the image
            const newName = `${Date.now()}-${index}.jpeg`;
            const newPath = `./public/storage/${newName}`;
            sharp(file.path)
              .resize()
              .jpeg({ quality: 50 })
              .toFile(newPath)
              .then(() => {
                fs.unlinkSync(file.path);
              })
              .catch(() => {});
            file.filename = newName;
            return file;
          }
        });
      }
    }
  } catch {}
  next();
};

export const uploadSingleFile = (req, res, next) => {
  try {
    const uploadsFolder = `${process.env.API_URL}/storage/`;

    const { file } = req;
    if (file) {
      if (file.mimetype.startsWith("image")) {
        //compress the image
        const newName = `${Date.now()}.jpeg`;
        const newPath = `./public/storage/${newName}`;
        sharp(file.path)
          .resize()
          .jpeg({ quality: 50 })
          .toFile(newPath)
          .then(() => {
            fs.unlinkSync(file.path);
          })
          .catch(() => {});
        // rename the file with the new name
        file.filename = newName;
        // store the new name in the database
        req.fileInfo = {
          path: `${uploadsFolder}${file.filename}`,
          fileType: "photo",
        };
      } else if (file.mimetype.startsWith("video")) {
        req.fileInfo = {
          path: `${uploadsFolder}${file.filename}`,
          fileType: "video",
        };
      }
    }
    next();
  } catch {
    return res
      .status(500)
      .json({ message: "An error occurred. Plaese try again later." });
  }
};
