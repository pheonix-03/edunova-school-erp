# EduNova - School ERP & Student Information System (SIS)

EduNova is a full-scale, institutional-grade School ERP and Student Information System (SIS) built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, and SQLite/PostgreSQL.

---

## 🌟 Key Features

1. **Student 360° Profiles (`/students`, `/students/[id]`)**
   - Centralized student directory with real-time class/section filters.
   - Comprehensive profile: academic history, guardian details, emergency contacts, medical records.
   - Automated PDF report cards generated directly from student performance metrics.

2. **Admissions & Enrollment CRM (`/admissions`)**
   - Application intake pipeline across stages (`Applied`, `Screening`, `Interview/Test`, `Approved`, `Enrolled`).
   - 1-click status progression and applicant review.

3. **Daily Class Attendance Roster (`/attendance`)**
   - Interactive class attendance roster by grade and section.
   - Quick "Mark All Present" action, status toggling (`Present`, `Absent`, `Late`, `Excused`), and live percentage calculation.

4. **Fees & Accounts Management (`/fees`)**
   - Invoices, fee structures, and dues tracking.
   - Payment collection recording across payment modes (Cash, UPI, Net Banking, Cheque).
   - Instant client-side **Official PDF Fee Receipt Generator** (`RCPT-...`).

5. **Examinations & Academic Gradebook (`/examinations`)**
   - Examination terms and subject-wise score recording.
   - Real-time percentage, grade (`A+`, `A`, `B`, `C`, `F`), and GPA calculation.
   - Printable official progress report cards with institutional letterhead.

6. **Parent & Student Companion Portal (`/parent-portal`)**
   - Mobile-first companion portal tailored for students and parents.
   - Live attendance tracking, circulars, grade summaries, and receipt downloads.

7. **Institutional Authentication & RBAC**
   - Role-Based Access Control (`PRINCIPAL`, `ACCOUNTANT`, `TEACHER`, `PARENT`, `STUDENT`).
   - Secure password hashing with `bcryptjs` and session tokens with `jose` JWTs.
   - Edge route protection via Next.js Middleware.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/edunova-erp.git
cd edunova-erp

# 2. Install dependencies
npm install

# 3. Setup database & schema
npm run prisma:push

# 4. Seed database with realistic demo accounts
npm run prisma:seed

# 5. Start development server
npm run dev
```

The app will be accessible at `http://localhost:3000`.

---

## 🔑 Demo Institutional Accounts

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Principal / Admin** | `principal@edunova.edu` | `Principal@1234` | Full access across all modules, school KPIs, audit stats |
| **Accountant** | `accounts@edunova.edu` | `Accounts@1234` | Fee structures, invoices, payment recording & PDF receipts |
| **Teacher** | `teacher.vikram@edunova.edu` | `Teacher@1234` | Class attendance marking & exam marks gradebook |
| **Student** | `student.aarav@edunova.edu` | `Student@1234` | Personal attendance, circulars & instant report card PDF |
| **Parent** | `parent.anita@edunova.edu` | `Parent@1234` | Child attendance feed, fees & official circulars |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & ORM**: [Prisma](https://www.prisma.io/) with SQLite (configurable to PostgreSQL/MySQL)
- **Authentication**: `bcryptjs` + `jose` (JWT) + Edge Middleware
- **PDF Generation**: `jspdf` + `jspdf-autotable`
- **Icons & UI**: `lucide-react`, `canvas-confetti`, `recharts`

---

## 📄 License
MIT
