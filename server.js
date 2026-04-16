const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'stocks.json');
const STRONGEST_IMAGES_FILE = path.join(__dirname, 'data', 'strongest-images.json');

app.use(express.json({ limit: '30mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// 读取数据
app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      res.json(data);
    } else {
      res.json({ stocks: [], activeIdx: -1 });
    }
  } catch (e) {
    res.json({ stocks: [], activeIdx: -1 });
  }
});

// 保存数据
app.post('/api/data', (req, res) => {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 读取最强页面图片
app.get('/api/strongest-images', (req, res) => {
  try {
    if (fs.existsSync(STRONGEST_IMAGES_FILE)) {
      const data = JSON.parse(fs.readFileSync(STRONGEST_IMAGES_FILE, 'utf8'));
      res.json(data);
    } else {
      res.json({ blocks: [] });
    }
  } catch (e) {
    res.json({ blocks: [] });
  }
});

// 保存最强页面图片
app.post('/api/strongest-images', (req, res) => {
  try {
    fs.mkdirSync(path.dirname(STRONGEST_IMAGES_FILE), { recursive: true });
    fs.writeFileSync(STRONGEST_IMAGES_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`交易框架已启动: http://localhost:${PORT}`);
});
