variable "aws_region" {
  default = "eu-central-1"
}

variable "instance_type" {
  default = "t2.micro"
}

variable "instance_public_key_name" {
  description = "public key name set on instance"
  type        = string
  default     = "iman-key-aws"
}