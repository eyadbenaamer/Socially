import fs from "fs";
import sharp from "sharp";

export const compressImage = async (req, res, next) => {
  try {
    let { media } = req.files;
    if (media) {
      media = media.map((file, index) => {
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
  } catch {}
  next();
};
