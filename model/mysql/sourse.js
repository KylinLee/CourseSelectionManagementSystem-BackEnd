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
        return this.knex("teacher")
            .select("uid", "name", "institute")
            .cache(MINUTE);
    }

    getCourses() {
        return this.knex("course")
            .select("*")
            .then((courses) => {
                // const res = [];
                const res = courses.map((course) => {
                    const {
                        course_id: courseId,
                        course_name: courseName,
                        time,
                        location,
                        required: require,
                        owner_institute: ownerInstitute,
                        max_students: maxStudents
                    } = course;
                    return {
                        courseId,
                        courseName,
                        time,
                        location,
                        require,
                        ownerInstitute,
                        maxStudents
                    };
                });
                return res;
            });
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

    /* 将课程和可选专业关联 */
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

    /* 将课程从可选专业移除 */
    removeFromChooseMajor(courseId) {
        return this.knex("major_can_course_choose")
            .where("course", courseId)
            .del();
    }

    /* 添加教师 */
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

    /* 添加学生 */
    addStudent(student) {
        return this.knex("student")
            .insert(student)
            .then(() => {
                return student.uid;
            })
            .catch(() => {
                return "0";
            });
    }

    /* 列出课程所有教师 */
    listTeacher(courseId) {
        return this.knex("courseid_teacher_name")
            .select("name")
            .where("course_course_id", courseId)
            .then((teachers) => {
                return teachers.map((teacher) => {
                    return teacher.name;
                });
            });
    }

    /* 列出课程可选年级 */
    listGrade(courseId) {
        return this.knex("grade_can_course_choose")
            .select("grade")
            .where("course", courseId)
            .then((grades) => {
                return grades.map((grade) => {
                    return grade.grade;
                });
            });
    }

    /* 列出课程可选专业 */
    listMajor(courseId) {
        return this.knex("courseid_major_name")
            .select("major")
            .where("course", courseId)
            .then((majors) => {
                return majors.map((major) => {
                    return major.major;
                });
            });
    }

    /* 学生：获取个人课程及成绩 */
    getPersonalCourse(studentId) {
        return this.knex("student_choose_course")
            .select("*")
            .join(
                "course",
                "student_choose_course.course_course_id",
                "course.course_id"
            )
            .where("student_uid", studentId)
            .then((courses) => {
                const res = courses.map((course) => {
                    const {
                        course_id: courseId,
                        course_name: courseName,
                        time,
                        location,
                        required: require,
                        normal_grades: normalGrades,
                        final_grades: finalGrades
                    } = course;
                    return {
                        courseId,
                        courseName,
                        time,
                        location,
                        require,
                        normalGrades,
                        finalGrades
                    };
                });
                return res;
            });
    }

    /* 教师：获取某课程学生成绩 */
    getStudentsGrades() {
        return this.knex("courseid_student_info")
            .select("*")
            .then((infos) => {
                const res = infos.map((info) => {
                    const {
                        uid: studentId,
                        name,
                        institute,
                        major,
                        final_grades: finalGrades,
                        normal_grades: normalGrades
                    } = info;
                    return {
                        studentId,
                        name,
                        institute,
                        major,
                        finalGrades,
                        normalGrades
                    };
                });
                return res;
            });
    }

    /* 获取专业及对应编号 */
    getMajors() {
        return this.knex("major").select("*");
    }

    getGrades() {
        return this.knex("grade").select("*");
    }
}

module.exports = MyDatabase;
