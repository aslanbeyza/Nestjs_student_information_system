# Swagger API Test Rehberi

Bu proje NestJS Swagger entegrasyonu ile API dokümantasyonu sağlar.

## 🚀 Swagger UI'ya Erişim

Uygulama çalıştığında aşağıdaki URL'den Swagger dokümantasyonuna erişebilirsiniz:

```
http://localhost:3000/api/docs
```

## 📋 API Test Sırası (Doğru Test Akışı)

### ⚠️ ÖNEMLİ NOTLAR
- **401 Unauthorized** hatası alırsanız: Token süresi dolmuş, yeniden login yapın
- **403 Forbidden** hatası alırsanız: Bu endpoint için yetkiniz yok, farklı role ile login deneyin
- **Bearer Token** formatı: `Bearer your_access_token_here`
- **MongoDB ObjectId** formatı: 24 karakterlik hex string (örn: `507f1f77bcf86cd799439011`)

---

## 🔥 ADIM ADIM TEST REHBERİ

### 1️⃣ İLK KULLANICI OLUŞTURMA (Admin)

**Endpoint:** `POST /users`  
**Açıklama:** İlk kullanıcı otomatik olarak Admin rolü alır  
**Authentication:** ❌ Public (Bearer Token gerektirmez)

**Request Body:**
```json
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@school.com",
  "password": "admin123",
  "phone": "+90 555 123 45 67",
  "role": "ADMIN"
}
```

**Beklenen Response:**
```json
{
  "message": "Kullanıcı oluşturuldu. Email doğrulama linki gönderildi.",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@school.com",
    "phone": "+90 555 123 45 67",
    "role": "ADMIN",
    "emailVerified": false
  }
}
```

---

### 2️⃣ LOGİN YAPMA VE TOKEN ALMA

**Endpoint:** `POST /auth/login`  
**Açıklama:** Giriş yapıp JWT token alın  
**Authentication:** ❌ Public

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

**Beklenen Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ ÖNEMLİ:** `access_token`'ı kopyalayın ve Swagger'da "Authorize" butonuna tıklayıp yapıştırın!

---

### 3️⃣ SWAGGER'DA YETKİLENDİRME

1. Swagger sayfasının üstündeki **"Authorize"** butonuna tıklayın
2. Bearer Token alanına: `Bearer your_access_token_here` yazın
3. **"Authorize"** butonuna basın
4. Artık tüm protected endpoint'leri test edebilirsiniz!

---

### 4️⃣ PROFİL KONTROLÜ

**Endpoint:** `GET /auth/profile`  
**Açıklama:** Mevcut kullanıcı bilgilerini gösterir  
**Authentication:** ✅ Bearer Token gerekli

**Request:** Body yok, sadece Authorization header
**Beklenen Response:**
```json
{
  "sub": "65f1234567890abcdef12345",
  "email": "admin@school.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN",
  "iat": 1640995200,
  "exp": 1640998800
}
```

---

### 5️⃣ TEACHER KULLANICISI OLUŞTURMA

**Endpoint:** `POST /users`  
**Authentication:** ❌ Public

**Request Body:**
```json
{
  "firstName": "Ahmet",
  "lastName": "Öğretmen",
  "email": "teacher@school.com",
  "password": "teacher123",
  "phone": "+90 555 234 56 78",
  "role": "TEACHER"
}
```

---

### 6️⃣ STUDENT KULLANICISI OLUŞTURMA

**Endpoint:** `POST /users`  
**Authentication:** ❌ Public

**Request Body:**
```json
{
  "firstName": "Ayşe",
  "lastName": "Öğrenci",
  "email": "student@school.com",
  "password": "student123",
  "phone": "+90 555 345 67 89",
  "role": "STUDENT"
}
```

---

### 7️⃣ TÜM KULLANICILARI LISTELEME

**Endpoint:** `GET /users`  
**Authentication:** ❌ Public

