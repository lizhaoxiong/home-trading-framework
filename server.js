const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'stocks.json');

app.use(express.json());
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

app.listen(PORT, () => {
  console.log(`交易框架已启动: http://localhost:${PORT}`);
});
