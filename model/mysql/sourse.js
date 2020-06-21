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

    unSelectCourse(uid, courseId) {
        return this.knex("student_choose_course")
            .where({
                course_course_id: courseId,
                student_uid: uid
            })
            .del()
            .then(() => {
                return courseId;
            });
    }

    addToCourse(course) {
        return this.knex("course")
            .insert({
                course_id: course.courseId,
                course_name: course.courseName,
                time: course.time,
                teachers: course.teachers,
                required: course.require,
                location: course.location,
                owner_institute: course.ownerInstitute,
                max_students: course.maxStudents
            })
            .then();
    }

    addToTeacherTeachCourse(teachers, courseId) {
        const relation = [];
        for (const teacher of teachers) {
            relation.push({
                course_course_id: courseId,
                teacher_uid: teacher
            });
        }
        return this.knex("teacher_teach_course").insert(relation);
    }

    addToChooseGrade(grades, courseId) {
        const relation = [];
        for (const grade of grades) {
            relation.push({ grade: grade, course: courseId });
        }
        return this.knex("grade_can_course_choose").insert(relation);
    }

    addToChooseMajor(majors, courseId) {
        const relation = [];
        for (const major of majors) {
            relation.push({ major: major, course: courseId });
        }
    }
}

module.exports = MyDatabase;
