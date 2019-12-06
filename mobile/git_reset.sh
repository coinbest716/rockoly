echo "${BLUE}==>It will reset you unpushed commit/changes.${NC}"
read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "resetting to" $1
  git fetch origin
  git reset --hard origin/$1
  echo "main code reset done"
  cd src/common
  git reset --hard origin/$1
  echo "sub module reset done"
fi
