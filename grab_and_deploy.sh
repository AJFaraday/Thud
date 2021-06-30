#! /bin/bash
echo
echo "Starting automated deploy"
date
echo "Fetching and importing answers"
node script/fetch_answers.js
node script/get_clients.js
echo "Running tournament"
node script/run_tournament.js
echo "Deploying to git"
git add src/clients/*
now=`date '+%F_%H:%M:%S'`;
commit_message="Automated deploy: ${now}"
git commit -am "$commit_message"
git push
