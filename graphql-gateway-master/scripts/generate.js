import pluralize from 'pluralize';
import {snakeCase, camelCase, pascalCase} from 'change-case';
import commandLineArgs from 'command-line-args';
import fs from 'fs';
import replace from 'replace';
import { continueStatement } from '@babel/types';

const optionDefinitions = [
  {name: 'type', alias: 't', type: String},
  {name: 'database', alias: 'k', type: String},
  {name: 'microservice', alias: 'm', type: String},
  {name: 'feed-microservice', alias: 'f', type: String},
  {name: 'association-microservice', type: String},
  {name: 'resource', alias: 'r', type: String},
  {name: 'prefix', alias: 'x', type: String},
  {name: 'associated-microservice', alias: 's', type: String},
  {name: 'associated-resource', alias: 'a', type: String},
  {name: 'dry', alias: 'd', type: Boolean},
  {name: 'personalized', alias: 'p', type: Boolean},
  {name: 'batchable', alias: 'b', type: Boolean},
  {name: 'with-edge-info', alias: 'e', type: Boolean},
];

const options = commandLineArgs(optionDefinitions);
console.log(options);

/**
 *
 * @param {string} path
 */
function contentFromTemplate(path, {microservice, resourceType, associatedMicroservice, associatedResourceType,
  prefix, feedMicroservice, className, associationMicroservice}) {
  const template = fs.readFileSync(path, 'utf8');

  const content = template.
    replace(/__CLASS_NAME__/g, className).
    replace(/__CLASS_NAME_SNAKECASE__/g, snakeCase(className)).
    replace(/__CLASS_NAME_CAMELCASE__/g, camelCase(className)).
    replace(/__PREFIX__/g, prefix).
    replace(/__MICROSERVICE__/g, microservice).
    replace(/__MICROSERVICE_PASCALCASE__/g, pascalCase(microservice)).
    replace(/__MICROSERVICE_SNAKECASE__/g, snakeCase(microservice)).
    replace(/__RESOURCE_TYPE_PASCALCASE__/g, pascalCase(resourceType)).
    replace(/__RESOURCE_TYPE_PASCALCASE_PLURALIZED__/g, pluralize(pascalCase(resourceType))).
    replace(/__RESOURCE_TYPE_CAMELCASE__/g, camelCase(resourceType)).
    replace(/__RESOURCE_TYPE_CAMELCASE_PLURALIZED__/g, pluralize(camelCase(resourceType))).
    replace(/__RESOURCE_TYPE_SNAKECASE__/g, snakeCase(resourceType)).
    replace(/__RESOURCE_TYPE_SNAKECASE_PLURALIZED__/g, pluralize(snakeCase(resourceType))).
    replace(/__PREFIXED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__/g, camelCase(`${prefix || ''}${pluralize(pascalCase(resourceType))}`)).
    replace(/__PREFIXED_RESOURCE_TYPE_PASCALCASE_PLURALIZED__/g, pascalCase(`${prefix || ''}${pluralize(pascalCase(resourceType))}`)).
    replace(/__ASSOCIATED_MICROSERVICE_PASCALCASE__/g, pascalCase(associatedMicroservice)).
    replace(/__ASSOCIATED_MICROSERVICE_SNAKECASE__/g, snakeCase(associatedMicroservice)).
    replace(/__ASSOCIATED_RESOURCE_TYPE_PASCALCASE__/g, pascalCase(associatedResourceType)).
    replace(/__ASSOCIATED_RESOURCE_TYPE_PASCALCASE_PLURALIZED__/g, pluralize(pascalCase(associatedResourceType))).
    replace(/__ASSOCIATED_RESOURCE_TYPE_SNAKECASE__/g, snakeCase(associatedResourceType)).
    replace(/__ASSOCIATED_RESOURCE_TYPE_SNAKECASE_PLURALIZED__/g, pluralize(snakeCase(associatedResourceType))).
    replace(/__ASSOCIATED_RESOURCE_TYPE_CAMELCASE__/g, camelCase(associatedResourceType)).
    replace(/__ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__/g, pluralize(camelCase(associatedResourceType))).
    replace(/__ASSOCIATION_MICROSERVICE__/g, associationMicroservice).
    replace(/__ASSOCIATION_MICROSERVICE_PASCALCASE__/g, pascalCase(associationMicroservice)).
    replace(/__PREFIXED_ASSOCIATED_RESOURCE_TYPE_CAMELCASE_PLURALIZED__/g, camelCase(`${prefix || ''}${pluralize(pascalCase(associatedResourceType))}`)).
    replace(/__PREFIXED_ASSOCIATED_RESOURCE_TYPE_PASCALCASE__/g, pascalCase(`${prefix || ''}${pascalCase(associatedResourceType)}`)).
    replace(/__PREFIXED_ASSOCIATED_RESOURCE_TYPE_PASCALCASE_PLURALIZED__/g, pascalCase(`${prefix || ''}${pluralize(pascalCase(associatedResourceType))}`)).
    replace(/__FEED_MICROSERVICE__/g, feedMicroservice).
    replace(/__FEED_MICROSERVICE_PASCALCASE__/g, pascalCase(feedMicroservice));
  return content;
}

