const fs = require('fs');


const file = fs.createWriteStream('./fakedata.csv');

file.write("Email,\n")
for(let i=0; i<=100; i++) {
  file.write(i+"AA"+(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))+'@gmail.com,\n');//randomstring+@gmail.com, ^^
}

file.end();