const axios = require('axios');
const express = require('express');
const app = express();

function sendMessage(output) {
  console.log(output)
}
const api = {
  sendMessage:sendMessage
}
app.get('/', (req, res) => {
    res.send('Running Shareboost Aktibaytid!!!');
});
 
app.listen(3000, () => api.sendMessage(' app listening on port 3000!'));
const accessToken = 'EAADYPcrzZBmcBO2luX4yZCsJ3gqe8TdaHgowASqR6T3BKJXfhDK9jQhEORXq2yzcZB6dqu6ZBHYttaV2sNnYrZCucxgN1i1ZBabl2aUKGv9JSzuKypUdyecCjRk4c9e8XSIHXLc7H58vG4xhcxR7XrNu7HZC3c7HnsLnnDHtzp2nKVY7xJZCHiPGdkM3KSTl80N3AzYSFZCPD0AZDZD'; // ACCESS TOKEN HERE


//1st Token:  EAADYPcrzZBmcBO79yaIZB2TWFzeTVZA6K5OSNZBZAb1Lgi47n3fwDD11gqjqXR4awa3x37aILFuRmFf7YNe0yvG0TtNdYouc0Te8RwbrbaJaDV1a7CgdnvmuQnmYpi6Urtcfncb6IKsWaXhGLX3ZBRukxU9BNmECnbgzBadumdkcXWagwGn5Iwam7lgPvOzxTrnV8TmugIUAZDZD

const shareUrl = 'https://www.facebook.com/photo.php?fbid=930997388593340&set=a.102892891403798&type=3&app=fbl ' ; // URL HERE
const  shareCount = 4050;
const timeInterval = 1200;
const deleteAfter = 60 * 60;

let sharedCount = 0;
let timer = null;

async function sharePost() {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
      {
        link: shareUrl,
        privacy: { value: 'SELF' },
        no_story: true,
      },
      {
        muteHttpExceptions: true,
        headers: {
          authority: 'graph.facebook.com',
          'cache-control': 'max-age=0',
          'sec-ch-ua-mobile': '?0',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
          },
          method: 'post',
      }
    );

    sharedCount++;
    const postId = response?.data?.id;

    api.sendMessage(`Post shared: ${sharedCount}`);
    api.sendMessage(`Post ID: ${postId || 'Unknown'}`);

    if (sharedCount === shareCount) {
      clearInterval(timer);
      api.sendMessage('Finished sharing posts.');

      if (postId) {
        setTimeout(() => {
          deletePost(postId);
        }, deleteAfter * 1000);
      }
    }
  } catch (error) {
    console.error('Failed to share post:', error.response.data);
  }
}

async function deletePost(postId) {
  try {
    await axios.delete(`https://graph.facebook.com/${postId}?access_token=${accessToken}`);
    api.sendMessage(`Post deleted: ${postId}`);
  } catch (error) {
    console.error('Failed to delete post:', error.response.data);
  }
}

timer = setInterval(sharePost, timeInterval);

setTimeout(() => {
  clearInterval(timer);
  api.sendMessage('Loop stopped.');
}, shareCount * timeInterval);
