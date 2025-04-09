import cloudinary from "../cloudinary";

export function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "foodwai" }, (err, result) => {
        if (err || !result) return reject(err);
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}
