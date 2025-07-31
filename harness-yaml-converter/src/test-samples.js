// Sample YAML examples for testing the converter

// Example 3: API examples
export const sampleApiYaml1to2 = `apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: invoice-api
  description: Handles invoice generation and delivery
spec:
  type: openapi
  lifecycle: production
  owner: group:billing-team
  definition: https://example.com/apis/invoice/openapi.yaml`;

export const sampleApiYaml2to1 = `apiVersion: harness.io/v1
kind: API
type: openapi
identifier: invoiceapi
name: invoice-api
owner: group:billing-team
spec:
  lifecycle: production
  definition: https://example.com/apis/invoice/openapi.yaml
metadata:
  description: Handles invoice generation and delivery`;

export const sampleApiComplexYaml1to2 = `apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: gitops-service
  description: The official GitOps Service REST APIs
spec:
  type: openapi
  lifecycle: production
  owner: cdplayacc
  definition:
    $text: https://app.harness.io/prod1/gitops/api/v1/openapi.json`;

export const sampleApiComplexYaml2to1 = `apiVersion: harness.io/v1
kind: API
type: openapi
identifier: gitopsservice
name: gitops-service
owner: cdplayacc
spec:
  lifecycle: production
  definition:
    $text: https://app.harness.io/prod1/gitops/api/v1/openapi.json
metadata:
  description: The official GitOps Service REST APIs`;

// Example 2: Simple Component conversion
export const sampleComponentYaml1to2 = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  namespace: default
  annotations:
    backstage.io/managed-by-location: url:https://bitbucket.org/pipelinefeaturetest/idp/src/main/catalog-info.yaml
    backstage.io/managed-by-origin-location: url:https://bitbucket.org/pipelinefeaturetest/idp/src/main/catalog-info.yaml
    backstage.io/view-url: https://bitbucket.org/pipelinefeaturetest/idp/src/main/catalog-info.yaml
    backstage.io/edit-url: https://bitbucket.org/pipelinefeaturetest/idp/src/main/catalog-info.yaml?mode=edit&at=main
    backstage.io/source-location: url:https://bitbucket.org/pipelinefeaturetest/idp/src
  name: stocopy2
  tags:
    - auto-generated
  codeCoverageScore: 60
  uid: 25618c11-242b-46aa-9345-594280ac6a62
  etag: 09306e0ad04023c49530a2131fdb9eb9301c85ce
relations:
  - type: ownedBy
    targetRef: group:default/harness_account_all_users
    target:
      kind: group
      namespace: default
      name: harness_account_all_users
  - type: partOf
    targetRef: system:default/hyperworkspace
    target:
      kind: system
      namespace: default
      name: hyperworkspace
spec:
  type: service
  lifecycle: experimental
  owner: Harness_Account_All_Users
  system: hyperworkspace`;

export const sampleComponentYaml2to1 = `apiVersion: harness.io/v1
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

