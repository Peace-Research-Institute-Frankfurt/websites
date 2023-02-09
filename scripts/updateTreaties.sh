#!/bin/bash

base_dir=${GITHUB_WORKSPACE:="../"}
branch_name=${BRANCH_NAME:="test"}
github_actor=${GITHUB_ACTOR:="awesomephant"}

cd ${base_dir}/updates

npm ci

git config --local user.name "${github_actor}"
git config --local user.email "${github_actor}@users.noreply.github.com"

echo "Checking if ${branch_name} exists on remote..."
git ls-remote --exit-code --quiet --heads origin ${branch_name}
branch_exists=$?

if ((branch_exists == 0)); then
    echo "Branch ${branch_name} found, fetching..."
    git fetch --all
    git branch
    git checkout --track -b ${branch_name} origin/${branch_name}
    node ./e-learning/utils/updateTreaties.mjs
    treaties_changed=$?
    if ((treaties_changed == 0)); then
        node ${base_dir}/updates/scripts/generateTreatiesMessage.js --head=${base_dir}/updates/e-learning/content/data/treaties.json --base=${base_dir}/main/e-learning/content/data/treaties.json --countryData=${base_dir}/updates/e-learning/content/data/countries.json
        git add --all
        git commit -m "Update treaty participants"
        git push
        gh pr edit --body-file ${base_dir}/updates/tmp/pr.md
    fi
else
    echo "Branch ${branch_name} not found, creating a new one..."
    git checkout -b ${branch_name}
    node ${base_dir}/updates/e-learning/utils/updateTreaties.mjs
    treaties_changed=$?
    if ((treaties_changed == 0)); then
        node ${base_dir}/updates/scripts/generateTreatiesMessage.js --head=${base_dir}/updates/e-learning/content/data/treaties.json --base=${base_dir}/main/e-learning/content/data/treaties.json --countryData=${base_dir}/updates/e-learning/content/data/countries.json
        git add --all
        git commit -m "Update treaty participants"
        git push -u origin ${branch_name}
        gh pr create -B main -H ${branch_name} --title 'Update treaty participants' --body-file ${base_dir}/updates/tmp/pr.md --label "E-Learning"
    fi
    # git checkout main
    # git branch -d ${branch_name}
fi
