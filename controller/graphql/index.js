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
        }
    }
};

module.exports = resolvers;