// Example 1: Complex Component conversion
export const sampleYaml1to2 = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  namespace: default
  annotations:
    backstage.io/managed-by-location: url:https://github.com/vigneswara-propelo/python-pipeline-samples/tree/main/catalog-info.yaml
    backstage.io/managed-by-origin-location: url:https://github.com/vigneswara-propelo/python-pipeline-samples/blob/main/catalog-info.yaml
    backstage.io/view-url: https://github.com/vigneswara-propelo/python-pipeline-samples/tree/main/catalog-info.yaml
    backstage.io/edit-url: https://github.com/vigneswara-propelo/python-pipeline-samples/edit/main/catalog-info.yaml
    backstage.io/source-location: url:https://github.com/vigneswara-propelo/python-pipeline-samples/tree/main/
    backstage.io/techdocs-ref: dir:.
    jira/project-key: IDP
    jenkins.io/github-folder: CDS-68313
    firehydrant.com/service-name: python-pipeline-samples
    backstage.io/kubernetes-label-selector: harness.io/name=kubernetes-delegate
    github.com/project-slug: vigneswara-propelo/python-pipeline-samples
    pagerduty.com/service-id: PT5ED69
    harness.io/cd-serviceId: idpapp
    harness.io/pipelines: >
      Build:
      https://app.harness.io/ng/account/vpCkHKsDSxK9_KYfjCTMKA/home/orgs/default/projects/IDP_UI/pipelines/Build_IDP_UI_App/pipeline-studio/?storeType=INLINE

      Lint:
      https://app.harness.io/ng/account/vpCkHKsDSxK9_KYfjCTMKA/home/orgs/default/projects/IDP_UI/pipelines/Lint/pipeline-studio

      TypeCheck:
      https://app.harness.io/ng/account/vpCkHKsDSxK9_KYfjCTMKA/home/orgs/default/projects/IDP_UI/pipelines/Typecheck/pipeline-studio
    grafana/dashboard-selector: (tags @> 'prometheus' || tags @> 'blackbox')
    npm_token: npm_adfevegevef
    opsgenie.com/team: test
    opsgenie.com/component-selector: test
  name: python-pipeline-samples
  tags:
    - python-pipeline
  branch: develop
  customTags:
    - tag1
    - tag2
    - tag3
  version:
    major: 11
    minor: 11
  harnessData:
    qa_versions:
      - idp-service_1.3
      - idp-admin_1.3
    qa_versions_jql: fixVersion ~ '*idp-service*1.3*' OR fixVersion ~ '*idp-admin*1.3*'
  releaseVersion: 2.9
  coverage: "89.00"
  projectIdentifier: <+variable.account.projectIdentifier>
  orgIdentifier: <+variable.account.orgIdentifier>
  teamLead: John Doe
  codeCoverageScore: 60
  uid: 6087c0a3-df7d-4d90-a7ce-1efdbfcbaa13
  etag: 95ea1d8978759f944a2ccd259ebb5b0c74a3189e
relations:
  - type: ownedBy
    targetRef: group:default/harness_account_all_users
    target:
      kind: group
      namespace: default
      name: harness_account_all_users
  - type: providesApi
    targetRef: api:default/idp-service-api
    target:
      kind: api
      namespace: default
      name: idp-service-api
spec:
  type: service
  lifecycle: experimental
  owner: harness_account_all_users
  providesApis:
    - idp-Service-api`;

export const sampleYaml2to1 = `apiVersion: harness.io/v1
kind: Component
type: service
identifier: pythonpipelinesamples
name: pythonpipelinesamples
owner: harness_account_all_users
spec:
  lifecycle: experimental
  providesApis:
    - idp-Service-api
metadata:
  coverage: "89.00"
  customTags:
    - tag1
    - tag2
    - tag3
  harnessData:
    qa_versions:
      - idp-service_1.3
      - idp-admin_1.3
    qa_versions_jql: fixVersion ~ '*idp-service*1.3*' OR fixVersion ~ '*idp-admin*1.3*'
  orgIdentifier: <+variable.account.orgIdentifier>
  releaseVersion: 2.9
  annotations:
    backstage.io/techdocs-ref: dir:.
    jira/project-key: IDP
    jenkins.io/github-folder: CDS-68313
    firehydrant.com/service-name: python-pipeline-samples
    backstage.io/kubernetes-label-selector: harness.io/name=kubernetes-delegate
    github.com/project-slug: vigneswara-propelo/python-pipeline-samples
    pagerduty.com/service-id: PT5ED69
    harness.io/cd-serviceId: idpapp
    harness.io/pipelines: |
      Build: https://app.harness.io/ng/account/vpCkHKsDSxK9_KYfjCTMKA/home/orgs/default/projects/IDP_UI/pipelines/Build_IDP_UI_App/pipeline-studio/?storeType=INLINE
      Lint: https://app.harness.io/ng/account/vpCkHKsDSxK9_KYfjCTMKA/home/orgs/default/projects/IDP_UI/pipelines/Lint/pipeline-studio
      TypeCheck: https://app.harness.io/ng/account/vpCkHKsDSxK9_KYfjCTMKA/home/orgs/default/projects/IDP_UI/pipelines/Typecheck/pipeline-studio
    grafana/dashboard-selector: (tags @> 'prometheus' || tags @> 'blackbox')
    npm_token: npm_adfevegevef
    opsgenie.com/team: test
    opsgenie.com/component-selector: test
    backstage.io/source-location: url:https://github.com/vigneswara-propelo/python-pipeline-samples/tree/main/
  projectIdentifier: <+variable.account.projectIdentifier>
  branch: develop
  version:
    major: 11
    minor: 11
  teamLead: John Doe
  codeCoverageScore: 60
  tags:
    - python-pipeline`;