**Response:** Tüm kullanıcıların listesi (user ID'lerini not alın!)

---

### 8️⃣ SINIF OLUŞTURMA

**Endpoint:** `POST /class`  
**Authentication:** ✅ Bearer Token gerekli (Admin/Teacher)

**Request Body:**
```json
{
  "classCode": "CS101",
  "className": "Bilgisayar Bilimleri 1",
  "capacity": 30,
  "semester": "Güz",
  "academicYear": "2023-2024",
  "location": "A101"
}
```

---

### 9️⃣ TEACHER PROFIL OLUŞTURMA

**Endpoint:** `POST /teachers`  
**Authentication:** ✅ Bearer Token gerekli (Admin)

**Request Body:**
```json
{
  "userId": "TEACHER_USER_ID_BURAYA",
  "department": "Bilgisayar Mühendisliği",
  "specialization": "Yazılım Geliştirme",
  "hireDate": "2023-01-15",
  "title": "Dr. Öğr. Üyesi",
  "salary": 15000,
  "qualification": "Doktora",
  "experience": 10,
  "subjects": ["Programlama", "Veri Yapıları"],
  "isActive": true,
  "officeLocation": "B201"
}
```

**⚠️ NOT:** `userId` alanına 7. adımda aldığınız teacher kullanıcısının ID'sini yazın

---

### 🔟 STUDENT PROFIL OLUŞTURMA

**Endpoint:** `POST /students`  
**Authentication:** ✅ Bearer Token gerekli (Admin)

**Request Body:**
```json
{
  "userId": "STUDENT_USER_ID_BURAYA",
  "studentNumber": "20231001",
  "classLevel": "1. Sınıf",
  "enrollmentDate": "2023-09-15",
  "status": "active"
}
```

**⚠️ NOT:** `userId` alanına 6. adımda aldığınız student kullanıcısının ID'sini yazın

---

### 1️⃣1️⃣ DERS OLUŞTURMA

**Endpoint:** `POST /courses`  
**Authentication:** ✅ Bearer Token gerekli (Admin/Teacher)

**Request Body:**
```json
{
  "teacherId": "TEACHER_ID_BURAYA",
  "classId": "CLASS_ID_BURAYA",
  "courseCode": "CS101",
  "courseName": "Programlama Temelleri",
  "credits": 3,
  "description": "C++ programlama dili temelleri",
  "semester": "Güz",
  "academicYear": "2023-2024"
}
```

**⚠️ NOT:** 
- `teacherId`: 9. adımda oluşturulan teacher kaydının ID'si
- `classId`: 8. adımda oluşturulan class kaydının ID'si

---

### 1️⃣2️⃣ ÖĞRENCİYİ DERSE KAYDETME

**Endpoint:** `POST /student-courses`  
**Authentication:** ✅ Bearer Token gerekli (Admin/Teacher)

**Request Body:**
```json
{
  "studentId": "STUDENT_ID_BURAYA",
  "courseId": "COURSE_ID_BURAYA",
  "enrollmentDate": "2023-09-20",
  "status": "active"
}
```

**⚠️ NOT:**
- `studentId`: 10. adımda oluşturulan student kaydının ID'si  
- `courseId`: 11. adımda oluşturulan course kaydının ID'si

---

### 1️⃣3️⃣ NOT GİRME

**Endpoint:** `POST /grades`  
**Authentication:** ✅ Bearer Token gerekli (Admin/Teacher)

**Request Body:**
```json
{
  "studentId": "STUDENT_ID_BURAYA",
  "courseId": "COURSE_ID_BURAYA",
  "midtermGrade": 85,
  "finalGrade": 90,
  "homeworkGrade": 95,
  "projectGrade": 88,
  "finalScore": 89,
  "letterGrade": "BA"
}
```

---

### 1️⃣4️⃣ DEVAMSIZLIK KAYDI

**Endpoint:** `POST /attendances`  
**Authentication:** ✅ Bearer Token gerekli (Admin/Teacher)

**Request Body:**
```json
{
  "studentId": "STUDENT_ID_BURAYA",
  "courseId": "COURSE_ID_BURAYA",
  "attendanceDate": "2023-10-15",
  "status": "present",
  "notes": "Derse zamanında katıldı"
}
```

**Status değerleri:** `present`, `absent`, `late`, `excused`

---

## 📊 TEST SONRASI LİSTELEME İŞLEMLERİ

### Tüm Kayıtları Görüntüleme

| Endpoint | Authentication | Açıklama |
|----------|---------------|----------|
| `GET /users` | ❌ Public | Tüm kullanıcılar |
| `GET /teachers` | ❌ Public | Tüm öğretmenler |
| `GET /students` | ✅ Token | Tüm öğrenciler |
| `GET /class` | ✅ Token | Tüm sınıflar |
| `GET /courses` | ✅ Token | Tüm dersler |
| `GET /grades` | ✅ Token | Tüm notlar |
| `GET /attendances` | ✅ Token | Tüm devamsızlıklar |
| `GET /student-courses` | ✅ Token | Öğrenci-Ders ilişkileri |

---

## 🔄 TOKEN YENİLEME

Access token süresi dolduğunda:

**Endpoint:** `POST /auth/refresh`  
**Authentication:** ❌ Public

**Request Body:**
```json
{
  "refresh_token": "REFRESH_TOKEN_BURAYA"
}
```

---

## 🛡️ ROLE BAZLI ERİŞİM HAKLARI

| Endpoint | ADMIN | TEACHER | STUDENT |
|----------|-------|---------|---------|
| User CRUD | ✅ | ❌ | ❌ |
| Teacher CRUD | ✅ | ❌ | ❌ |
| Student CRUD | ✅ | ❌ | ❌ |
| Class CRUD | ✅ | ✅ | ✅ (sadece okuma) |
| Course CRUD | ✅ | ✅ | ✅ (sadece okuma) |
| Grade CRUD | ✅ | ✅ | ❌ |
| Attendance CRUD | ✅ | ✅ | ❌ |

---

## ❌ HATA ÇÖZÜMLEME

### 401 Unauthorized
- Token süresi dolmuş → Refresh token kullanın
- Token yanlış format → `Bearer TOKEN` formatını kontrol edin
- Token eksik → Authorize butonunu kullanın

### 403 Forbidden  
- Yetkiniz yok → Farklı role ile login deneyin
- Admin yetkisi gerekli → ADMIN rolü ile login yapın

### 400 Bad Request
- Request body hatalı → DTO formatını kontrol edin
- Validation hatası → Required alanları doldurun

### 404 Not Found
- ID bulunamadı → Mevcut kayıt ID'lerini kullanın
- Endpoint yanlış → URL'yi kontrol edin

---

## 🎯 BAŞARILI TEST AKIŞI ÖZETİ

1. ✅ Admin kullanıcı oluştur
2. ✅ Login yap, token al
3. ✅ Swagger'da authorize ol
4. ✅ Teacher kullanıcı oluştur
5. ✅ Student kullanıcı oluştur
6. ✅ Sınıf oluştur
7. ✅ Teacher profil oluştur
8. ✅ Student profil oluştur
9. ✅ Ders oluştur
10. ✅ Öğrenciyi derse kaydet
11. ✅ Not gir
12. ✅ Devamsızlık kaydet
13. ✅ Tüm listeleme endpoint'lerini test et

Bu sırayı takip ederseniz hiç hata almadan tüm sistemi test edebilirsiniz! 🚀 