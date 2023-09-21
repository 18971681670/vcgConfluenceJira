provider "aws" {
  region                      = "${var.aws_region}"
  profile                     = "${var.aws_profile}"
  skip_credentials_validation = true

  assume_role {
    role_arn     = "${var.aws_assume_role_arn}"
    session_name = "${var.aws_account_name}"
  }
}

terraform {
  backend "s3" {}
}

module "500px" {
  # required tags
  source        = "git::git@github.com:500px/lux-modules.git?ref=71aa61e6560f987ff543ff1a7e8ef0961f2096b6//500px-tags"
  role          = "infrastructure"
  owner         = "${var.owner}"
  project       = "${var.project}"
  application   = "graphql-gateway"
  environment   = "${var.environment}"
  securitylevel = "${var.securitylevel}"

  # optional tags
  tags = "${var.tags}"
}

# Pull in outputs/remote state of eks-cluster
locals {
  eks_cluster_key_default = "${var.aws_account_name}/${var.aws_region}/_global/eks-cluster/terraform.tfstate"
  eks_cluster_key         = "${var.eks_cluster_key_location == "" ? local.eks_cluster_key_default : var.eks_cluster_key_location}"
}

data "terraform_remote_state" "eks_cluster" {
  backend = "s3"

  config {
    bucket   = "${var.terragrunt_mgmt_s3_bucket}"
    key      = "${local.eks_cluster_key}"
    profile  = "${var.aws_mgmt_profile}"
    role_arn = "${var.aws_mgmt_role_arn}"
    region   = "${var.aws_mgmt_region}"
  }
}

# IAM role
module "graphql_gateway_role" {
  source              = "git@github.com:500px/lux-modules.git?ref=a3da81a8211f26961dd85ce7bbad611376004d7c//eks-app-role"
  name                = "graphql-gateway"
  description         = "Role used by resize service for AWS access"
  aws_region          = "${var.aws_region}"
  eks_worker_role_arn = "${data.terraform_remote_state.eks_cluster.eks_worker_role_arn}"
  tags                = "${module.500px.tags}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "kms:Decrypt"
      ],
      "Resource": "${data.terraform_remote_state.eks_cluster.eks_kms_key_arn}"
    }
  ]
}
EOF
}

# Pull in outputs/remote state of vpc
locals {
  vpc_key_default = "${var.aws_account_name}/${var.aws_region}/_global/vpc/terraform.tfstate"
  vpc_key         = "${var.vpc_key_location == "" ? local.vpc_key_default : var.vpc_key_location}"
}

data "terraform_remote_state" "vpc" {
  backend = "s3"

  config {
    bucket   = "${var.terragrunt_mgmt_s3_bucket}"
    key      = "${local.vpc_key}"
    profile  = "${var.aws_mgmt_profile}"
    role_arn = "${var.aws_mgmt_role_arn}"
    region   = "${var.aws_mgmt_region}"
  }
}

# Pull in outputs/remote state of route53
locals {
  r53_key_default = "${var.aws_account_name}/_global/route53/zone/terraform.tfstate"
  r53_key         = "${var.r53_key_location == "" ? local.r53_key_default : var.r53_key_location}"
}

data "terraform_remote_state" "r53" {
  backend = "s3"

  config {
    bucket   = "${var.terragrunt_mgmt_s3_bucket}"
    key      = "${local.r53_key}"
    profile  = "${var.aws_mgmt_profile}"
    role_arn = "${var.aws_mgmt_role_arn}"
    region   = "${var.aws_mgmt_region}"
  }
}

# Pull in outputs/remote state of eks-workers
locals {
  eks_workers_key_default = "${var.aws_account_name}/${var.aws_region}/eks-workers/${var.eks_workers_node_group}/terraform.tfstate"
  eks_workers_key         = "${var.eks_workers_key_location == "" ? local.eks_workers_key_default : var.eks_workers_key_location}"
}

data "terraform_remote_state" "eks_workers" {
  backend = "s3"

  config {
    bucket   = "${var.terragrunt_mgmt_s3_bucket}"
    key      = "${local.eks_workers_key}"
    profile  = "${var.aws_mgmt_profile}"
    role_arn = "${var.aws_mgmt_role_arn}"
    region   = "${var.aws_mgmt_region}"
  }
}

# Pull in outputs/remote state of bastion
locals {
  bastion_key_default = "${var.aws_account_name}/${var.aws_region}/bastion/terraform.tfstate"
  bastion_key         = "${var.bastion_key_location == "" ? local.bastion_key_default : var.bastion_key_location}"
}

data "terraform_remote_state" "bastion" {
  backend = "s3"

  config {
    bucket   = "${var.terragrunt_mgmt_s3_bucket}"
    key      = "${local.bastion_key}"
    profile  = "${var.aws_mgmt_profile}"
    role_arn = "${var.aws_mgmt_role_arn}"
    region   = "${var.aws_mgmt_region}"
  }
}

module "graphql_redis" {
  source = "git::https://github.com/500px/terraform-aws-elasticache-redis.git?ref=f44e9fab854c723e583bc79e54ddda560c9d2eae"

  namespace  = "${var.project}"
  stage      = "${var.environment}"
  name       = "${var.redis_name}"
  label_id   = "${var.redis_label_id}"

  security_groups = [
    "${data.terraform_remote_state.eks_workers.security_group_id}",
    "${data.terraform_remote_state.bastion.vpc_security_group_ids}",
  ]

  vpc_id                       = "${data.terraform_remote_state.vpc.vpc_id}"
  subnets                      = ["${data.terraform_remote_state.vpc.database_subnets}"]
  maintenance_window           = "${var.redis_maintenance_window}"
  cluster_size                 = "${var.redis_num_nodes}"
  instance_type                = "${var.redis_node_type}"
  engine_version               = "${var.redis_engine_version}"
  apply_immediately            = "${var.redis_apply_immediately}"
  availability_zones           = ["${var.azs}"]
  family                       = "${var.redis_family}"
  automatic_failover           = "${var.redis_automatic_failover}"
  snapshot_window              = "${var.redis_snapshot_window}"
  snapshot_retention_limit     = "${var.redis_snapshot_retention_limit}"
  snapshot_arns                = "${var.redis_snapshot_arns}"
  snapshot_name                = "${var.redis_snapshot_name}"
  replication_group_id         = "redis-${var.redis_name}"
  alarm_cpu_threshold_percent  = "${var.redis_alarm_cpu_threshold_percent}"
  alarm_memory_threshold_bytes = "${var.redis_alarm_memory_threshold_bytes}"
  at_rest_encryption_enabled   = "${var.redis_at_rest_encryption_enabled}"
  transit_encryption_enabled   = "${var.redis_transit_encryption_enabled}"
  zone_id                      = "${data.terraform_remote_state.r53.zone_id}"
}
