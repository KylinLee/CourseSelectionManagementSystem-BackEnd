/* eslint-disable */
const { gql } = require("apollo-server-koa");

const typeDefs = gql`
    type User {
        uid: String
        name: String
        grade: Int
        institute: String
        major: String
    }
    type CourseInfo {
        courseId: String
        courseName: String
        time: String
        location: String
        require: Int
        teachers: [String]
        gradeCanChoose: [Int]
        majorCanChoose: [String]
        maxStudents: Int
        ownerInstitute: String
    }
    type PersonalCourse {
        courseId: String
        courseName: String
        time: String
        location: String
        require: Int
        teachers: [String]
        normalGrades: Int
        finalGrades: Int
    }
    type StudentGrades {
        name: String
        studentId: String
        institute: String
        major: String
        normalGrades: Int
        finalGrades: Int
    }
    type Major{
        id: Int,
        major: String
    }
    type Grade {
        id: Int
        grade: Int
    }
    type Query {
        students: [User]
        teachers: [User]
        courses: [CourseInfo]
        personalCourses: [PersonalCourse]
        teachersStudent: [StudentGrades]
        majors: [Major]
        grades: [Grade]
    }
    input Course {
        courseId: String
        courseName: String
        time: String
        location: String
        require: Int
        gradeCanChoose: [Int]
        majorCanChoose: [Int]
        teachers: [String]
        maxStudents: Int
        ownerInstitute: String
    }
    input Teacher {
        uid: String
        name: String
        institute: String
        password: String
    }
    input Student {
        uid: String
        name: String
        password: String
        grade: Int
        major: Int
        institute: String
    }
    type Mutation {
        selectCourse(courseId: String): String
        unSelectCourse(courseId: String): String
        addCourse(course: Course): String
        addTeacher(teacher: Teacher): String
        addStudent(student: Student): String
        removeCourse(courseId: String): String
    }
`;

module.exports = typeDefs;
