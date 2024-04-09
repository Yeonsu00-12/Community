// express 모듈을 불러옵니다.
import express from 'express';
// import path from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 'pages' 디렉토리를 정적 파일로 제공합니다.
app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
  // path.join을 사용하여 올바른 파일 경로를 구성합니다.
  res.sendFile(path.join(__dirname, 'pages', 'login', 'login.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});