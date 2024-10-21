require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middlewares/error-middleware");
const notFound = require("./middlewares/not-found");
const authRoute = require("./routes/auth-route");
const userRoute = require("./routes/user-route");
const requestTaskRoute = require("./routes/request-task-route");
const maintenanceTaskRoute = require("./routes/maintenance-task-route");
const { authenticate } = require("./middlewares/authenticate");
const puppeteer = require("puppeteer");
const Morgan = require("morgan");
const createError = require("./utils/create-error");

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use(Morgan("dev"));

app.use("/auth", authRoute);
app.use("/user", authenticate, userRoute);
app.use("/request-task", authenticate, requestTaskRoute);
app.use("/maintenance-task", authenticate, maintenanceTaskRoute);





app.get('/generate-pdf', async (req, res) => {
  try {
    // เปิด browser โดยใช้ args เพื่อลดปัญหาเรื่องสิทธิ์
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // สร้าง token สำหรับการ authenticate (หากจำเป็น)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send('Unauthorized Header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send('Unauthorized Token missing');
    }

    // กำหนด header เพื่อส่ง token ไปใน request
    await page.setExtraHTTPHeaders({
      Authorization: `Bearer ${token}`,
    });

    // เข้าสู่หน้าเว็บที่ต้องการสร้าง PDF และรอจนกระทั่งหน้าโหลดเสร็จ
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });

    // ใช้ตัวเลือกเพื่อรอ element ที่ต้องการแสดงก่อนสร้าง PDF (เปลี่ยนเป็น class หรือ id ที่ใช้กับกราฟหรือเนื้อหา)
    await page.waitForSelector('.chart-container'); // กำหนดให้รอจนกว่า .chart-container จะถูกสร้างขึ้น

    // สร้าง PDF โดยกำหนด margin และ printBackground เพื่อความสวยงาม
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '10px', right: '10px' },
    });

    // ปิด browser หลังจากการสร้าง PDF เสร็จสิ้น
    await browser.close();

    // ตั้งค่าหัวข้อสำหรับการส่งไฟล์ PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="dashboard.pdf"',
    });

    // ส่งข้อมูล PDF กลับไปที่ client
    res.end(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating PDF');
  }
});



app.use(errorMiddleware);
app.use("*", notFound);

const port = process.env.PORT;
app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
