import multer from "multer";

const storage = multer.diskStorage({
  // destination: (req, file, callback) => {
  //   callback(null, "uploads/");
  // },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
  limits: { fileSize: 500000 }, // 500kb
});

const upload = multer({ storage: storage });

export default upload;
