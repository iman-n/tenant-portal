# VPC and Security Group
resource "aws_security_group" "docker_sg" {
  name        = "docker-compose-sg"
  description = "Security group for Docker Compose application"

  # Frontend port
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# IAM role for EC2 to access ECR
resource "aws_iam_role" "ec2_ecr_role" {
  name = "ec2-ecr-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_policy" {
  role       = aws_iam_role.ec2_ecr_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_policy" "ssm_policy" {
  name        = "ssm-parameter-access-policy"
  description = "Policy to allow access to SSM Parameter Store"
  policy      = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect    = "Allow",
        Action    = "ssm:GetParameter",
        Resource  = "arn:aws:ssm:eu-central-1:552912569893:parameter/tenant-test/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.ec2_ecr_role.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}


resource "aws_iam_instance_profile" "ec2_profile" {
  name = "ec2-ecr-profile"
  role = aws_iam_role.ec2_ecr_role.name
}

# EC2 Instance
resource "aws_instance" "docker_host" {
  ami           = "ami-0a628e1e89aaedf80"  # Ubuntu 24.04 LTS in eu-central-1
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.docker_sg.id]
  iam_instance_profile   = aws_iam_instance_profile.ec2_profile.name
  key_name              = var.instance_public_key_name

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y ca-certificates curl gnupg
              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg
              echo "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu

              # Install AWS CLI v2
              apt-get install -y unzip
              curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
              unzip awscliv2.zip
              ./aws/install
              rm -rf awscliv2.zip

              # sleep 10
              # Login to ECR and pull the imag
              # aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 552912569893.dkr.ecr.eu-central-1.amazonaws.com
              
              EOF

  tags = {
    Name = "docker-compose-host"
  }

  root_block_device {
    volume_size = 8  # Increase if you need more storage
  }
}