let fs = require('fs');

let result = '';
let dir = 'collections';
let defaultEnv = `
@url = https://sample.com/
@token = token
@contentType = application/json
`;

let parseDataToRest = (val) => {
    let str = ''
    str += '### '+ val.name+ '\n';
    str += `${val.request.method} ${val?.request?.url?.raw?.replace(/(\?|&)/g, '\n\t$1') || 'no data'}\n`;
    val.request.header.map((v, k) => {
        str += `${v.key}: ${v.value}\n`;
    });

    str += '\n';

    if(val.request.method !== 'GET' && val.request.body) {
        const { mode } = val.request.body;
        switch (mode) {
            case 'formdata':
                str += 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW\n';
                val.request.body.formdata.map((v, k) => {
                    str += `------WebKitFormBoundary7MA4YWxkTrZu0gW\nContent-Disposition: form-data; name="${v.key}"${v.type === 'file' ? `; filename="${v.key}.png"\n\n < ./${v.key}.png`: `\n${v.value}\n`}`;
                });
                str += `------WebKitFormBoundary7MA4YWxkTrZu0gW--`;
                break;
            case 'urlencoded':
                val.request.body.urlencoded.map((v, k) => {
                    str += `${k > 0 ? '&' : ''}${v.key}=${v.value}\n`;
                });
                break;
            default:
                //json
                str += val.request.body.raw;
                break;
        }
    }
    str += '\n';
    return str;
}


let doConvert = (data) => {
    
    return data.map((val) => {
        if(val.item) {
            let data = doConvert(val.item);
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            fs.writeFileSync(`${dir}/${val.name}.http`, `${defaultEnv}\n\n${data.join('')}`, 'utf-8');
        } else {
            result = parseDataToRest(val);
            return result;
        }
    })
}

module.exports = doConvert;
// doConvert(collections.item);