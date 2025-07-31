import yaml from 'js-yaml';

// Utility functions for 1.0 to 2.0 conversion
function toIdentifier(name) {
  if (!name) return 'unknown';
  let identifier = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')  // only lowercase alphanumeric, remove other chars
    .slice(0, 128);
  if (!identifier) return 'unknown';
  return identifier;
}

function convertTemplate(entity) {
  if (!entity || entity.kind !== 'Template') {
    throw new Error('Invalid entity or kind mismatch, expected Template');
  }

  // Filter annotations, keep only backstage.io/source-location (strip others)
  const annotations = entity.metadata?.annotations || {};
  const filteredAnnotations = {};
  for (const [key, value] of Object.entries(annotations)) {
    if (key === 'backstage.io/source-location') {
      filteredAnnotations[key] = value;
    }
  }

  // Compose metadata for IDP 2.0
  const metadata = {
    annotations: filteredAnnotations,
    tags: entity.metadata?.tags || []
  };

  // Add description if present in 1.0 metadata
  if (entity.metadata?.description) {
    metadata.description = entity.metadata.description;
  }

  // identifier from metadata.name (sanitized lowercase)
  const rawName = entity.metadata?.name || 'unknown';
  const identifier = toIdentifier(rawName);

  // Use metadata.title as name if present, else fallback to metadata.name
  const name = entity.metadata?.title || rawName;

  // Owner from spec.owner, preserve exactly as-is (e.g., user:pranay.shah)
  const owner = entity.spec?.owner || '';

  // Type promoted from spec.type, default empty string if missing
  const type = entity.spec?.type || '';

  // Copy spec except owner and type (parameters, steps, output)
  const { owner: _, type: __, ...restSpec } = entity.spec || {};

  // Compose 2.0 Workflow object
  return {
    apiVersion: 'harness.io/v1',
    kind: 'Workflow',
    type,
    identifier,
    name,
    owner,
    spec: restSpec,
    metadata
  };
}

function convertAPI(entity) {
  if (!entity || entity.kind !== 'API') {
    throw new Error('Invalid entity or kind mismatch, expected API');
  }

  // Keep only relevant annotations - filter backstage internal ones except source-location
  const annotations = entity.metadata?.annotations || {};
  const filteredAnnotations = {};
  for (const [key, value] of Object.entries(annotations)) {
    if (key === 'backstage.io/source-location') {
      filteredAnnotations[key] = value;
    }
  }

  // Compose metadata
  const metadata = {
    description: entity.metadata?.description || '',
    annotations: filteredAnnotations,
    links: entity.metadata?.links || [],
    tags: entity.metadata?.tags || []
  };

  // Compose spec with all fields excluding owner and type
  let spec = {};
  if (entity.spec) {
    const { owner, type, ...restSpec } = entity.spec;
    spec = restSpec;
    
    // Ensure definition field is properly handled
    if (entity.spec.definition) {
      // If definition is an object with $text property, preserve its structure
      if (typeof entity.spec.definition === 'object' && entity.spec.definition.$text) {
        spec.definition = { $text: entity.spec.definition.$text };
      } else {
        spec.definition = entity.spec.definition;
      }
    }
  }

  return {
    apiVersion: 'harness.io/v1',
    kind: 'API',
    type: entity.spec?.type || '',
    identifier: toIdentifier(entity.metadata?.name),
    name: entity.metadata?.name || 'unknown',
    owner: entity.spec?.owner || '',
    spec,
    metadata
  };
}

function convertResource(entity) {
  if (!entity || entity.kind !== 'Resource') {
    throw new Error('Invalid entity or kind mismatch, expected Resource');
  }
  
  // Annotation keys to exclude in 2.0 conversion
  const excludeAnnotations = [
    'backstage.io/managed-by-location',
    'backstage.io/managed-by-origin-location',
    'backstage.io/view-url',
    'backstage.io/edit-url'
  ];

  // Filter annotations: keep only those not excluded
  const annotations = entity.metadata?.annotations || {};
  const filteredAnnotations = {};
  for (const [key, value] of Object.entries(annotations)) {
    if (!excludeAnnotations.includes(key)) {
      filteredAnnotations[key] = value;
    }
  }

  // Compose metadata
  const metadata = {
    annotations: filteredAnnotations
  };

  // Copy description if it exists
  if (entity.metadata?.description) {
    metadata.description = entity.metadata.description;
  }

  // Compose spec with minimal fields from spec, excluding owner and type as they move top-level
  const spec = {};
  if (entity.spec) {
    // Include specific fields you want to preserve, e.g., lifecycle, system
    if (entity.spec.lifecycle !== undefined) spec.lifecycle = entity.spec.lifecycle;
    if (entity.spec.system !== undefined) spec.system = entity.spec.system;
  }

  return {
    apiVersion: 'harness.io/v1',
    kind: 'Resource',
    type: entity.spec?.type || '',
    identifier: toIdentifier(entity.metadata?.name),
    name: toIdentifier(entity.metadata?.name),
    owner: entity.spec?.owner || '',
    spec,
    metadata
  };
}

