variable "aws_region" {}

variable "aws_profile" {}

variable "aws_account_name" {}

variable "aws_account_id" {}

variable "terragrunt_mgmt_s3_bucket" {}

variable "aws_mgmt_region" {}

variable "aws_mgmt_profile" {}

variable "aws_assume_role_arn" {}

variable "aws_mgmt_role_arn" {}

variable "environment" {}

variable "owner" {}

variable "project" {}

variable "securitylevel" {}

variable "tags" {
  type    = "map"
  default = {}
}

variable "azs" {
  default = []
}

variable "vpc_key_location" {
  description = "Custom remote-state key (S3) location for VPC"
  default     = ""
}

variable "eks_cluster_key_location" {
  description = "Custom remote-state key (S3) location for EKS Cluster"
  default     = ""
}

variable "r53_key_location" {
  description = "Custom remote-state key (S3) location for Route53"
  default     = ""
}

variable "eks_workers_key_location" {
  description = "Custom remote-state key (S3) location for EKS Workers"
  default     = ""
}
variable "eks_workers_node_group" {
  description = "Custom remote-state key (S3) location for EKS Workers group"
  default     = "monolith"
}

variable "bastion_key_location" {
  description = "Custom remote-state key (S3) location for bastion host"
  default     = ""
}

# redis module specific
variable "redis_name" {
  default = "graphql"
}

variable "redis_label_id" {
  default = "true"
}

variable "redis_maintenance_window" {
  default = "wed:03:00-wed:04:00"
}

variable "redis_automatic_failover" {
  default = "false"
}

variable "redis_apply_immediately" {
  default = "true"
}

variable "redis_node_type" {
  default = "cache.m5.large"
}

variable "redis_num_nodes" {
  default = "1"
}

variable "redis_engine_version" {
  default = "5.0.5"
}

variable "redis_family" {
  default = "redis5.0"
}

variable "redis_snapshot_window" {
  default = "07:00-08:00"
}

variable "redis_snapshot_retention_limit" {
  default = "1"
}

variable "redis_snapshot_arns" {
  default = []
}

variable "redis_snapshot_name" {
  default = ""
}

variable "redis_alarm_cpu_threshold_percent" {
  default = "75"
}

variable "redis_alarm_memory_threshold_bytes" {
  default = "10000000"
}

variable "redis_transit_encryption_enabled" {
  default = "false"
}

variable "redis_at_rest_encryption_enabled" {
  default = "false"
}
