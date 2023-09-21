#!/bin/bash

set -e

CMD_ENV_NAME=$1
case "$CMD_ENV_NAME" in
        j79-staging)
		ENV_NAME=staging
		EKS_CLUSTER_NAME=j79-stage-hailstorm-cluster
		EKS_ROLE_ARN=arn:aws:iam::874811737431:role/500pxGappsPlatform
		;;

        j79-production)
		ENV_NAME=production
		EKS_CLUSTER_NAME=j79-prod-chinook-cluster
		EKS_ROLE_ARN=arn:aws:iam::111608322531:role/500pxGappsPlatform
		;;

        *)
		CMD_ENV_NAME=j79-development
		ENV_NAME=development
		EKS_CLUSTER_NAME=j79-dev-frostbite-cluster
		EKS_ROLE_ARN=arn:aws:iam::928444625298:role/500pxGAppsPlatform
esac

echo -e "Your local development enviroment is connected to \x1B[1m${CMD_ENV_NAME}\033[0m\n"

### Start of setup steps

cd local-dev

source utils.sh

install_aws_iam_authenticator_if_needed

install_telepresence_if_needed

install_awscli_if_needed

AWS_PROFILE=j79-${ENV_NAME}-sts
login_aws_profile $AWS_PROFILE

echo -n "Fetching config info for EKS cluster ${EKS_CLUSTER_NAME}..."
EKS_ENDPOINT=$(aws --profile $AWS_PROFILE --region us-east-1 eks describe-cluster --name $EKS_CLUSTER_NAME --query cluster.[endpoint] --output=text)
EKS_VERSION=$(aws --profile $AWS_PROFILE --region us-east-1 eks describe-cluster --name $EKS_CLUSTER_NAME --query cluster.[version] --output=text)
EKS_CA_DATA=$(aws --profile $AWS_PROFILE --region us-east-1 eks describe-cluster --name $EKS_CLUSTER_NAME --query cluster.[certificateAuthority.data] --output=text)
echo "Done"

echo "EKS cluster endpoint: ${EKS_ENDPOINT}"
echo "EKS cluster version: ${EKS_VERSION}"

echo -n "Checking if kubectl (v${EKS_VERSION}) is installed..."
if [ ! -z `which -s kubectl && echo "installed"` ] ; then
	KUBECTL_INSTALLED='true'

	if [ -z "`kubectl version --short --client | grep \"v${EKS_VERSION}.\\d*-eks\"`" ] ; then
		KUBECTL_INSTALLED=''
	fi
fi

if [ -z "${KUBECTL_INSTALLED}" ] ; then
	echo "Not yet"

	echo "Installing kubectl to ./local-dev/bin..."
	cd bin
	case "$EKS_VERSION" in
	1.11)
		KUBECTL_URL=https://amazon-eks.s3-us-west-2.amazonaws.com/1.11.10/2019-08-14/bin/darwin/amd64/kubectl
		;;
	1.12)
		KUBECTL_URL=https://amazon-eks.s3-us-west-2.amazonaws.com/1.12.10/2019-08-14/bin/darwin/amd64/kubectl
		;;
	1.13)
		KUBECTL_URL=https://amazon-eks.s3-us-west-2.amazonaws.com/1.13.8/2019-08-14/bin/darwin/amd64/kubectl
		;;
	1.14)
		KUBECTL_URL=https://amazon-eks.s3-us-west-2.amazonaws.com/1.14.6/2019-08-22/bin/darwin/amd64/kubectl
		;;
	1.16)
		KUBECTL_URL=https://amazon-eks.s3.us-west-2.amazonaws.com/1.16.8/2020-04-16/bin/darwin/amd64/kubectl
		;;
	1.17)
		KUBECTL_URL=https://amazon-eks.s3.us-west-2.amazonaws.com/1.17.9/2020-08-04/bin/darwin/amd64/kubectl
		;;
	1.18)
		KUBECTL_URL=https://amazon-eks.s3.us-west-2.amazonaws.com/1.18.9/2020-11-02/bin/darwin/amd64/kubectl
		;;
	1.19)
		KUBECTL_URL=https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/darwin/amd64/kubectl
		;;
	esac

	if [ ! -f "./kubectl-$EKS_VERSION" ]; then
		curl -L -o kubectl-$EKS_VERSION $KUBECTL_URL
		chmod +x ./kubectl-$EKS_VERSION
	fi
	rm -rf ./kubectl
	ln -s ./kubectl-$EKS_VERSION ./kubectl
	export PATH=`pwd`:$PATH
	cd ..
else
	echo "Done"
fi

mkdir -p ~/.kube

export KUBECONFIG="${HOME}/.kube/config-j79-${ENV_NAME}"

cat > ${KUBECONFIG} <<EOF
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${EKS_CA_DATA}
    server: ${EKS_ENDPOINT}
  name: j79-${ENV_NAME}
contexts:
- context:
    cluster: j79-${ENV_NAME}
    user: j79-${ENV_NAME}
  name: j79-${ENV_NAME}
current-context: j79-${ENV_NAME}
kind: Config
preferences: {}
users:
- name: j79-${ENV_NAME}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      args:
      - token
      - -i
      - ${EKS_CLUSTER_NAME}
      - r
      - ${EKS_ROLE_ARN}
      command: aws-iam-authenticator
      env:
      - name: AWS_PROFILE
        value: j79-${ENV_NAME}-sts
EOF

echo "The following services are running in ${EKS_CLUSTER_NAME}"
kubectl get svc
echo ""

echo "Starting telepresence..."
# telepresence --run docker-compose up
# telepresence --deployment telepresence --run docker-compose up
telepresence --run yarn start