function convertComponent(entity) {
  if (!entity || entity.kind !== 'Component') {
    throw new Error('Invalid entity or kind mismatch, expected Component');
  }

  // Annotation keys to exclude in 2.0
  const excludeAnnotations = [
    'backstage.io/managed-by-location',
    'backstage.io/managed-by-origin-location',
    'backstage.io/view-url',
    'backstage.io/edit-url'
  ];

  // Filter annotations, keep all except excluded keys
  const annotations = entity.metadata?.annotations || {};
  const filteredAnnotations = {};
  for (const [key, value] of Object.entries(annotations)) {
    if (!excludeAnnotations.includes(key)) {
      filteredAnnotations[key] = value;
    }
  }

  // Compose metadata fields that go under metadata in 2.0
  const metadata = {
    annotations: filteredAnnotations,
    links: entity.metadata?.links || [],
    tags: entity.metadata?.tags || []
  };

  // Copy all custom metadata fields to preserve them in the 2.0 format
  // This includes fields like codeCoverageScore, harnessData, releaseVersion, etc.
  // Exclude Backstage-specific fields like uid and etag
  const preserveFields = [
    'codeCoverageScore', 
    'harnessData', 
    'releaseVersion', 
    'customField', 
    'coverage', 
    'projectIdentifier', 
    'orgIdentifier', 
    'branch', 
    'version', 
    'teamLead', 
    'customTags'
    // uid and etag are excluded as they are Backstage-specific
  ];
  
  preserveFields.forEach(field => {
    if (entity.metadata && entity.metadata[field] !== undefined) {
      metadata[field] = entity.metadata[field];
    }
  });

  // Compose spec with only needed fields (avoid duplicating owner/type)
  const spec = {};
  if (entity.spec) {
    // Explicitly handle common fields
    if (entity.spec.lifecycle !== undefined) spec.lifecycle = entity.spec.lifecycle;
    if (entity.spec.providesApis !== undefined) spec.providesApis = entity.spec.providesApis;
    if (entity.spec.domain !== undefined) spec.domain = entity.spec.domain;
    if (entity.spec.system !== undefined) spec.system = entity.spec.system;
    
    // Copy any other spec fields that should be preserved
    Object.entries(entity.spec).forEach(([key, value]) => {
      if (key !== 'owner' && key !== 'type' && spec[key] === undefined) {
        spec[key] = value;
      }
    });
  }

  return {
    apiVersion: 'harness.io/v1',
    kind: 'Component',
    type: entity.spec?.type || '',
    identifier: toIdentifier(entity.metadata?.name),
    name: toIdentifier(entity.metadata?.name),
    // Use owner from spec.owner with original casing
    owner: entity.spec?.owner || '',
    spec,
    metadata
  };
}

// Main function to convert from 1.0 to 2.0
function convertToIDP2(entity) {
  switch (entity.kind) {
    case 'Component':
      return convertComponent(entity);
    case 'Template':
      return convertTemplate(entity);
    case 'API':
      return convertAPI(entity);
    case 'Resource':
      return convertResource(entity);
    default:
      throw new Error(`Unsupported kind '${entity.kind}'. Supported kinds: Component, Template, API, Resource.`);
  }
}

// Utility functions for 2.0 to 1.0 conversion
function identifierToName(identifier) {
  if (!identifier) return 'unknown';
  return identifier;
}

/**
 * Sanitizes a name to conform to Backstage's metadata.name requirements:
 * - Only alphanumeric characters and [-_.] separators
 * - Maximum 63 characters
 * - No trailing spaces
 */
function sanitizeName(name) {
  if (!name) return 'unknown';
  
  // Trim spaces
  let sanitized = name.trim();
  
  // Replace invalid characters with dashes
  sanitized = sanitized.replace(/[^a-zA-Z0-9\-_\.]/g, '-');
  
  // Ensure it's not longer than 63 characters
  sanitized = sanitized.slice(0, 63);
  
  return sanitized || 'unknown';
}

