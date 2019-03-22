var express = require('express');
var {ApolloServer, gql} = require('apollo-server-express');
var {makeRemoteExecutableSchema, mergeSchemas, introspectSchema} = require('graphql-tools');
var {createApolloFetch} = require('apollo-fetch');
const {RESTDataSource} = require('apollo-datasource-rest');


class RancherAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://192.168.1.43/';
    }

    // 設定header, 由於是extend apollo實作的class, 因此不用自行呼叫這個method
    willSendRequest(request) {
        request.headers.set('Authorization', 'Basic RTA1QzJGQTVDN0Y5MUE2OTcwMTI6dEN5ZTNvM3BZNHd6ak1XV1ZES1RZU0dFRnR0ejJkVXJEbXhjWFBHVA==');
        request.headers.set('Accept', 'application/json')
    }

    async getProjects() {
        return this.get('v2-beta/projects/1a5');
    }

}

// 自動建schema (看來僅限於用GraphQL實作的API, 無法解析普通REST API)
const createRemoteSchema = async (uri) => {
    const fetcher = createApolloFetch({uri});

    fetcher.use(({request, options}, next) => {
        console.log(request);
        if (!options.headers) {
            options.headers = {};
        }
        options.headers['Authorization'] = 'Basic RTA1QzJGQTVDN0Y5MUE2OTcwMTI6dEN5ZTNvM3BZNHd6ak1XV1ZES1RZU0dFRnR0ejJkVXJEbXhjWFBHVA==';
        options.headers['Accept'] = 'application/ json';

        next();
    });

    const auto_schema = makeRemoteExecutableSchema({
        schema: await introspectSchema(fetcher),
        fetcher
    });

    return auto_schema;
};

createRemoteSchema('http://192.168.1.43/v2-beta/projects/1a5').then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
});

// 手動刻schema
const TYPEDEFS = gql`
type Query {
    test_query: Test
  }
type Test {
    id: String,
    type: String,
    name: String,
    state: String,
    created: String,
    description: String
  }
`;

const RESOLVERS = {
    Query: {
        // 傳遞來自SERVER的dataSources
        test_query: (root, args, {dataSources}) => {
            // 方法1 call REST API
            return dataSources.rancherAPI.getProjects();

            // 方法2
            // return fetch('http://192.168.1.43/v2-beta/projects/1a5', {method: 'GET',
            //     headers: {
            //         'Authorization': 'Basic RTA1QzJGQTVDN0Y5MUE2OTcwMTI6dEN5ZTNvM3BZNHd6ak1XV1ZES1RZU0dFRnR0ejJkVXJEbXhjWFBHVA==',
            //         'Accept': 'application/json'
            //     }
            // }).then(res => res.json())
        }
    }
};

const SERVER = new ApolloServer({
    typeDefs: TYPEDEFS,
    resolvers: RESOLVERS,
    playground: {
        endpoint: `http://192.168.1.44:3331/graphql`,
        settings: {
            'editor.theme': 'light'
        }
    },
    dataSources: () => ({
        rancherAPI: new RancherAPI()
    })
});

const app = express();

// Middleware: GraphQL
SERVER.applyMiddleware({
    app: app
});


app.listen(4000);
console.log('Server running. Open http://localhost:4000/graphql to run queries.');
