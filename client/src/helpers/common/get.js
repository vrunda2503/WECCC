// ============================================
// Sends a GET request to server using axios
// ============================================
import axios from 'axios';

function _get(url, token, callback)
{
    axios({
        method: 'get',
        url: '/api/' + url,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        timeout: 5000
    })
    .then(response => {
        callback(null, response);
    })
    .catch(error => {
        callback(error, null);
    });
}

export default _get;