function restoreAnnotations(annotations) {
  return annotations || {};
}

/**
 * Restore relations if present, else don't include the field.
 * This avoids adding empty arrays that might cause validation issues.
 */
function restoreRelations(entity) {
  if (entity.relations && entity.relations.length > 0) {
    return entity.relations;
  }
  // Return undefined so the field won't be included if empty
  return undefined;
}

function convertWorkflowToTemplate(entity) {
  if (!entity || entity.kind !== 'Workflow') {
    throw new Error('Expected kind Workflow');
  }

  // Ensure we have a valid name
  const name = entity.name || identifierToName(entity.identifier) || 'unknown';

  // Create metadata object with required fields
  const metadata = {
    name: sanitizeName(name),
    title: entity.name || name,
    description: entity.metadata?.description || '',
    annotations: restoreAnnotations(entity.metadata?.annotations),
    tags: entity.metadata?.tags || [],
    namespace: 'default' // Always include namespace
  };

  // Copy all other metadata fields that might be present
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      if (!['annotations', 'tags', 'description'].includes(key)) {
        metadata[key] = value;
      }
    });
  }

  // Create the spec object
  const spec = {
    owner: entity.owner || '',
    type: entity.type || ''
  };

  // Copy all spec fields from the 2.0 entity
  if (entity.spec) {
    Object.entries(entity.spec).forEach(([key, value]) => {
      spec[key] = value;
    });
  }

  // Create the complete 1.0 Template object
  const template = {
    apiVersion: 'scaffolder.backstage.io/v1beta3',
    kind: 'Template',
    metadata: metadata,
    spec: spec
  };

  return template;
}

function convertAPIToIDP1(entity) {
  if (!entity || entity.kind !== 'API') {
    throw new Error('Expected kind API');
  }

  // Ensure we have a valid name
  const name = entity.name || identifierToName(entity.identifier) || 'unknown';

  // Create metadata object with required fields
  const metadata = {
    name: name,
    namespace: 'default', // Always include namespace
    description: entity.metadata?.description || ''
  };

  // Add annotations if present
  if (entity.metadata?.annotations && Object.keys(entity.metadata.annotations).length > 0) {
    metadata.annotations = entity.metadata.annotations;
  }

  // Add tags if present
  if (entity.metadata?.tags && entity.metadata.tags.length > 0) {
    metadata.tags = entity.metadata.tags;
  }

  // Add links if present
  if (entity.metadata?.links && entity.metadata.links.length > 0) {
    metadata.links = entity.metadata.links;
  }

  // Copy all other metadata fields that might be present
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      if (!['annotations', 'tags', 'description', 'links'].includes(key)) {
        metadata[key] = value;
      }
    });
  }

  // Create the 1.0 API object
  const api = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: metadata
  };

  // Add spec section with required fields
  api.spec = {
    owner: entity.owner || '',
    type: entity.type || ''
  };

  // Add any additional spec fields from 2.0
  if (entity.spec) {
    Object.entries(entity.spec).forEach(([key, value]) => {
      if (!api.spec[key]) {
        api.spec[key] = value;
      }
    });
    
    // Ensure definition field is properly handled
    if (entity.spec.definition) {
      // If definition is an object with $text property, preserve its structure
      if (typeof entity.spec.definition === 'object' && entity.spec.definition.$text) {
        api.spec.definition = { $text: entity.spec.definition.$text };
      } else {
        api.spec.definition = entity.spec.definition;
      }
    }
  }

  return api;
}

function convertResourceToIDP1(entity) {
  if (!entity || entity.kind !== 'Resource') {
    throw new Error('Expected kind Resource');
  }

  // Ensure we have a valid name
  const name = entity.name || identifierToName(entity.identifier) || 'unknown';

  // Create metadata object with required fields
  const metadata = {
    name: name,
    namespace: 'default', // Always include namespace
    description: entity.metadata?.description || ''
  };

  // Add annotations if present
  if (entity.metadata?.annotations && Object.keys(entity.metadata.annotations).length > 0) {
    metadata.annotations = entity.metadata.annotations;
  }

  // Add tags if present
  if (entity.metadata?.tags && entity.metadata.tags.length > 0) {
    metadata.tags = entity.metadata.tags;
  }

  // Add links if present
  if (entity.metadata?.links && entity.metadata.links.length > 0) {
    metadata.links = entity.metadata.links;
  }

  // Copy all other metadata fields that might be present
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      if (!['annotations', 'tags', 'description', 'links'].includes(key)) {
        metadata[key] = value;
      }
    });
  }

  // Create the 1.0 Resource object
  const resource = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Resource',
    metadata: metadata
  };

  // Add spec section with required fields
  resource.spec = {
    owner: entity.owner || '',
    type: entity.type || ''
  };

  // Add any additional spec fields from 2.0
  if (entity.spec) {
    Object.entries(entity.spec).forEach(([key, value]) => {
      if (!resource.spec[key]) {
        resource.spec[key] = value;
      }
    });
  }

  return resource;
}

