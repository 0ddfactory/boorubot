# boorubot for mastodon
Boorubot is a bot that pulls from various booru sites and posts them to a mastodon account with appropriate content warnings applied as needed.

# Dependencies

* nodejs/npm

# Account/Key Generation
Firstly you'll need to create an account for boorubot on your instance and mark the account as a bot in Settings > Profile (and suggest account to others if needed)

![image](https://github.com/0ddfactory/boorubot/assets/25939455/f10b5d1f-bfd5-471e-b591-f6386f84bdfa)

Next go to Settings > Development and create a new application as shown below.

![newapp](https://github.com/0ddfactory/boorubot/assets/25939455/a3f36152-f604-4e09-b2f1-ba9a0610bef6)

Enter a name and submit (you can leave permissions as default read/write).

![Pasted image](https://github.com/0ddfactory/boorubot/assets/25939455/8a324909-72e2-414a-83c4-393a991f5e75)

Click on the name of the application you previously submitted and take note of the three values as you will need them later (Client key, Client secret, Your access token):

![token](https://github.com/0ddfactory/boorubot/assets/25939455/ad1c9a64-09e2-4e29-aa09-e13eb2dba0f2)

And you're done! Your account is now ready for the bot to access.

# Installation/Configuration
Clone the repository to your server us git and enter the project directory.
Install the following packages by entering the following commands in your project directory:

```
npm install mastodon-api

npm install booru

npm install axios

npm install fs

npm install https
```
There is a dotfile in your project directory titled .env where you will enter the three keys you took note of previously and your API_URL which will be: ``` https://(yourdomain)/api/V1/ ```

```
CLIENT_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ACCESS_TOKEN=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
API_URL=https://(yourdomain)/api/V1/
```

You can now set your choice of booru to pull images from as well as tags to search. 
The default is danbooru but you can find a list of supported boorus in sites.json as well as their aliases. 
This value can be set by editing the site and tags values near the top of the document on lines 9 & 10:

```
const site = 'danbooru';
const tags = [''];
```

You may add multiple tags like so (danbooru does not support multiple tags for free so you must either change booru or enable the randomtag feature as outlined in the next section):

```
const tags = ['1', '2', '3']
```

By default adding multiple tags will search for a single image containing all tags added to the tags array.

In some cases we may only want an image containing one of the tags at random each time the bot posts.

To enable this behavior and choose a random tag you've configured each time the bot searches you may change 'tags' on line 31 to 'randomtag' like so:

```
const post = await Booru.search(site, randomtag, {limit: 1, random: true}) 
```

Posting intervals are also configurable on line 25 with the default being 60 * 60000 with 60000 being 1 minute and 60 minutes being 1 hour.
You may change this as needed and may add another integer to multiply the hours like so:

```
setInterval(Post, 6 * 60 * 60000); //6 * 60 * 60000 would make the bot post every 6 hours.
```
Finally, once you have the bot properly configured you may start is using node.

```
node bot.js
```

If your system uses systemd you may make a configuration in /stc/systemd/system/boorubot.service and enable it to start the bot with your server/mastodon instance as needed.
