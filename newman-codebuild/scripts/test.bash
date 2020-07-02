sls offline start --exec "newman run test.postman_collection.json"
if [ $? == 1 ]; then exit; fi
sls offline start --exec "newman run https://www.getpostman.com/collections/093607256e1a6b4c0deb"
if [ $? == 1 ]; then exit; fi
echo "SUCCESSFULLY PASSED SERVER!"