/**
 * Converts IDP 2.0 Component to IDP 1.0 Component
 */
function convertComponentToIDP1(entity) {
  if (!entity || entity.kind !== 'Component') {
    throw new Error('Expected kind Component');
  }

  // Create metadata object with required fields
  const metadata = {
    name: entity.name || identifierToName(entity.identifier) || 'unknown',
    namespace: 'default'
  };

  // Add description if present
  if (entity.metadata?.description) {
    metadata.description = entity.metadata.description;
  }

  // Add annotations if present
  if (entity.metadata?.annotations && Object.keys(entity.metadata.annotations).length > 0) {
    metadata.annotations = entity.metadata.annotations;
  }

  // Add tags if present
  if (entity.metadata?.tags && entity.metadata.tags.length > 0) {
    metadata.tags = entity.metadata.tags;
  }

  // Add links if present
  if (entity.metadata?.links && entity.metadata.links.length > 0) {
    metadata.links = entity.metadata.links;
  }

  // Copy all other metadata fields that might be present
  if (entity.metadata) {
    Object.entries(entity.metadata).forEach(([key, value]) => {
      if (!['annotations', 'tags', 'description', 'links'].includes(key)) {
        metadata[key] = value;
      }
    });
  }

  // Create the 1.0 Component object
  const component = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata
  };

  // Add spec section with required fields
  component.spec = {
    owner: entity.owner || '',
    type: entity.type || ''
  };

  // Add common spec fields
  const commonSpecFields = ['lifecycle', 'system', 'domain', 'providesApis'];
  commonSpecFields.forEach(field => {
    if (entity.spec && entity.spec[field] !== undefined) {
      component.spec[field] = entity.spec[field];
    }
  });

  // Add any additional spec fields from 2.0
  if (entity.spec) {
    Object.entries(entity.spec).forEach(([key, value]) => {
      if (!component.spec[key]) {
        component.spec[key] = value;
      }
    });
  }

  return component;
}

// Main function to convert from 2.0 to 1.0
function convertToIDP1(entity) {
  switch (entity.kind) {
    case 'Workflow':
      return convertWorkflowToTemplate(entity);
    case 'API':
      return convertAPIToIDP1(entity);
    case 'Resource':
      return convertResourceToIDP1(entity);
    case 'Component':
      return convertComponentToIDP1(entity);
    default:
      throw new Error(`Unsupported kind '${entity.kind}'. Supported kinds: Workflow, API, Resource, Component.`);
  }
}

// Main conversion function that will be used by the React app
export function convertYaml(yamlContent, direction) {
  try {
    const entity = yaml.load(yamlContent);
    
    if (!entity) {
      throw new Error('Invalid YAML content');
    }
    
    // For 2.0 to 1.0 conversion, remove the relations field from input if present
    // This prevents validation errors in the Harness IDP system
    if (direction === '2to1' && entity.relations) {
      delete entity.relations;
    }
    
    let convertedEntity;
    if (direction === '1to2') {
      convertedEntity = convertToIDP2(entity);
    } else if (direction === '2to1') {
      convertedEntity = convertToIDP1(entity);
      
      // Ensure metadata.name is always present
      if (!convertedEntity.metadata) {
        convertedEntity.metadata = {};
      }
      
      if (!convertedEntity.metadata.name) {
        // Use identifier, name, or a default value
        convertedEntity.metadata.name = entity.name || entity.identifier || 'unknown';
      }
      
      // Sanitize the name to conform to Backstage requirements
      convertedEntity.metadata.name = sanitizeName(convertedEntity.metadata.name);
      
      // Always include namespace
      convertedEntity.metadata.namespace = convertedEntity.metadata.namespace || 'default';
    } else {
      throw new Error('Invalid conversion direction');
    }
    
    return yaml.dump(convertedEntity, {
      noRefs: true,
      lineWidth: 120,
      sortKeys: false
    });
  } catch (error) {
    throw new Error(`Conversion error: ${error.message}`);
  }
}
