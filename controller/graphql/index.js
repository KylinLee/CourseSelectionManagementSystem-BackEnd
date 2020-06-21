const resolvers = {
    Query: {
        async students(_source, _args, { dataSources }) {
            return dataSources.db.getStudents();
        },
        async teachers(_source, _args, { dataSources }) {
            return dataSources.db.getTeachers();
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
            return Promise.all([courseRes, teachRes, gradeRes, majorRes])
                .then(() => {
                    return courseId;
                })
                .catch(() => {
                    return this.removeCourse(courseId);
                });
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
            return Promise.all([majorRes, teachRes, gradeRes, courseRes])
                .then(() => {
                    return _args.courseId;
                })
                .catch((e) => {
                    return "0";
                });
        }
    }
};

module.exports = resolvers;