function createFileFromTemplate(targetPath, templatePath, templatePayload) {
  if (fs.existsSync(targetPath)) {
    console.log(`${targetPath} already exists!`);
    // return;
  }
  console.log(`Generating ${targetPath}...`);
  fs.writeFileSync(targetPath, contentFromTemplate(templatePath, templatePayload));
}

function checkMicroserviceDir(microservice) {
  const microserviceDataSourcesDir = `./src/data_sources/${snakeCase(microservice)}`;
  if (!fs.existsSync(microserviceDataSourcesDir)) {
    console.log(`${microserviceDataSourcesDir} does not exist yet!
Please run the following command first:

  yarn generate --type microservice --microservice ${microservice}
`);
  } else {
    return microserviceDataSourcesDir;
  }
}

switch (options.type) {
  case 'microservice': {
    const {microservice} = options;

    const className = pascalCase(microservice);

    const templatePayload = {
      className,
      microservice,
    };

    const microserviceDataSourcesDir = `./src/data_sources/${snakeCase(microservice)}`;
    if (fs.existsSync(microserviceDataSourcesDir)) {
      console.log(`${microserviceDataSourcesDir} already exists!`);
    } else {
      fs.mkdirSync(microserviceDataSourcesDir);
      fs.mkdirSync(`${microserviceDataSourcesDir}/__test__`);
    }

    const dataSourcesIndexPath = `${microserviceDataSourcesDir}/index.js`;
    createFileFromTemplate(dataSourcesIndexPath,
      './scripts/templates/microservice/data_sources/index.js',
      templatePayload,
    );

    const dataSourcesIndexTestPath = `${microserviceDataSourcesDir}/__test__/index.test.js`;
    createFileFromTemplate(dataSourcesIndexTestPath,
      './scripts/templates/microservice/data_sources/__test__/index.test.js',
      templatePayload,
    );

    const microserviceResolversDir = `./src/resolvers/${snakeCase(microservice)}`;
    if (fs.existsSync(microserviceResolversDir)) {
      console.log(`${microserviceResolversDir} already exists!`);
    } else {
      fs.mkdirSync(microserviceResolversDir);
      fs.mkdirSync(`${microserviceResolversDir}/__test__`);
    }

    const resolversIndexPath = `${microserviceResolversDir}/index.js`;
    createFileFromTemplate(resolversIndexPath,
      './scripts/templates/microservice/resolvers/index.js',
      templatePayload,
    );

    const resolversIndexTestPath = `${microserviceResolversDir}/__test__/index.test.js`;
    createFileFromTemplate(resolversIndexTestPath,
      './scripts/templates/microservice/resolvers/__test__/index.test.js',
      templatePayload,
      );

    const microserviceSchemasPath = `./src/schemas/${snakeCase(microservice)}`;
    if (fs.existsSync(microserviceSchemasPath)) {
      console.log(`${microserviceSchemasPath} already exists!`);
    } else {
      fs.mkdirSync(microserviceSchemasPath);
    }

    break;
  }

  case 'resource': {
    const resourceType = options.resource;
    const microservice = options.microservice;

    const microserviceDataSourcesDir = `./src/data_sources/${snakeCase(microservice)}`;
    if (!fs.existsSync(microserviceDataSourcesDir)) {
      console.log(`${microserviceDataSourcesDir} does not exist yet!
Please run the following command first:

    yarn generate --type microservice --microservice ${snakeCase(microservice)}
`);
      break;
    }

    const className = pascalCase(resourceType);
    const objectName = camelCase(className);
    const targetFilename = snakeCase(className);

    const templatePayload = {
      className,
      microservice,
      resourceType,
    };

    const dataSourcePath = `${microserviceDataSourcesDir}/${targetFilename}.js`;
    createFileFromTemplate(
      dataSourcePath,
      './scripts/templates/resource/data_sources/node.js',
      templatePayload,
    );

    const dataSourceTestPath = `${microserviceDataSourcesDir}/__test__/${targetFilename}.test.js`;
    createFileFromTemplate(dataSourceTestPath,
      './scripts/templates/resource/data_sources/__test__/node.test.js',
      templatePayload,
    );

    console.log(`Updating ${microserviceDataSourcesDir}/index.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {${className}} from './${targetFilename}';\n$1`,
      paths: [`${microserviceDataSourcesDir}/index.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO DATASOURCE ==\s*\*\/)/m,
      replacement: `$1${objectName}: new ${className}(),\n$1$2`,
      paths: [`${microserviceDataSourcesDir}/index.js`],
      silent: true,
    });

    const microserviceResolversDir = `./src/resolvers/${snakeCase(microservice)}`;
    const resolverPath = `${microserviceResolversDir}/${targetFilename}.js`;
    createFileFromTemplate(resolverPath,
      './scripts/templates/resource/resolvers/node.js',
      templatePayload,
    );

    const resolverTestPath = `${microserviceResolversDir}/__test__/${targetFilename}.test.js`;
    createFileFromTemplate(resolverTestPath,
      './scripts/templates/resource/resolvers/__test__/node.test.js', templatePayload,
    );

    console.log(`Updating ${microserviceResolversDir}/index.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {resolvers as ${objectName}Resolvers} from './${targetFilename}';\n$1`,
      paths: [`${microserviceResolversDir}/index.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO RESOLVER ==\s*\*\/)/m,
      replacement: `$1${objectName}Resolvers,\n$1$2`,
      paths: [`${microserviceResolversDir}/index.js`],
      silent: true,
    });

    console.log(`Updating ${microserviceResolversDir}/__test__/index.test.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {resolvers as ${objectName}Resolvers} from '../${targetFilename}';\n$1`,
      paths: [`${microserviceResolversDir}/__test__/index.test.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO RESOLVER ==\s*\*\/)/m,
      replacement: `$1${objectName}Resolvers,\n$1$2`,
      paths: [`${microserviceResolversDir}/__test__/index.test.js`],
      silent: true,
    });

    const schemasPath = `./src/schemas/${snakeCase(microservice)}`;
    const schemaPath = `${schemasPath}/${targetFilename}.graphqls`;
    createFileFromTemplate(
      schemaPath,
      './scripts/templates/resource/schemas/node.graphqls',
      templatePayload,
    );

    break;
  }

  case 'association': {
    const {
      microservice,
      prefix,
      batchable,
      database,
    } = options;
    const resourceType = options.resource;
    const associatedMicroservice = options['associated-microservice'] || microservice;
    const associatedResourceType = options['associated-resource'];
    const associationMicroservice = options['association-microservice'] || associatedMicroservice;
    const withEdgeInfo = options['with-edge-info'];

    const dry = (associationMicroservice !== associatedMicroservice);

    const microserviceDataSourcesDir = checkMicroserviceDir(associationMicroservice);
    if (!microserviceDataSourcesDir) {
      break;
    }
    if (!checkMicroserviceDir(associatedMicroservice)) {
      break;
    }
    if (!checkMicroserviceDir(microservice)) {
      break;
    }

    const templatePrefixes = [];
    if (batchable) {
      templatePrefixes.push('batchable');
    }
    templatePrefixes.push(dry ? 'dry' : 'hydrated');
    if (database == 'ddb') {
      templatePrefixes.push('ddb');
    }
    const templateFilename = `${templatePrefixes.join('_')}_association`;

    const classNameSegments = [
      pluralize(pascalCase(associatedResourceType)),
      'On',
      pascalCase(resourceType),
    ];
    if (prefix) {
      classNameSegments.unshift(pascalCase(prefix));
    }
    const className = classNameSegments.join('');
    const objectName = camelCase(className);
    const targetFilename = snakeCase(className);

    const templatePayload = {
      className,
      prefix,
      microservice,
      resourceType,
      associatedMicroservice,
      associatedResourceType,
      associationMicroservice,
    };

    const dataSourcePath = `${microserviceDataSourcesDir}/${targetFilename}.js`;
    createFileFromTemplate(
      dataSourcePath,
      `./scripts/templates/association/data_sources/${templateFilename}.js`,
      templatePayload,
    );

    console.log(`Updating ${microserviceDataSourcesDir}/index.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {${className}} from './${targetFilename}';\n$1`,
      paths: [`${microserviceDataSourcesDir}/index.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO DATASOURCE ==\s*\*\/)/m,
      replacement: `$1${objectName}: new ${className}(),\n$1$2`,
      paths: [`${microserviceDataSourcesDir}/index.js`],
      silent: true,
    });

    const dataSourceTestPath = `${microserviceDataSourcesDir}/__test__/${targetFilename}.test.js`;
    createFileFromTemplate(
      dataSourceTestPath,
      `./scripts/templates/association/data_sources/__test__/${templateFilename}.test.js`,
      templatePayload,
    );

    const microserviceResolversDir = `./src/resolvers/${snakeCase(microservice)}`;
    const resolverPath = `${microserviceResolversDir}/${targetFilename}.js`;
    createFileFromTemplate(
      resolverPath,
      `./scripts/templates/association/resolvers/${templateFilename}.js`,
      templatePayload,
    );

    console.log(`Updating ${microserviceResolversDir}/index.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {resolvers as ${objectName}Resolvers} from './${targetFilename}';\n$1`,
      paths: [`${microserviceResolversDir}/index.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO RESOLVER ==\s*\*\/)/m,
      replacement: `$1${objectName}Resolvers,\n$1$2`,
      paths: [`${microserviceResolversDir}/index.js`],
      silent: true,
    });

    if (withEdgeInfo) {
      console.log(contentFromTemplate('./scripts/templates/association/schemas/association_with_edge_info.graphqls',
        templatePayload));
    } else {
      console.log(contentFromTemplate('./scripts/templates/association/schemas/association.graphqls',
        templatePayload));
    }

    break;
  }

  case 'feed': {
    const {
      microservice,
      personalized,
      prefix,
    } = options;
    const resourceType = options.resource;
    const withEdgeInfo = options['with-edge-info'];
    const feedMicroservice = options['feed-microservice'] || microservice;

    const feedMicroserviceDataSourcesDir = checkMicroserviceDir(feedMicroservice);
    if (!feedMicroserviceDataSourcesDir) {
      break;
    }

    if (!checkMicroserviceDir(microservice)) {
      break;
    }

    const templatePrefixes = [];
    const dry = (feedMicroservice != microservice);
    templatePrefixes.push(dry ? 'dry' : 'hydrated');
    templatePrefixes.push(personalized ? 'personalized' : 'public');
    const templateFilename = `${templatePrefixes.join('_')}_feed`;

    const classNameSegments = [];
    if (personalized) {
      classNameSegments.push('My');
      if (prefix) {
        classNameSegments.push(pascalCase(prefix));
      }
      classNameSegments.push(pascalCase(pluralize(resourceType)));
    } else {
      if (prefix) {
        classNameSegments.push(pascalCase(prefix));
      }
      classNameSegments.push(pascalCase(resourceType), 'Feed');
    }
    const className = classNameSegments.join('');
    const objectName = camelCase(className);
    const targetFilename = snakeCase(className);

    const templatePayload = {
      className,
      prefix,
      feedMicroservice,
      microservice,
      resourceType,
    };

    const dataSourcePath = `${feedMicroserviceDataSourcesDir}/${targetFilename}.js`;
    createFileFromTemplate(
      dataSourcePath,
      `./scripts/templates/feed/data_sources/${templateFilename}.js`,
      templatePayload,
    );

    console.log(`Updating ${feedMicroserviceDataSourcesDir}/index.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {${className}} from './${targetFilename}';\n$1`,
      paths: [`${feedMicroserviceDataSourcesDir}/index.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO DATASOURCE ==\s*\*\/)/m,
      replacement: `$1${objectName}: new ${className}(),\n$1$2`,
      paths: [`${feedMicroserviceDataSourcesDir}/index.js`],
      silent: true,
    });

    const dataSourceTestPath = `${feedMicroserviceDataSourcesDir}/__test__/${targetFilename}.test.js`;
    createFileFromTemplate(
      dataSourceTestPath,
      `./scripts/templates/feed/data_sources/__test__/${templateFilename}.test.js`,
      templatePayload,
    );

    const microserviceResolversDir = `./src/resolvers/${snakeCase(microservice)}`;
    const resolverPath = `${microserviceResolversDir}/${targetFilename}.js`;
    if (dry) {
      createFileFromTemplate(
        resolverPath,
        `./scripts/templates/feed/resolvers/dry_feed.js`,
        templatePayload,
      );
    } else {
      createFileFromTemplate(
        resolverPath,
        `./scripts/templates/feed/resolvers/hydrated_feed.js`,
        templatePayload,
      );
    }

    console.log(`Updating ${microserviceResolversDir}/index.js...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {resolvers as ${objectName}Resolvers} from './${targetFilename}';\n$1`,
      paths: [`${microserviceResolversDir}/index.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO RESOLVER ==\s*\*\/)/m,
      replacement: `$1${objectName}Resolvers,\n$1$2`,
      paths: [`${microserviceResolversDir}/index.js`],
      silent: true,
    });

    console.log(`Updating ${microserviceResolversDir}/__test__/index.test.jjs...`);
    replace({
      regex: /^(\/\*\s*== END OF AUTO IMPORT ==\s*\*\/)/m,
      replacement: `import {resolvers as ${objectName}Resolvers} from '../${targetFilename}';\n$1`,
      paths: [`${microserviceResolversDir}/__test__/index.test.js`],
      silent: true,
    });
    replace({
      regex: /^(\s*)(\/\*\s*== END OF AUTO RESOLVER ==\s*\*\/)/m,
      replacement: `$1${objectName}Resolvers,\n$1$2`,
      paths: [`${microserviceResolversDir}/__test__/index.test.js`],
      silent: true,
    });

    if (withEdgeInfo) {
      console.log(contentFromTemplate('./scripts/templates/feed/schemas/feed_with_edge_info.graphqls',
        templatePayload));
    } else {
      console.log(contentFromTemplate('./scripts/templates/feed/schemas/feed.graphqls',
        templatePayload));
    }

    break;
  }

  default:
    break;
}
