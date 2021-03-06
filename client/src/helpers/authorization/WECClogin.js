// ============================================
// Send POST request for WECCC login authorization
// using login information input by user
// ============================================
import axios from 'axios';

function weccLogin(data, callback)
{
    axios({
        method: 'post',
        url: 'https://weccc.dev/api/users/login',
        headers: { 
            'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
        timeout: 5000
    })
    .then(response => {
        callback(null, response);
    })
    .catch(error => {
        callback(error, null);
    });
}

export default weccLogin;