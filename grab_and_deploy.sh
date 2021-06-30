#! /bin/bash
echo "Starting automated deploy"
date

node script/fetch_answers.js;
node script/get_clients.js;
node script/run_tournament.js;

git add src/clients/*

now=`date '+%F_%H:%M:%S'`;
commit_message="Automated deploy: ${now}"
git commit -am "$commit_message"
git push
