rm -rvf dist
grunt build
git add . 
git commit -m "Rebuild"
git push 
cd ..
git add . 
git commit -m "rebuild"
git push
