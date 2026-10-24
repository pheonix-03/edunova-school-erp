const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EduNova School ERP & SIS database...');

  // Clean existing tables
  await prisma.schoolNotice.deleteMany();
  await prisma.examResult.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeInvoice.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.studentAttendance.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.gradeClass.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.user.deleteMany();

  // 1. Academic Year
  const academicYear = await prisma.academicYear.create({
    data: {
      name: '2026-2027',
      isCurrent: true,
      startDate: '2026-04-01',
      endDate: '2027-03-31',
    },
  });

  // 2. Passwords
  const salt = bcrypt.genSaltSync(10);
  const hashPrincipal = bcrypt.hashSync('Principal@1234', salt);
  const hashAccounts = bcrypt.hashSync('Accounts@1234', salt);
  const hashTeacher = bcrypt.hashSync('Teacher@1234', salt);
  const hashParent = bcrypt.hashSync('Parent@1234', salt);
  const hashStudent = bcrypt.hashSync('Student@1234', salt);

  // 3. Core Users
  const userPrincipal = await prisma.user.create({
    data: {
      email: 'principal@edunova.edu',
      passwordHash: hashPrincipal,
      role: 'PRINCIPAL',
      name: 'Dr. Rajesh Verma',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
  });

  const userAccounts = await prisma.user.create({
    data: {
      email: 'accounts@edunova.edu',
      passwordHash: hashAccounts,
      role: 'ACCOUNTANT',
      name: 'Sangeeta Nair',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
  });

  const userTeacherVikram = await prisma.user.create({
    data: {
      email: 'teacher.vikram@edunova.edu',
      passwordHash: hashTeacher,
      role: 'TEACHER',
      name: 'Vikram Rathore',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const userTeacherAnanya = await prisma.user.create({
    data: {
      email: 'teacher.ananya@edunova.edu',
      passwordHash: hashTeacher,
      role: 'TEACHER',
      name: 'Ananya Sen',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  });

  const userParentAnita = await prisma.user.create({
    data: {
      email: 'parent.anita@edunova.edu',
      passwordHash: hashParent,
      role: 'PARENT',
      name: 'Anita Sharma',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    },
  });

  const userStudentAarav = await prisma.user.create({
    data: {
      email: 'student.aarav@edunova.edu',
      passwordHash: hashStudent,
      role: 'STUDENT',
      name: 'Aarav Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
  });

  const userStudentSneha = await prisma.user.create({
    data: {
      email: 'student.sneha@edunova.edu',
      passwordHash: hashStudent,
      role: 'STUDENT',
      name: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
  });

  // 4. Teachers
  const teacherVikram = await prisma.teacher.create({
    data: {
      userId: userTeacherVikram.id,
      employeeCode: 'TCH-001',
      firstName: 'Vikram',
      lastName: 'Rathore',
      email: 'teacher.vikram@edunova.edu',
      phone: '+91 98111 22334',
      qualification: 'M.Sc. Physics, B.Ed. (Gold Medalist)',
      joiningDate: '2020-06-01',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
  });

  const teacherAnanya = await prisma.teacher.create({
    data: {
      userId: userTeacherAnanya.id,
      employeeCode: 'TCH-002',
      firstName: 'Ananya',
      lastName: 'Sen',
      email: 'teacher.ananya@edunova.edu',
      phone: '+91 98222 33445',
      qualification: 'M.Sc. Mathematics, Cambridge Certified Educator',
      joiningDate: '2021-04-15',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    },
  });

  // 5. Classes & Sections
  const class10A = await prisma.gradeClass.create({
    data: {
      name: 'Grade 10',
      section: 'A',
      roomNumber: 'Room 301 (Academic Block B)',
      capacity: 35,
      classTeacherId: teacherVikram.id,
    },
  });

  const class10B = await prisma.gradeClass.create({
    data: {
      name: 'Grade 10',
      section: 'B',
      roomNumber: 'Room 302 (Academic Block B)',
      capacity: 35,
    },
  });

  const class9A = await prisma.gradeClass.create({
    data: {
      name: 'Grade 9',
      section: 'A',
      roomNumber: 'Room 201 (Academic Block A)',
      capacity: 35,
      classTeacherId: teacherAnanya.id,
    },
  });

  const class8A = await prisma.gradeClass.create({
    data: {
      name: 'Grade 8',
      section: 'A',
      roomNumber: 'Room 101 (Academic Block A)',
      capacity: 30,
    },
  });

  // 6. Subjects
  const subMath = await prisma.subject.create({
    data: { name: 'Mathematics & Statistics', code: 'MTH-10', credits: 5 },
  });
  const subPhysics = await prisma.subject.create({
    data: { name: 'Physics (Theory & Practical)', code: 'PHY-10', credits: 4 },
  });
  const subChem = await prisma.subject.create({
    data: { name: 'Chemistry & Lab Sciences', code: 'CHM-10', credits: 4 },
  });
  const subEnglish = await prisma.subject.create({
    data: { name: 'English Literature & Language', code: 'ENG-10', credits: 4 },
  });
  const subCS = await prisma.subject.create({
    data: { name: 'Computer Science & AI', code: 'CS-10', credits: 4 },
  });
  const subSocial = await prisma.subject.create({
    data: { name: 'Social Studies & World History', code: 'SST-10', credits: 4 },
  });

  // 7. Parents & Guardians
  const parentSharma = await prisma.parent.create({
    data: {
      userId: userParentAnita.id,
      fatherName: 'Rajat Sharma (Senior Architect)',
      motherName: 'Anita Sharma (Financial Analyst)',
      primaryPhone: '+91 98765 11223',
      email: 'parent.anita@edunova.edu',
      occupation: 'Corporate Professional',
      address: 'Plot 42, Palm Meadows, Whitefield, Bengaluru, KA 560066',
    },
  });

  const parentPatel = await prisma.parent.create({
    data: {
      fatherName: 'Dr. Ramesh Patel (Cardiologist)',
      motherName: 'Dr. Sunita Patel (Pediatrician)',
      primaryPhone: '+91 98444 33221',
      email: 'patel.family@gmail.com',
      occupation: 'Medical Doctor',
      address: '24B Green Glen Layout, Bellandur, Bengaluru',
    },
  });

  const parentGupta = await prisma.parent.create({
    data: {
      fatherName: 'Sanjay Gupta (Business Owner)',
      motherName: 'Meena Gupta',
      primaryPhone: '+91 99111 44556',
      email: 'sanjay.gupta@bizcorp.in',
      occupation: 'Entrepreneur',
      address: '5th Cross, Koramangala 4th Block, Bengaluru',
    },
  });

  // 8. Students (Class 10-A)
  const studentAarav = await prisma.student.create({
    data: {
      userId: userStudentAarav.id,
      admissionNo: 'ADM-2026-001',
      rollNo: 1,
      firstName: 'Aarav',
      lastName: 'Sharma',
      dateOfBirth: '2010-08-14',
      gender: 'Male',
      bloodGroup: 'O+',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      address: 'Plot 42, Palm Meadows, Whitefield, Bengaluru',
      emergencyContact: '+91 98765 11223',
      classId: class10A.id,
      parentId: parentSharma.id,
      status: 'ENROLLED',
      enrollmentDate: '2021-04-05',
    },
  });

  const studentSneha = await prisma.student.create({
    data: {
      userId: userStudentSneha.id,
      admissionNo: 'ADM-2026-002',
      rollNo: 2,
      firstName: 'Sneha',
      lastName: 'Patel',
      dateOfBirth: '2010-11-22',
      gender: 'Female',
      bloodGroup: 'B+',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      address: '24B Green Glen Layout, Bellandur, Bengaluru',
      emergencyContact: '+91 98444 33221',
      classId: class10A.id,
      parentId: parentPatel.id,
      status: 'ENROLLED',
      enrollmentDate: '2021-04-05',
    },
  });

  const studentRohan = await prisma.student.create({
    data: {
      admissionNo: 'ADM-2026-003',
      rollNo: 3,
      firstName: 'Rohan',
      lastName: 'Gupta',
      dateOfBirth: '2010-05-19',
      gender: 'Male',
      bloodGroup: 'A+',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      address: '5th Cross, Koramangala, Bengaluru',
      emergencyContact: '+91 99111 44556',
      classId: class10A.id,
      parentId: parentGupta.id,
      status: 'ENROLLED',
      enrollmentDate: '2022-04-02',
    },
  });

  const studentRiya = await prisma.student.create({
    data: {
      admissionNo: 'ADM-2026-004',
      rollNo: 4,
      firstName: 'Riya',
      lastName: 'Kapoor',
      dateOfBirth: '2010-09-08',
      gender: 'Female',
      bloodGroup: 'AB+',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
      address: 'Indiranagar 12th Main, Bengaluru',
      classId: class10A.id,
      status: 'ENROLLED',
      enrollmentDate: '2022-04-02',
    },
  });

  const studentKabir = await prisma.student.create({
    data: {
      admissionNo: 'ADM-2026-005',
      rollNo: 5,
      firstName: 'Kabir',
      lastName: 'Mehta',
      dateOfBirth: '2010-02-17',
      gender: 'Male',
      bloodGroup: 'O+',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      address: 'HSR Layout Sector 2, Bengaluru',
      classId: class10A.id,
      status: 'ENROLLED',
      enrollmentDate: '2023-04-01',
    },
  });

  // 9. Admissions CRM Pipeline
  await prisma.admissionApplication.create({
    data: {
      applicationNo: 'APP-2026-101',
      applicantName: 'Devansh Deshmukh',
      targetGrade: 'Grade 10',
      guardianName: 'Dr. Nitin Deshmukh',
      guardianPhone: '+91 98888 12345',
      guardianEmail: 'nitin.deshmukh@gmail.com',
      previousSchool: 'National Public School, Indiranagar',
      status: 'APPROVED',
      testScore: 92.5,
      appliedDate: new Date('2026-09-01'),
      notes: 'Exceptional math and science assessment score. Ready for enrollment fee generation.',
    },
  });

  await prisma.admissionApplication.create({
    data: {
      applicationNo: 'APP-2026-102',
      applicantName: 'Tara Sengupta',
      targetGrade: 'Grade 9',
      guardianName: 'Priyanka Sengupta',
      guardianPhone: '+91 97777 54321',
      guardianEmail: 'priyanka.s@outlook.com',
      previousSchool: 'Delhi Public School East',
      status: 'DOCS_VERIFIED',
      testScore: 88.0,
      appliedDate: new Date('2026-09-03'),
      notes: 'Transfer certificate and previous marksheets verified by registrar office.',
    },
  });

  await prisma.admissionApplication.create({
    data: {
      applicationNo: 'APP-2026-103',
      applicantName: 'Aditya Varma',
      targetGrade: 'Grade 8',
      guardianName: 'Kishore Varma',
      guardianPhone: '+91 96666 98765',
      guardianEmail: 'k.varma@techfirm.com',
      previousSchool: 'Greenwood High International',
      status: 'ENTRANCE_TEST',
      appliedDate: new Date('2026-09-05'),
      notes: 'Written entrance assessment scheduled for this Saturday 10:00 AM.',
    },
  });

  // 10. Student Attendance (Today and Recent)
  const today = new Date().toISOString().split('T')[0];
  const all10AStudents = [studentAarav, studentSneha, studentRohan, studentRiya, studentKabir];

  for (const st of all10AStudents) {
    await prisma.studentAttendance.create({
      data: {
        studentId: st.id,
        classId: class10A.id,
        date: today,
        status: st.rollNo === 3 ? 'ABSENT' : 'PRESENT',
        remarks: st.rollNo === 3 ? 'Sick note submitted by parent' : 'On time',
      },
    });
  }

  // 11. Fees & Accounts Management
  const fee10 = await prisma.feeStructure.create({
    data: {
      classId: class10A.id,
      term: 'Term 1 (Apr - Jul 2026)',
      tuitionFee: 45000,
      transportFee: 12000,
      labFee: 6000,
      libraryFee: 2000,
      totalAmount: 65000,
    },
  });

  // Invoice 1: Aarav Sharma (PAID)
  const invAarav = await prisma.feeInvoice.create({
    data: {
      invoiceNo: 'INV-2026-0101',
      studentId: studentAarav.id,
      title: 'Term 1 Tuition, Lab & Smart Class Fee',
      amountDue: 65000,
      amountPaid: 65000,
      dueDate: '2026-05-15',
      status: 'PAID',
    },
  });

  await prisma.feePayment.create({
    data: {
      receiptNo: 'RCPT-2026-8801',
      invoiceId: invAarav.id,
      studentId: studentAarav.id,
      amount: 65000,
      paymentMethod: 'ONLINE_UPI',
      transactionRef: 'UPI/20260510/9871236540',
      paymentDate: new Date('2026-05-10'),
    },
  });

  // Invoice 2: Sneha Patel (PAID)
  const invSneha = await prisma.feeInvoice.create({
    data: {
      invoiceNo: 'INV-2026-0102',
      studentId: studentSneha.id,
      title: 'Term 1 Tuition, Lab & Smart Class Fee',
      amountDue: 65000,
      amountPaid: 65000,
      dueDate: '2026-05-15',
      status: 'PAID',
    },
  });

  await prisma.feePayment.create({
    data: {
      receiptNo: 'RCPT-2026-8802',
      invoiceId: invSneha.id,
      studentId: studentSneha.id,
      amount: 65000,
      paymentMethod: 'NET_BANKING',
      transactionRef: 'HDFC-NET-99112233',
      paymentDate: new Date('2026-05-12'),
    },
  });

  // Invoice 3: Rohan Gupta (PARTIAL / DUE)
  await prisma.feeInvoice.create({
    data: {
      invoiceNo: 'INV-2026-0103',
      studentId: studentRohan.id,
      title: 'Term 1 Tuition, Lab & Smart Class Fee',
      amountDue: 65000,
      amountPaid: 35000,
      dueDate: '2026-05-15',
      status: 'PARTIAL',
    },
  });

  // 12. Examination & Academic Records
  const examMidTerm = await prisma.exam.create({
    data: {
      name: 'Mid-Term Summative Assessment 2026',
      term: 'Term 1',
      academicYear: '2026-2027',
      startDate: '2026-08-18',
      endDate: '2026-08-28',
      isPublished: true,
    },
  });

  // Marks for Aarav Sharma
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentAarav.id,
      subjectId: subMath.id,
      marksObtained: 96,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Outstanding analytical clarity and proof work.',
    },
  });
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentAarav.id,
      subjectId: subPhysics.id,
      marksObtained: 92,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Excellent practical concept grasp.',
    },
  });
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentAarav.id,
      subjectId: subChem.id,
      marksObtained: 89,
      maxMarks: 100,
      grade: 'A2',
      remarks: 'Very good in organic chemistry equations.',
    },
  });
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentAarav.id,
      subjectId: subEnglish.id,
      marksObtained: 94,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Expressive vocabulary and essay structure.',
    },
  });
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentAarav.id,
      subjectId: subCS.id,
      marksObtained: 98,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Top score in Python & data structures project.',
    },
  });

  // Marks for Sneha Patel
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentSneha.id,
      subjectId: subMath.id,
      marksObtained: 94,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Very strong in algebra and trigonometry.',
    },
  });
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentSneha.id,
      subjectId: subPhysics.id,
      marksObtained: 95,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Outstanding performance in mechanics.',
    },
  });
  await prisma.examResult.create({
    data: {
      examId: examMidTerm.id,
      studentId: studentSneha.id,
      subjectId: subCS.id,
      marksObtained: 96,
      maxMarks: 100,
      grade: 'A1',
      remarks: 'Exceptional UI design and web programming.',
    },
  });

  // 13. School Circulars & Notices
  await prisma.schoolNotice.create({
    data: {
      title: '🏆 Annual Inter-School Science & Robotics Fest 2026',
      content: 'We invite students from Grades 8 to 12 to register their AI, Robotics, and Environmental innovation projects for the annual symposium on October 15.',
      targetAudience: 'ALL',
      isPinned: true,
      authorName: 'Office of the Principal',
    },
  });

  await prisma.schoolNotice.create({
    data: {
      title: '📅 Term 1 Parent-Teacher Meeting (PTM) Schedule',
      content: 'The 1-on-1 Parent-Teacher conference for Grade 10 students will be held on Saturday from 9:00 AM to 1:30 PM. Parents can download report cards from the portal.',
      targetAudience: 'PARENTS',
      isPinned: true,
      authorName: 'Academic Coordination Committee',
    },
  });

  await prisma.schoolNotice.create({
    data: {
      title: '💳 Term 2 Fee Payment Gateway Now Open',
      content: 'Term 2 academic and transport fee payment window is now active on the Parent Portal. Please clear dues before October 31 to avoid late charges.',
      targetAudience: 'PARENTS',
      isPinned: false,
      authorName: 'Accounts & Finance Department',
    },
  });

  console.log('✅ EduNova School ERP & SIS database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
