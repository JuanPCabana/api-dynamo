const iconv = require('iconv-lite')


const stringToUtf8 = (data) => {
  const encodedData = data.map(obj => {
    const utf8Obj = {};
    for (let key in obj) {
      utf8Obj[key] = iconv.encode(obj[key], 'utf8').toString('utf8');
    }
    return utf8Obj;
  });
  return encodedData
}

module.exports ={
  stringToUtf8
}