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
            const courseRes = await dataSources.db.addToCourse(
                dataSources.db.context.course
            );
            const {
                courseId,
                teachers,
                gradeCanChoose,
                majorCanChoose
            } = dataSources.db.context.course;
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
        }
    }
};

module.exports = resolvers;
