
# Use Setup

### Install jsonp-promise-pro

``` bash
npm install jsonp-promise-pro --save
```

### Example Code

``` bash
import jsonp from 'jsonp-promise-pro'
let options = {
        params:{
            a : 1,
            b : 2
        },
        jsonp : 'callback',
        prefix : '__jp',
        timeout : 15000
    }
let response = await jsonp('https://localhost/api.jsonp' , options);
```