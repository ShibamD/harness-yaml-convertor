// Sample YAML examples for different entity types in both IDP 1.0 and 2.0 formats

// Component samples
export const componentYaml1 = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: artist-lookup
  description: Artist Lookup
  tags:
    - java
    - data
  links:
    - url: https://example.com/user
      title: Examples Users
      icon: user
    - url: https://example.com/group
      title: Example Group
      icon: group
    - url: https://example.com/cloud
      title: Link with Cloud Icon
      icon: cloud
    - url: https://example.com/dashboard
      title: Dashboard
      icon: dashboard
    - url: https://example.com/help
      title: Support
      icon: help
    - url: https://example.com/web
      title: Website
      icon: web
    - url: https://example.com/alert
      title: Alerts
      icon: alert
  annotations:
    backstage.io/source-template: template:default/springboot-template
    backstage.io/linguist: 'https://github.com/backstage/backstage/tree/master/plugins/playlist'
spec:
  type: service
  lifecycle: experimental
  owner: team-a
  system: artist-engagement-portal
  dependsOn: ['resource:artists-db']
  apiConsumedBy: ['component:www-artist']`;

export const componentYaml2 = `apiVersion: harness.io/v1
kind: Component
type: service
identifier: artistlookup
name: artist-lookup
owner: team-a
spec:
  lifecycle: experimental
  system: artist-engagement-portal
  dependsOn: ['resource:artists-db']
  apiConsumedBy: ['component:www-artist']
metadata:
  description: Artist Lookup
  tags:
    - java
    - data
  links:
    - url: https://example.com/user
      title: Examples Users
      icon: user
    - url: https://example.com/group
      title: Example Group
      icon: group
    - url: https://example.com/cloud
      title: Link with Cloud Icon
      icon: cloud
    - url: https://example.com/dashboard
      title: Dashboard
      icon: dashboard
    - url: https://example.com/help
      title: Support
      icon: help
    - url: https://example.com/web
      title: Website
      icon: web
    - url: https://example.com/alert
      title: Alerts
      icon: alert
  annotations:
    backstage.io/source-template: template:default/springboot-template
    backstage.io/linguist: 'https://github.com/backstage/backstage/tree/master/plugins/playlist'`;

// API samples
export const apiYaml1 = `apiVersion: backstage.io/v1alpha1
kind: API
metadata:
  name: petstore
  description: The petstore API
  tags:
    - store
    - rest
  links:
    - url: https://github.com/swagger-api/swagger-petstore
      title: GitHub Repo
      icon: github
    - url: https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml
      title: API Spec
      icon: code
spec:
  type: openapi
  lifecycle: experimental
  owner: team-c
  definition:
    $text: ./petstore.oas.yaml`;

export const apiYaml2 = `apiVersion: harness.io/v1
kind: API
type: openapi
identifier: petstore
name: petstore
owner: team-c
spec:
  lifecycle: experimental
  definition:
    $text: ./petstore.oas.yaml
metadata:
  description: The petstore API
  tags:
    - store
    - rest
  links:
    - url: https://github.com/swagger-api/swagger-petstore
      title: GitHub Repo
      icon: github
    - url: https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml
      title: API Spec
      icon: code`;

// Resource samples
export const resourceYaml1 = `apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: artists-db
  description: Stores artist details
spec:
  type: database
  owner: team-a
  system: artist-engagement-portal`;

export const resourceYaml2 = `apiVersion: harness.io/v1
kind: Resource
type: database
identifier: artistsdb
name: artists-db
owner: team-a
spec:
  system: artist-engagement-portal
metadata:
  description: Stores artist details`;

// Template/Workflow samples
export const templateYaml1 = `apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: create-react-app-template
  title: Create React App Template
  description: Create a new CRA website project
  tags:
    - react
    - cra
