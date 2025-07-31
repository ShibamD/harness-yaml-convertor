// Test script to verify 2.0 to 1.0 conversion
const yaml = require('js-yaml');
const fs = require('fs');

// Import the converter function
const { convertYaml } = require('./utils/converter');

// Test Component 2.0 YAML
const testComponent2_0 = `apiVersion: harness.io/v1
kind: Component
type: service
identifier: stocopy2
name: stocopy2
owner: Harness_Account_All_Users
spec:
  lifecycle: experimental
  system: hyperworkspace
metadata:
  annotations:
    backstage.io/source-location: url:https://bitbucket.org/pipelinefeaturetest/idp/src
  codeCoverageScore: 60
  tags:
    - auto-generated`;

// Expected 1.0 output
const expectedComponent1_0 = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: stocopy2
  annotations:
    backstage.io/source-location: url:https://bitbucket.org/pipelinefeaturetest/idp/src
  tags:
    - auto-generated
  codeCoverageScore: 60
spec:
  type: service
  lifecycle: experimental
  owner: Harness_Account_All_Users
  system: hyperworkspace`;

try {
  // Convert from 2.0 to 1.0
  const convertedYaml = convertYaml(testComponent2_0, '2to1');
  
  // Parse both YAMLs for comparison
  const convertedObj = yaml.load(convertedYaml);
  const expectedObj = yaml.load(expectedComponent1_0);
  
  console.log("=== Conversion Test Results ===");
  console.log("Converted YAML:");
  console.log(convertedYaml);
  
  // Compare key structures
  console.log("\n=== Structure Validation ===");
  console.log("apiVersion correct:", convertedObj.apiVersion === expectedObj.apiVersion);
  console.log("kind correct:", convertedObj.kind === expectedObj.kind);
  console.log("metadata.name correct:", convertedObj.metadata.name === expectedObj.metadata.name);
  console.log("spec.type correct:", convertedObj.spec.type === expectedObj.spec.type);
  console.log("spec.owner correct:", convertedObj.spec.owner === expectedObj.spec.owner);
  
  // Write the converted YAML to a file for inspection
  fs.writeFileSync('converted-2to1.yaml', convertedYaml, 'utf8');
  console.log("\nConverted YAML written to converted-2to1.yaml");
} catch (err) {
  console.error("Conversion error:", err.message);
}
