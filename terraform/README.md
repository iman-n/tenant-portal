# Terraform Implementation

This directory contain terraform files to create an ec2 instance with security group to deploy a web aplication.

## How to use

- Change the S3 bucket to save the terraform states in `provider.tf`.
- Change the `instance_public_key_name` in `variable.tf`.
- run:
```
    Terraform init
    Terraform plan
    Terraform apply
```