spec:
  owner: web@example.com
  type: website
  parameters:
    - title: Provide some simple information
      required:
        - component_id
        - owner
      properties:
        component_id:
          title: Name
          type: string
          description: Unique name of the component
          ui:field: EntityNamePicker
        description:
          title: Description
          type: string
          description: Help others understand what this website is for.
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            allowedKinds:
              - Group
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com
  steps:
    - id: template
      name: Fetch Skeleton + Template
      action: fetch:template
      input:
        url: ./skeleton
        copyWithoutRender:
          - .github/workflows/*
        values:
          component_id: \${{ parameters.component_id }}
          description: \${{ parameters.description }}
          destination: \${{ parameters.repoUrl | parseRepoUrl }}
          owner: \${{ parameters.owner }}

    - id: publish
      name: Publish
      action: publish:github
      input:
        allowedHosts:
          - github.com
        description: This is \${{ parameters.component_id }}
        repoUrl: \${{ parameters.repoUrl }}

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: \${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: "/catalog-info.yaml"

  output:
    links:
      - title: Repository
        url: \${{ steps.publish.output.remoteUrl }}
      - title: Open in catalog
        icon: catalog
        entityRef: \${{ steps.register.output.entityRef }}`;

export const templateYaml2 = `apiVersion: harness.io/v1
kind: Workflow
name: Create JAVA based new service
identifier: create_java_based_new_service
type: service
owner: backend-group
metadata:
  description: A Java-based microservice built using Spring Boot, designed for data processing and backend integration workflows.
  name: Java SpringBoot
  icon: java
  title: Java Sprigboot
  tags:
    - java
    - data
    - springboot
spec:
  output:
    links:
      - title: Registered Catalog Entity
        url: \${{ steps.trigger.output['pipeline.stages.javaonbdev.spec.execution.steps.create_and_register_entity.output.outputVariables.registeredCatalogEntity'] }}
      - title: Repository Created
        url: \${{ steps.trigger.output['pipeline.stages.javaonbdev.spec.execution.steps.Create_a_Git_repo.output.outputVariables.repositoryUrl'] }}
      - title: Pipeline Details
        url: \${{ steps.trigger.output.PipelineUrl }}
  lifecycle: production
  parameters:
    - title: Service Details
      required:
        - service_name
        - organization
        - owner
        - orgId
        - projectId
      properties:
        token:
          title: Harness Token
          type: string
          ui:widget: password
          ui:field: HarnessAuthToken
        service_name:
          title: Name of your new service
          type: string
          description: This will be used to create the application name, the repository, and finally registered as the unique IDP identifier.
          maxLength: 15
          pattern: ^([a-zA-Z][a-zA-Z0-9]*)([ -][a-zA-Z0-9]+)*$
        organization:
          title: GitHub Organization
          type: string
          description: Name of the GitHub organization
          default: Sdhar-ORG-Harness
        owner:
          title: Owner
          type: string
          description: Owner of the component
          ui:field: OwnerPicker
          ui:options:
            allowArbitraryValues: true
        projectId:
          title: Project Identifier
          description: Harness Project Identifier
          type: string
          ui:field: HarnessProjectPicker
        orgId:
          title: Org Identifier
          description: Harness org Identifier
          type: string
          ui:field: HarnessAutoOrgPicker
  steps:
    - id: trigger
      name: Creating your appication
      action: trigger:harness-custom-pipeline
      input:
        url: https://qa.harness.io/ng/account/zEaak-FLS425IEO7OLzMUg/all/orgs/default/projects/sd2/pipelines/JavaOnboardSD_Clone_Clone/pipeline-studio/?storeType=REMOTE&connectorRef=account.ShibamDhar&repoName=pipeline8&branch=main
        inputset:
          project_name: \${{ parameters.service_name }}
          app_name: \${{ parameters.service_name }}
          repo_name: \${{ parameters.service_name | replace(" ", "")  }}
          organization: \${{ parameters.organization }}
          unique_identifier: \${{parameters.service_name | replace(" ", "")  | lower | replace("-", "_")  }}
          owner: \${{ parameters.owner }}
          org_identifier: \${{ parameters.orgId }}
          project_identifier: \${{ parameters.projectId }}
        apikey: \${{ parameters.token }}
        showOutputVariables: true`;
