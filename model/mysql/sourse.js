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
                return "0";
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
                required: course.require,
                location: course.location,
                owner_institute: course.ownerInstitute,
                max_students: course.maxStudents
            })
            .catch(() => {
                return "0";
            });
    }

    removeFromCourse(courseId) {
        return this.knex("course").where("course_id", courseId).del();
    }

    addToTeacherTeachCourse(teachers, courseId) {
        const relation = [];
        for (const teacher of teachers) {
            relation.push({
                course_course_id: courseId,
                teacher_uid: teacher
            });
        }
        return this.knex("teacher_teach_course")
            .insert(relation)
            .catch(() => {
                return "0";
            });
    }

    removeFromTeachCourse(courseId) {
        return this.knex("teacher_teach_course")
            .where("course_course_id", courseId)
            .del();
    }

    addToChooseGrade(grades, courseId) {
        const relation = [];
        for (const grade of grades) {
            relation.push({ grade: grade, course: courseId });
        }
        return this.knex("grade_can_course_choose")
            .insert(relation)
            .catch(() => {
                return "0";
            });
    }

    removeFromChooseGrade(courseId) {
        return this.knex("grade_can_course_choose")
            .where("course", courseId)
            .del();
    }

    addToChooseMajor(majors, courseId) {
        const relation = [];
        for (const major of majors) {
            relation.push({ major: major, course: courseId });
        }
        return this.knex("major_can_course_choose")
            .insert(relation)
            .catch(() => {
                return "0";
            });
    }

    removeFromChooseMajor(courseId) {
        return this.knex("major_can_course_choose")
            .where("course", courseId)
            .del();
    }

    addTeacher(teacher) {
        return this.knex("teacher")
            .insert(teacher)
            .then(() => {
                return teacher.uid;
            })
            .catch(() => {
                return "0";
            });
    }

    addStudent(student) {
        return this.knex("student")
            .insert(student)
            .then(() => {
                return student.uid;
            })
            .catch((e) => {
                console.log(e);
                return "0";
            });
    }
}

module.exports = MyDatabase;
