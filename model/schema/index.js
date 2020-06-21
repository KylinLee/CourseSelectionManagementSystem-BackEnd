/* eslint-disable */
const { gql } = require("apollo-server-koa");

const typeDefs = gql`
    type user {
        uid: String
        name: String
        grade: Int
        institute: String
        major: String
    }
    type courseInfo {
        courseId: String
        courseName: String
        time: String
        location: String
        require: Int
        teachers: [user]
        gradeCanChoose: String
        majorCanChoose: String
    }
    type personalCourse {
        course: courseInfo
        normalGrades: Int
        finalGrades: Int
    }
    type Query {
        students: [user]
        teachers: [user]
        courses: [courseInfo]
        personalCourses(studetnId: String): [personalCourse]
    }
    input course {
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
    input teacher {
        uid: String
        name: String
        institute: String
        password: String
    }
    input student {
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
        addCourse(course: course): String
        addTeacher(teacher: teacher): String
        addStudent(student: student): String
        removeCourse(courseId: String): String
    }
`;

module.exports = typeDefs;
