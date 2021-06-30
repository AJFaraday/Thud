node script/fetch_answers.js;
node script/get_clients.js;
node script/run_tournament.js;

git add src/clients/*

NOW=`date '+%F_%H:%M:%S'`;
git commit -am 'Automated deploy: $NOW'


