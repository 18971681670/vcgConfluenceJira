#!/bin/bash

# This is a copy of
# https://github.com/500px/platform/blob/master/docker/compose/local-dev/utils.sh
#
# IMPORTANT NOTE: Please maintain the code there and keep this file in-sync
# with the master copy. We intentionally keep a hardcopy as we don't want to
# use git submodule to complicate the local dev setup.

set -e

function install_homebrew_if_needed() {
	if [[ $homebrew_installed == 1 ]] ; then
		return
	fi

	echo -n "Checking if Homebrew has been installed..."
	if [ -z `which -s brew && echo "installed"` ] ; then
		echo "Not yet"

		echo "Installing Homebrew..."
		/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
	else
		echo "Installed"

		echo "Updating Homebrew..."
		brew update
	fi

	homebrew_installed=1
}

function launch_docker_if_needed() {
	echo -n "Checking if Docker for Mac has been installed..."
	if [ ! -f "/Applications/Docker.app/Contents/Resources/bin/docker" ] ; then
		echo "Not yet"
		install_homebrew_if_needed

		echo "Installing Docker for Mac through Homebrew..."
		brew cask install docker
	else
		echo "Installed"
	fi

	echo -n "Checking if Docker for Mac is running..."
	if [ -z `docker ps >/dev/null 2>/dev/null && echo "running"` ] ; then
		echo "Not yet"

		echo -n "Launching Docker for Mac"
		open /Applications/Docker.app
		while true; do

			if [ -z `docker ps >/dev/null 2>/dev/null && echo "running"` ] ; then
				echo -n "."
			else
				echo "Running"
				break
			fi
			sleep 1
		done
	else
		echo "Running"
	fi
}

function install_aws_google_auth_if_needed() {
	if [[ $aws_google_auth_installed == 1 ]] ; then
		return
	fi

	echo -n "Checking if aws-google-auth is installed..."
	if [ -z `which -s gsts && echo "installed"` ] ; then
		echo "Not yet"
	  install_homebrew_if_needed

		echo "Installing gsts via homebrew..."
    brew tap uphold/tap
		brew install gsts
	else
		echo "Done"
	fi

	aws_google_auth_installed=1
}

function install_awscli_if_needed() {
	echo -n "Checking if awscli is installed..."

	if [ -z `which -s aws && echo "installed"` ] ; then
		echo "Not yet"

		install_homebrew_if_needed

		echo "Installing awscli through Homebrew..."
		brew install awscli
	else
		echo "Done"
	fi
}

function install_telepresence_if_needed() {
       echo -n "Checking if telepresence is installed..."

       if [ -z `which -s telepresence && echo "installed"` ] ; then
               echo "Not yet"

               install_homebrew_if_needed

               echo "Installing telpresence through Homebrew..."
               brew install macfuse
               brew install 500px/tools/telepresence
       else
               echo "Done"
       fi
}

function install_aws_iam_authenticator_if_needed() {
       echo -n "Checking if aws-iam-authenticator is installed..."

       if [ -z `which -s aws-iam-authenticator && echo "installed"` ] ; then
               echo "Not yet"

               install_homebrew_if_needed

               echo "Installing aws-iam-authenticator through Homebrew..."
               brew install aws-iam-authenticator
       else
               echo "Done"
       fi
}


function install_nvm_if_needed() {
	echo -n "Checking if nvm is installed..."

	[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh
	[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"

	if [ -z `nvm --version >/dev/null && echo "installed"` ] ; then
		echo "Not yet"

		install_homebrew_if_needed

		echo "Installing nvm through Homebrew..."
		brew install nvm
	else
		echo "Done"
	fi
}

function install_yarn_if_needed() {
	echo -n "Checking if yarn is installed..."

	if [ -z `which -s yarn && echo "installed"` ] ; then
		echo "Not yet"

		install_homebrew_if_needed

		echo "Installing yarn through Homebrew..."
		brew install yarn
	else
		echo "Done"
	fi
}


function login_aws_profile() {
	local aws_profile=$1

	install_aws_google_auth_if_needed

	echo -n "Checking if the AWS STS session of $aws_profile is still valid..."

	if [ -z `aws sts get-caller-identity --profile $aws_profile >/dev/null 2>/dev/null && echo "valid"` ] ; then
		echo "Expired"

		case "$aws_profile" in
			j79-production-sts)
        gsts \
          --idp-id C02mxo447 \
          --sp-id 293517734924 \
          --aws-session-duration 3000 \
          --aws-role-arn=arn:aws:iam::111608322531:role/500pxGappsPlatform \
          --aws-profile j79-production-sts
				;;

			j79-staging-sts)
        gsts \
          --idp-id C02mxo447 \
          --sp-id 293517734924 \
          --aws-session-duration 3000 \
          --aws-role-arn=arn:aws:iam::874811737431:role/500pxGappsPlatform \
          --aws-profile j79-staging-sts
				;;

			j79-development-sts)
        gsts \
          --idp-id C02mxo447 \
          --sp-id 293517734924 \
          --aws-session-duration 3000 \
          --aws-role-arn=arn:aws:iam::928444625298:role/500pxGAppsPlatform \
          --aws-profile j79-development-sts
				;;

			500px-services-sts)
        gsts \
          --idp-id C02mxo447 \--sp-id 293517734924 \
          --aws-session-duration 3000 \
          --aws-role-arn=arn:aws:iam::669607800383:role/500pxGAppsPlatform \
          --aws-profile 500px-services-sts
				;;

			*)
				echo "aws profile is missing!!!"
				exit -1
		esac

		# aws-google-auth always returns 0, so we have to manually check if the sts has been successfully obtained.
		if [ -z `aws sts get-caller-identity --profile $aws_profile >/dev/null 2>/dev/null && echo "valid"` ] ; then
			exit -1
		fi
	else
		echo "Valid"
	fi
}

function check_host_mapping() {
	local web_host=$1

	echo -n "Checking $web_host in hosts file..."
	if [ -z `dscacheutil -q host -a name $web_host | grep 127.0.0.1 >/dev/null && echo "found"` ] ; then
		echo "Failed"

		echo "[ERROR] $web_host shall be resolved to 127.0.0.1. Please fix it in your /etc/hosts file."
		echo "You could download Gas Mask to manage it easily: http://clockwise.ee/"
		exit -1
	else
		echo "OK"
	fi
}

function check_nginx() {
	local web_url=$1
	local j79_env=$2
	local web_client_only=$3

	echo -n "Checking nginx for $web_url..."

	if [ ! -z `curl -k -s -o /dev/null -w "%{http_code}" $web_url | grep 000 >/dev/null && echo "failed"` ] ; then
		echo "Failed"

		echo "[ERROR] $web_url shall be served by your local nginx server."
		echo -e "Please make sure you clone \x1B[1mplatform\x1B[0m (\x1B[4mhttps://github.com/500px/platform\x1B[0m) and run the command below in the repo"

		if [ -z "$web_client_only" ]; then
			echo -e "\n\t\x1B[1m./local-dev.sh $j79_env\x1B[0m\n"
		else
			echo -e "\n\t\x1B[1m./local-dev.sh $j79_env --web-client-only\x1B[0m\n"
		fi

		exit -1
	else
		echo "OK"
	fi
}
