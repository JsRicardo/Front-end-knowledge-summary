const fs = require('fs')

fs.stat("https://user-gold-cdn.xitu.io/2020/7/24/1737fe6072145007?w=690&h=378&f=jpeg&s=28669", (err, s) => {
    console.log(err, s)
})
