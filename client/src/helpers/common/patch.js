// ============================================
// Sends a PATCH request to server using axios
// in order to modify already existing data
// ============================================
import axios from 'axios';

function _patch(url, token, data, callback)
{
    axios({
        method: 'patch',
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

export default _patch;