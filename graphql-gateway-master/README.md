# graphql-gateway

[![Build Status](https://travis-ci.com/500px/graphql-gateway.svg?token=6jEypwsxJx62d9vENJaP&branch=master)](https://travis-ci.com/500px/graphql-gateway)

# Run the GraphQL gateway locally

1. Decide which environment you would like to use (we will refer it as `<ENV_NAME>` in the rest of this document:
	* `j79-development` (default enviroment): the development sandbox.
	* `j79-staging` : an isolated staging enviroment with production data replicas.
	* `j79-production`: the real production enviroment with live production data.

2. Run GraphQL locally with remote EKS cluster (Note: we are using teleprescence VPN tunnel, and thus you have disconnect from all VPNs first).

	```
	./local-dev.sh <ENV_NAME>
	```

# Automated code generation

## Microservice

Arguments available for this generator:

| Argument| Mandatory? | Description  |
| ------------- |:-------------:| ------ |
| `--type` | YES | Always be `microservice` |
| `--microservice` | YES | The hostname of the microservice |


For example, to generate a microservice, served by internal hostname of `photo-demo`, please run the command below:

```
yarn generate --type microservice --microservice photo-demo
```

This command will generate the following files:

```
.
+-- src
    +-- data_sources
    |   +-- photo_demo
    |       +-- index.js
    |       +-- __test__
    |           +-- index.test.js
    +-- resolvers
        +-- photo_demo
            +-- index.js
            +-- __test__
                +-- index.test.js
```


## Resource from a microservice

Arguments available for this generator:

| Argument| Mandatory? | Description  |
| ------------- |:-------------:| ------ |
| `--type` | YES | Always be `resource` |
| `--microservice` | YES | The hostname of the microservice |
| `--resource` | YES | The name of resource in Pascal case  |

For example, to generate a resource named `Photo` supported by the `photo-demo` microserivce in the example above, please run the command below:

```
yarn generate --type resource --microservice photo-demo --resource Photo
```

This command will generate/update the following files:

```
.
+-- src
    +-- data_sources
    |   +-- photo_demo
    |       +-- index.js (update only)
    |       +-- photo.js
    |       +-- __test__
    |           +-- index.test.js (update only)
    |           +-- photo.test.js
    +-- resolvers
    |   +-- photo_demo
    |       +-- index.js (update only)
    |       +-- photo.js
    |       +-- __test__
    |           +-- index.test.js (update only)
    |           +-- photo.test.js
    +-- schemas
        +-- photo_demo
            +-- photo.graphqls
```

## One-to-many association from one resource to another resource

Arguments available for this generator:

| Argument| Mandatory? | Description  |
| ------------- |:-------------:| ------ |
| `--type` | YES | Always be `association` |
| `--resource` | YES | The name of resource on the left side of one-to-many association|
| `--microservice` | YES | The hostname of the microservice hosting the resource on left side of one-to-many association |
| `--associated-resource` | YES | The name of resource on the right side of one-to-many association  |
| `--associated-microservice` |  | The hostname of the microservice hosting the resource on right side of one-to-many association. It will default to the value of `--microservice`, if not provided. |
| `--association-microservice` |  | The hostname of the microservice hosting the assocations between two resources. It will default to the value of `--associated-microservice`, if not provided. |
| `--database` | | Either `mysql` (default) or `ddb` to indicate the underlying database type. This will affect how the pagination is done in the microservice datasource.  |
| `--prefix` | | An optional adjective or a compound adjective to describe the context of this one-to-many association, in case there are multiple one-to-many associations exist between two resources.  |
| `--with-edge-info` | | Whether to create a specialized connection to carry extra edge information. It will default to false.  |

For example, to generate an one-to-many association, from the `Quest` resource (from the `quest-demo` microserivce), to the `Photo` resource (from the `photo-demo` microserivce), please run the command below:

```
yarn generate --type association --microservice quest-demo --resource Quest --prefix submitted --associated-resource Photo --associated-microservice photo-demo
```

This command will generate/update the following files:

```
.
+-- src
    +-- data_sources
    |   +-- photo_demo
    |       +-- index.js (update only)
    |       +-- submitted_photos_on_quest.js
    |       +-- __test__
    |           +-- submitted_photos_on_quest.test.js
    +-- resolvers
        +-- photo_demo
            +-- index.js (update only)
            +-- submitted_photos_on_quest.js
            +-- __test__
                +-- submitted_photos_on_quest.test.js
```

The generator will produce some code segments to instruct how to update GraphQL schema files, for example:

```
# ------------------------------------------
# Please update src/schemas/query.graphqls
# using the following content
# ------------------------------------------

type Query {
  # Any existing quries in the schema...

  submittedPhotosOnQuest(
    questLegacyId: ID!
    first: Int = 10
    after: String
  ) : PhotoConnection
}
```

## Resource feed

Arguments available for this generator:

| Argument| Mandatory? | Description  |
| ------------- |:-------------:| ------ |
| `--type` | YES | Always be `feed` |
| `--resource` | YES | The name of resource in the feed |
| `--microservice` | YES | The hostname of the microservice hosting the resource |
| `--feed-microservice` |  | The hostname of the microservice hosting the feed. It will default to the value of `microservice`, if not provided. |
| `--prefix` | | An optional adjective or a compound adjective to describe the context of this feed, in case there are multiple feeds on the same resource.  |
| `--personalized` |  | Whether this feed is personalized for a specific logged-in user only |

For example, to generate a public feed of `Quest` resources, from the `quest-demo` microserivce, please run the command below:

```
yarn generate --type feed --microservice quest-demo --resource Quest
```

This command will generate/update the following files:

```
.
+-- src
    +-- data_sources
    |   +-- quest_demo
    |       +-- index.js (update only)
    |       +-- quest_feed.js
    |       +-- __test__
    |           +-- quest_feed.test.js
    +-- resolvers
        +-- quest_demo
            +-- index.js (update only)
            +-- quest_feed.js
            +-- __test__
                +-- quest_feed.test.js
```


The generator will produce some code segments to instruct how to update GraphQL schema files, for example:

```
# ------------------------------------------
# Please update src/schemas/query.graphqls
# using the following content
# ------------------------------------------

type Query {
  # Any existing quries in the schema...

  questFeed(
    first: Int = 10
    after: String
  ) : QuestConnection
}
```

Another example of generating a personalized feed of `Photo` resources (in the `photo-demo` microservice) from the feed in  `licensing-demo` microserivce, please run the command below:

```
yarn generate --type feed --microservice photo-demo --resource Photo --feed-microservice licensing-demo --prefix licensing-candidate
```

This command will generate/update the following files:

```
.
+-- src
    +-- data_sources
    |   +-- licensing_demo
    |       +-- index.js (update only)
    |       +-- my_licensing_candidate_photos.js
    |       +-- __test__
    |           +-- my_licensing_candidate_photos.test.js
    +-- resolvers
        +-- licensing_demo
            +-- index.js (update only)
            +-- my_licensing_candidate_photos.js
            +-- __test__
                +-- my_licensing_candidate_photos.test.js
```


The generator will produce some code segments to instruct how to update GraphQL schema files, for example:

```
# ------------------------------------------
# Please update src/schemas/query.graphqls
# using the following content
# ------------------------------------------

type Query {
  # Any existing quries in the schema...

  licensingCandidatePhotoFeed(
    first: Int = 10
    after: String
  ) : PhotoConnectionForMyLicensingCandidatePhotos
}

# ------------------------------------------
# Please update src/schemas/photo_demo/photo.graphqls
# using the following content
# ------------------------------------------

type PhotoEdgeForMyLicensingCandidatePhotos {
  node:

  cursor: String

  # TODO: more edge fields if needed.
}

type PhotoConnectionForMyLicensingCandidatePhotos {
  edges: [EdgeForMyLicensingCandidatePhotos!]!

  pageInfo: PageInfo

  totalCount: Int
}
```

# GraphQL schema and API definitions (for Apollo or Relay clients)

* 500px GraphQL schema in SDL can be found in [`output/schema.graphql`](output/schema.graphql)
* 500px GraphQL schema in introspection format can be found in [`output/schema.json`](output/schema.json)

# Sample queries in localhost playground

* [Get ongoing/ended quests for mobile quest index view](samples/quest_feed.gql)
* [Get quest info with cover (and a few preloaded inspiration photos) for mobile quest detail view](samples/quest_detail.gql)

# Query data in `j79` environments

You can use the latest Postman client to make GraphQL quries (an experimental feature)

* URL
  * https://api.j79-dev.500px.net/graphql
  * https://api.j79-stage.500px.net/graphql
  * https://api.j79-prod.500px.net/graphql
* Method: `POST`
* Query: Please pick one of sample queries shown above.

