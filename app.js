// express 모듈을 불러옵니다.
import express from 'express';
// import path from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import fs from 'fs/promises';

const app = express();
const port = 3000;
// const fs = require('fs');
// // 파일 업로드를 위함
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function(req,file,cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.filedname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({storage : storage});

// app.post('/register',upload.single('chooseFile'), async (req,res) => {
//   try {
//     const newUsers = {
//       email: req.body.email,
//       password : req.body.password,
//       nickname : req.body.nickname,
//       profile : req.file ? req.file.path : null
//     };
//     const data = await fs.promises.readFile('user.json', 'utf8');
//     const users = JSON.parse(data);

//     users.push(newUsers);
//     await fs.writeFile('user.json',JSON.stringify(users,null,2), 'utf8');

//     res.send('회원가입이 완료되었습니다.');
//     res.redirect('/');
//   } catch (err){
//     res.status(500).send(error.message);
//   }
// });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 'pages' 디렉토리를 정적 파일로 제공합니다.
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  // path.join을 사용하여 올바른 파일 경로를 구성합니다.
  res.sendFile(path.join(__dirname, 'pages', 'login', 'login.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});