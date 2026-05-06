import { ApolloServer } from "@apollo/server";

import { startStandaloneServer } from "@apollo/server/standalone";


import {
	getPresidents,
	getPresidentById,
	getPeriodsByPresident,
	getPresidentsByParty,
	getPresidentsByName,
	getPresidentsByLastName,
	getPresidentFullName,
	getPresidentPeriods,
} from "./resovlers/resolvers.mjs";


const typeDefs = `
	type President {
		id: ID!
		name: String
		lastName: String
		fullName: String
		image: String
		politicalParty: String
		description: String
		startPeriodDate: String
		endPeriodDate: String
		cityId: Int
		periods: [Period!]!
	}

	type Period {
		presidentId: ID!
		startDate: String
		endDate: String
	}

	type Query {
		presidents: [President!]!
		presidentById(id: ID!): President
		periodsByPresident(presidentId: ID!): [Period!]!
		presidentsByParty(politicalParty: String!): [President!]!
		presidentsByName(name: String!): [President!]!
		presidentsByLastName(lastName: String!): [President!]!
	}
`;

const resolvers = {
	Query: {
		presidents: getPresidents,
		presidentById: getPresidentById,
		periodsByPresident: getPeriodsByPresident,
		presidentsByParty: getPresidentsByParty,
		presidentsByName: getPresidentsByName,
		presidentsByLastName: getPresidentsByLastName,
	},
	President: {
		fullName: getPresidentFullName,
		periods: getPresidentPeriods,
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`GraphQL server ready at ${url}`);