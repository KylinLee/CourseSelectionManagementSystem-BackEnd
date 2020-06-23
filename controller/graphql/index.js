const resolvers = {
    CourseInfo: {
        async teachers(_source, _args, { dataSources }) {
            return dataSources.db.listTeacher(_source.courseId);
        },
        async gradeCanChoose(_source, _args, { dataSources }) {
            return dataSources.db.listGrade(_source.courseId);
        },
        async majorCanChoose(_source, _args, { dataSources }) {
            return dataSources.db.listMajor(_source.courseId);
        }
    },
    PersonalCourse: {
        async teachers(_source, _args, { dataSources }) {
            return dataSources.db.listTeacher(_source.courseId);
        }
    },
    Query: {
        async students(_source, _args, { dataSources }) {
            return dataSources.db.getStudents();
        },
        async teachers(_source, _args, { dataSources }) {
            return dataSources.db.getTeachers();
        },
        async courses(_source, _args, { dataSources }) {
            return dataSources.db.getCourses();
        },
        async personalCourses(_source, _args, { dataSources }) {
            return dataSources.db.getPersonalCourse(dataSources.db.context.uid);
        },
        async teachersStudent(_source, _args, { dataSources }) {
            return dataSources.db.getStudentsGrades();
        },
        async majors(_source, _args, { dataSources }) {
            return dataSources.db.getMajors();
        },
        async grades(_source, _args, { dataSources }) {
            return dataSources.db.getGrades();
        }
    },
    Mutation: {
        async selectCourse(_source, _args, { dataSources }) {
            return dataSources.db.selectCourse(
                dataSources.db.context.uid,
                _args.courseId
            );
        },
        async unSelectCourse(_source, _args, { dataSources }) {
            return dataSources.db.unSelectCourse(
                dataSources.db.context.uid,
                _args.courseId
            );
        },
        async addCourse(_source, _args, { dataSources }) {
            const courseRes = await dataSources.db.addToCourse(_args.course);
            const {
                courseId,
                teachers,
                gradeCanChoose,
                majorCanChoose
            } = _args.course;
            const teachRes = await dataSources.db.addToTeacherTeachCourse(
                teachers,
                courseId
            );
            const gradeRes = await dataSources.db.addToChooseGrade(
                gradeCanChoose,
                courseId
            );
            const majorRes = await dataSources.db.addToChooseMajor(
                majorCanChoose,
                courseId
            );
            if (majorRes && gradeRes && teachRes && courseRes) {
                return courseId;
            }
            return this.removeCourse(courseId);
            // 不能使用Promise.all
            // return Promise.all([courseRes, teachRes, gradeRes, majorRes])
            //     .then(() => {
            //         return courseId;
            //     })
            //     .catch(() => {
            //         return this.removeCourse(courseId);
            //     });
        },
        async addTeacher(_source, _args, { dataSources }) {
            return dataSources.db.addTeacher(_args.teacher);
        },
        async addStudent(_source, _args, { dataSources }) {
            return dataSources.db.addStudent(_args.student);
        },
        async removeCourse(_source, _args, { dataSources }) {
            const majorRes = await dataSources.db.removeFromChooseMajor(
                _args.courseId
            );
            const teachRes = await dataSources.db.removeFromTeachCourse(
                _args.courseId
            );
            const gradeRes = await dataSources.db.removeFromChooseGrade(
                _args.courseId
            );
            const courseRes = await dataSources.db.removeFromCourse(
                _args.courseId
            );
            if (majorRes && gradeRes && teachRes && courseRes) {
                return _args.courseId;
            }
            return "0";
            // 不能使用Promise.all
            // return Promise.all([courseRes, teachRes, gradeRes, majorRes])
            //     .then(() => {
            //         return courseId;
            //     })
            //     .catch(() => {
            //         return this.removeCourse(courseId);
            //     });
        }
    }
};

module.exports = resolvers;
