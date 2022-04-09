// ============================================
// Sends a POST request to server using axios
// allowing the server to accept incoming data
// ============================================
import axios from 'axios';

function _post(url, token, data, callback)
{
    axios({
        method: 'post',
        url: '/api/' + url,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
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

export default _post;