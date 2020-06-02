
import { mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import * as path from "path";
import * as fs from "fs";
import { makeExecutableSchema } from "graphql-tools";
import * as glob from "glob";

export const genSchema = () => {
    const pathToModules = path.join(__dirname, "../src/modules");
    const graphqlTypes = glob.sync(`${pathToModules}/**/*.graphql`).map((x: any) => fs.readFileSync(x, { encoding: "utf8" }));
    const resolvers = glob.sync(`${pathToModules}/**/resolvers.?s`).map(resolver => require(resolver).resolvers);
    const schema = makeExecutableSchema({ typeDefs: mergeTypes(graphqlTypes), resolvers: mergeResolvers(resolvers) });

    return schema
};
