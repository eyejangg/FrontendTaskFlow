# การนำขึ้นระบบของ Frontend (Vercel) 🚀

เอกสารนี้จะอธิบายขั้นตอนการนำโปรเจกต์ส่วนหน้าบ้าน (React + Vite) ขึ้นระบบ (Deploy) บน Vercel

## 1. เตรียมความพร้อมก่อนขึ้นระบบ
เนื่องจากระบบของคุณใช้การเรียก API ไปที่ `/api/v1` และเพื่อป้องกันปัญหาเรื่อง CORS และการส่ง Cookie ข้ามโดเมน เราได้ทำการเพิ่มไฟล์ `vercel.json` ให้คุณไว้แล้ว:
> **โปรดแก้ไฟล์ `vercel.json`**: เปลี่ยน `https://YOUR_RENDER_BACKEND_URL.onrender.com` ให้เป็น URL จริงของ Backend ที่คุณจะได้บน Render (เมื่อนำ backend ขึ้นระบบแล้ว)

## 2. ขั้นตอนการนำขึ้น Vercel
1. สมัครใช้งาน Vercel ที่ https://vercel.com/ (แนะนำให้ใช้ GitHub เพื่อความสะดวก)
2. อัปโหลดโปรเจกต์ทั้งหมด (ทั้งโฟลเดอร์นี้) เข้าไปเป็น Repository ใน GitHub
3. กดปุ่ม `Add New` ในหน้า Vercel และเลือก `Project`
4. เลือก Repository ขของโปรเจกต์ `FrontendTaskFlow` จาก GitHub ที่เพิ่งสร้าง
5. ตั้งค่า Framework Preset เป็น **Vite**
6. ส่วน **Install Command** และ **Build Command** ปล่อยเป็นค่าเริ่มต้นระบบจะหาเจอเอง (`npm install` และ `npm run build`)
7. ไม่มีค่า Environment Variable ที่จำเป็นต้องใส่ (เพราะเรา Proxy โยนไปที่ Vercel JSON แทนเพื่อให้ Cookie ทำงานสมบูรณ์)
8. กดปุ่ม **Deploy** !

---

จบฝั่ง Frontend! เมื่อเว็บรันเสร็จเรียบร้อย ให้นำ URL บน Vercel (เช่น `https://taskflow-frontend.vercel.app`) ไปตั้งเป็นค่า `BASE_URL` ในฝั่ง Render Backend ต่อไปครับ
