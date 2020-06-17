const { SQLDataSource } = require("datasource-sql");

const MINUTE = 60;

class MyDatabase extends SQLDataSource {
    getStudents() {
        return this.knex("student")
            .join("major", "student.major", "=", "major.id")
            .select(
                "student.uid",
                "student.name",
                "student.grade",
                "student.institute",
                "major.major"
            )
            .cache(MINUTE);
    }

    getTeachers() {
        return this.knex
            .select("uid", "name", "institute")
            .from("teacher")
            .cache(MINUTE);
    }

    selectCourse(uid, courseId) {
        return this.knex("student_choose_course")
            .insert({
                student_uid: uid,
                course_course_id: courseId
            })
            .then((res) => {
                return courseId;
            })
            .catch(() => {
                return 0;
            });
    }
}

module.exports = MyDatabase;
