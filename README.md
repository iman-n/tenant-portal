# Tenant Portal Application

The Tenant Portal is a full-stack application for managing client interactions and support tickets. It includes features for chating with the client and creating ticket and showing the created tickets and is designed with scalability and automation in mind.

## Features
- **Create Tickets**: Chat with clients and log support tickets.
- **View Tickets**: Retrieve and display all tickets.
- **Automation**: CI/CD pipeline using GitHub Actions for automated build and deployment.
- **Infrastructure as Code**: Deploy EC2 instances via Terraform.
- **Scalable Backend**: Powered by NestJS and PostgreSQL, with caching using Redis.
- **Frontend**: Built with Next.js for a dynamic user experience.
- **GraphQL API**: Efficient data fetching with GraphQL.

## Architecture
The application is composed of the following components:
1. **Frontend**: Next.js for the user interface.
2. **Backend**: NestJS with GraphQL for API management.
3. **Database**: PostgreSQL for persistent storage.
4. **Cache**: Redis for caching data.
5. **Infrastructure**: Terraform automates the provisioning of EC2 instances in AWS.
6. **CI/CD**: GitHub Actions automates the build and deployment process.

## Deployment
1. **create ECR in AWS**
    you have to create to ECR for frontend and backend dockers.
2. **setting up the parameters**
    set the parameters in AWS parameter store.
    ```
    # Replace values with your actual secrets
    aws ssm put-parameter --name "/tenant-test/OPENAI_API_KEY" --type "SecureString" --value <OPENAI-API-KEY> --overwrite
    aws ssm put-parameter --name "/tenant-test/POSTGRES_USER" --type "SecureString" --value <POSTGRE-USER> --overwrite
    aws ssm put-parameter --name "/tenant-test/POSTGRES_PASSWORD" --type "SecureString" --value <POSTGRES-PASSWORD> --overwrite
    aws ssm put-parameter --name "/tenant-test/POSTGRES_DB" --type "SecureString" --value <POSTGRES-DB-NAME> --overwrite
    aws ssm put-parameter --name "/tenant-test/DATABASE_URL" --type "SecureString" --value "postgresql://<POSTGRE-USER>:<POSTGRES-PASSWORD>@postgres:5432/<POSTGRES-DB-NAME>" --overwrite
    aws ssm put-parameter --name "/tenant-test/REDIS_URL" --type "String" --value "redis://redis:6379" --overwrite
    ```
3. **Setup the github environment variable**
    you have to setup the following variable in github:
    ```
    AWS_ACCESS_KEY_ID
    AWS_REGION
    AWS_SECRET_ACCESS_KEY
    EC2_PRIVATE_KEY
    ECR_REPOSITORY
    ```
4. **Pushing in main branch**
    Now just push to main branch everything is up and running in few minutes.