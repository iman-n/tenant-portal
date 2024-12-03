provider "aws" {
  region = var.aws_region
}


terraform {
  backend "s3" {
    bucket = "iman-tf-state"
    key    = "tenant-portal/terraform.state"
    region = "eu-central-1"
  }
}