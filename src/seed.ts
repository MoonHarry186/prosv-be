import mongoose from "mongoose";
import { Course } from "./models/Course";
import { User } from "./models/User";
import { Assignment } from "./models/Assignment";
import { StudyStatistic } from "./models/StudyStatistic";
import { PomodoroSession } from "./models/PomodoroSession";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/prosv_test";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // 1. Clear ALL data except Users
    console.log(
      "Clearing all existing data (Courses, Assignments, Stats, Sessions)...",
    );
    await Course.deleteMany({});
    await Assignment.deleteMany({});
    await StudyStatistic.deleteMany({});
    await PomodoroSession.deleteMany({});

    let users = await User.find();
    if (users.length === 0) {
      console.log("No users found. Creating superadmin user...");
      const adminEmail = process.env.ADMIN_EMAIL || "admin@prosv.com";
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

      const superadmin = await User.create({
        email: adminEmail,
        password_hash: adminPassword, // Will be hashed by pre-save hook
        full_name: "Super Admin",
        role: "superadmin",
        is_verified: true,
      });
      console.log(`Superadmin created: ${superadmin.email}`);
      users = [superadmin];
    }

    console.log(
      `Found ${users.length} users. Seeding 10 courses and 120 assignments each.`,
    );

    const courseNames = [
      "Cấu trúc dữ liệu và giải thuật",
      "Cơ sở dữ liệu",
      "Mạng máy tính",
      "Hệ điều hành",
      "Lập trình Web",
      "Lập trình di động",
      "Trí tuệ nhân tạo",
      "Học máy",
      "Kỹ thuật phần mềm",
      "Kiến trúc máy tính",
    ];

    const assignmentTitles = [
      "Bài tập về nhà tuần 1",
      "Báo cáo thực hành 1",
      "Kiểm tra giữa kỳ",
      "Dự án nhóm phần 1",
      "Bài tập lập trình số 1",
      "Phân tích yêu cầu",
      "Thiết kế database",
      "Viết tài liệu hướng dẫn",
      "Fix bug và tối ưu code",
      "Triển khai ứng dụng",
      "Báo cáo cuối kỳ",
      "Kiểm tra chương 1",
    ];

    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#F43F5E",
      "#6366F1",
      "#64748B",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
      "#F97316",
    ];

    for (const user of users) {
      console.log(`Seeding for user: ${user.email}...`);

      // Create 10 Courses
      const courses = [];
      for (let i = 0; i < 10; i++) {
        courses.push({
          user_id: user._id,
          course_name: courseNames[i],
          course_code: `CS${200 + i}`,
          instructor_name: `GV. Nguyễn Văn ${String.fromCharCode(65 + i)}`,
          credits: 3,
          semester: "Học kỳ 1",
          academic_year: "2024-2025",
          color: colors[i],
          status: "active",
          schedule: [
            {
              day: ["Mon", "Tue", "Wed", "Thu", "Fri"][i % 5],
              start_time: "08:00",
              end_time: "11:00",
            },
          ],
        });
      }
      const createdCourses = await Course.insertMany(courses);
      console.log(`- Seeded 10 courses for ${user.email}`);

      // Create 12 pending assignments for each course (Total 120)
      const assignments = [];
      for (const course of createdCourses) {
        for (let j = 0; j < 12; j++) {
          const deadline = new Date();
          deadline.setDate(deadline.getDate() + (j + 1) * 3); // 3 days apart

          assignments.push({
            course_id: course._id,
            title: `${assignmentTitles[j]}`,
            description: `Yêu cầu chi tiết cho ${assignmentTitles[j]} của môn ${course.course_name}.`,
            deadline: deadline,
            status: "pending",
            priority: j % 3 === 0 ? "high" : j % 3 === 1 ? "medium" : "low",
          });
        }
      }
      await Assignment.insertMany(assignments);
      console.log(`- Seeded 120 pending assignments for ${user.email}`);

      // Optional: Add some basic stats so Dashboard doesn't look empty
      const stats = [];
      for (let i = 0; i < 7; i++) {
        const studyDate = new Date();
        studyDate.setDate(studyDate.getDate() - i);
        studyDate.setHours(0, 0, 0, 0);

        const course = createdCourses[i % createdCourses.length];
        stats.push({
          user_id: user._id,
          course_id: course._id,
          total_study_hours: Math.random() * 2 + 1,
          completed_tasks: 0,
          study_date: studyDate,
        });
      }
      await StudyStatistic.insertMany(stats);
    }

    console.log("Successfully cleared and re-seeded all data!");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();

