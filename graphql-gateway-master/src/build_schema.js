import {buildSchema, graphqlSync, introspectionQuery} from 'graphql';
import {SCHEMA_SDL} from './schemas';
import fs from 'fs';

const run = async () => {
  const graphqlSchemaObj = buildSchema(SCHEMA_SDL);
  const {data, errors} = graphqlSync(graphqlSchemaObj, introspectionQuery);
  if (errors) {
    console.log(`\nError detected!!! \n${errors}`);
    process.exit(-1);
  }

  fs.writeFileSync('./output/schema.json', JSON.stringify(data, null, 2));
  console.log('schema.json has been updated.');

  fs.writeFileSync('./output/schema.graphqls', SCHEMA_SDL);
  console.log('schema.graphqls has been updated.');
};

run();

