//All of the knowledge for GraphQL with the app
//How each object is related to each other

const graphql = require('graphql')
const axios = require('axios')

const host = `http://localhost:3000`

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
} = graphql

const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields: () => ({
        id: { type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args) {
                return axios.get(`${host}/companies/${parentValue.id}/users`).then(res => res.data)
            }
        }
    })
})

//This instructs GraphQL what a user object is
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {  //Needs a resolve function to associate the data
            type: CompanyType,
            resolve(parentValue, args) {
               return  axios.get(`${host}/companies/${parentValue.companyId }`).then(res => res.data)
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString  } },
            resolve(parentValue, args) {
               return axios.get( `${host}/users/${args.id}`).then(response => response.data)
            }
        },
        company: {
            type: CompanyType,
            args: {id: {type:GraphQLString}},
            resolve(parentValue, args) {
                return axios.get(`${host}/companies/${args.id}`).then(response => response.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})