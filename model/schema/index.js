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
    type couseInfo {
        courseId: String
        courseName: String
        time: String
        location: String
        require: Int
        teachers: [user]
        gradeCanChoose: String
        majorCanChoose: String
    }
    type Query {
        students: [user]
        teachers: [user]
    }
    input course {
        courseId: String
        courseName: String
        time: String
        location: String
        require: Int
        gradeCanChoose: String
        majorCanChoose: String
        teachers: [String]
        maxStudents: String
        ownerInstitute: String
    }
    type Mutation {
        selectCourse(courseId: String): String
        unSelectCourse(courseId: String): String
        addCourse(course: course): String
    }
`;

module.exports = typeDefs;
