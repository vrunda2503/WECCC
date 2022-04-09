import axios from 'axios';

function weccPost(url, data, callback)
{
    axios({
        method: 'post',
        url: '/api/users/wecc',
        headers: { 
            'Content-Type': 'application/json'            
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

export default weccPost;