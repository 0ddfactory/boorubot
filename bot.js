#!/usr/bin/env node

require('dotenv').config();
const Mastodon = require('mastodon-api');
const Booru = require('booru');
const Axios = require('axios');
const fs = require('fs');
const https = require('https');
const site = 'gelbooru';
const tags = ['']; //searches for posts containing all tags added here ex. ['1', '2', '3'] (to randomly search only one tag at a time change 'tags' on line 31 to 'randomtag'.
const randomtag = tags[Math.floor(tagstag.length * Math.random())]; //calls a random tag from the tags array

console.log("boorubot starting...");

const authenticatedMastodon = new Mastodon(
    {
        client_key: process.env.CLIENT_KEY,
        client_secret: process.env.CLIENT_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        timeout_ms: 60 * 1000,
        api_url: process.env.API_URL,
    }
);

//configure post interval here (default: 1 hour = 60 * 60000)
Post();
setInterval(Post, 60 * 60000);

async function Post()  
{
	const post = await Booru.search(site, tags, {limit: 1, random: true}) //change tags to randomtag for a random tag called from the tags array
	.then(posts => {
	for (let post of posts){
		url = post.fileUrl;
		rating = post.rating;
		source = post.postView;
		}
	})

	console.log(url);
	console.log('rating: ${rating}');
	const name = 'image.jpg';
    
    // If the image rating is questionable or explicit, flag the post as sensitive
    var isQuestionable = false;
    if (rating == 'q' || rating == 'e')
    {
        isQuestionable = true;
    }
   
    //download image using axios	
    async function downloadImage(url, name) {
        const response = await Axios({
           	url,
       	   	method: 'GET',
       	 	responseType: 'stream'
    	});
    return new Promise((resolve, reject) => {
       		response.data.pipe(fs.createWriteStream(name))
       		.on('error', reject)
      		.once('close', () => resolve(name)); 
    	});
    }	

    downloadImage(url, name);

    //Upload image to Mastodon
    setTimeout(function() {MastodonPost(name, source, isQuestionable);}, 4000);
    //Delete image after upload
    setTimeout(function() {DeleteFile(name);}, 10000);
}

function MastodonPost(name, source, isQuestionable)
{
    var statusString = `(Source: ${source})`;
    if (isQuestionable)
    {
        statusString = `NSFW\n${statusString}`;
    }
    
    const readStream = fs.createReadStream(name);
    authenticatedMastodon.post('media', { file: readStream}).then(resp =>
        {
		//write to json with status info
        const id = resp.data.id;
        authenticatedMastodon.post('statuses', {status: `${statusString}`, media_ids: [id], sensitive: isQuestionable}, (error, data) => 
        {
            if (error)
            {
                console.error(error);
            }
            else
            {
                fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
                console.log(`ID: ${data.id}\nTimestamp: ${data.created_at}\nContent: ${data.content}`);
            }
        })});  
    setTimeout(function() {readStream.close();}, 6000);
}


function DeleteFile(name)
{
    fs.unlink(name, function(err)
    {
        if (err)
        {
            console.error(err);
        }
    });
}


