// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const Datastore = require("nedb"), //(require in the database)
  // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
  // which doesn't get copied if someone remixes the project.
  db = new Datastore({ filename: ".data/datafile", autoload: true }); //initialize the database

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['channels:read','chat:write'], //add scopes here
  installationStore: {
    storeInstallation: (installation) => {
      console.log("INSTALLATION:");
      console.log(installation);
      return db.insert(installation, (err, newDoc) => {
        if (err) console.log("There's a problem with the database ", err);
        else if (newDoc) console.log("installation insert completed");
      });
    },
    fetchInstallation: async (InstallQuery) => {
      console.log("FETCH:");
      console.log(InstallQuery);
      let incomingteam = InstallQuery.teamId;
      let result = await queryOne({"team.id":InstallQuery.teamId});
      console.log(result);
      return result;
    },
  },
});

//LISTENERS GO HERE

app.event('app_home_opened', async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": ":trophy: Goal Tracker :trophy:\n\n  Store-1458",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Leaderboard"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "mrkdwn",
					"text": "*Who's currently winning?*"
				},
				{
					"type": "image",
					"image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX6Fkw11_f3j-XYGQS5MzH_Bfkdu-zrmASwA&usqp=CAU",
					"alt_text": " "
				}
			]
		},
		{
			"type": "divider"
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "image",
					"image_url": "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/Jumpman_logo.svg/1200px-Jumpman_logo.svg.png",
					"alt_text": " "
				},
				{
					"type": "plain_text",
					"emoji": true,
					"text": "Jordan"
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<@WA6C1KQ3W>*\n\n*Customer Interactions*\n:arrow_up: *43%* from last week\n\n*Products Sold*\n:arrow_up: *89%* from last week\n\n*Upsold*\n:arrow_up: *18%* from last week\n"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://ca.slack-edge.com/EA62SV8QZ-WA6C1KQ3W-97ae19bb4b38-512",
				"alt_text": " "
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "image",
					"image_url": "https://www.logolynx.com/images/logolynx/2a/2ab5aba3124262970e5235e1758db9df.jpeg",
					"alt_text": " "
				},
				{
					"type": "plain_text",
					"emoji": true,
					"text": "Running"
				}
			]
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*<@WA62TKZU1>*\n\n*Customer Interactions*\n:arrow_up: *27%* from last week\n\n*Products Sold*\n:arrow_up: *76%* from last week\n\n*Upsold*\n:arrow_up: *27%* from last week\n"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://ca.slack-edge.com/EA62SV8QZ-WA62TKZU1-dd221d73f46e-512",
				"alt_text": " "
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Total Products Sold*        🟩🟩🟩🟩🟩🟩🟩🟩82%\n*Revenue Target*               🟩🟩🟩🟩🟩🟩 62%\n*Jordan Promo Contest*   🟩🟩🟩🟩🟩🟩🟩🟩🟩 94%"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://icon-library.com/images/statistics-icon/statistics-icon-5.jpg",
				"alt_text": " "
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Active Promotions January-February 2021",
				"emoji": true
			}
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": ":one: *Up To 40% off Select Reacts*"
				}
			]
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": ":two: *Sustainable Materials extra sale - 10% extra off*"
				}
			]
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Ends March 1st, 2021",
					"emoji": true
				}
			]
		}
	]
}
    });
  }
  catch (error) {
    console.error(error);
  }
});

//BOILERPLATE BELOW HERE

//look up any one document from a query string
function queryOne(query) {
  return new Promise((resolve, reject) => {
    db.findOne(query, (err, docs) => {
      if (err) console.log("There's a problem with the database: ", err);
      else if (docs) console.log(query + " queryOne run successfully.");
      resolve(docs);
    });
  });
}

//print the whole database (for testing)
function printDatabase() {
  db.find({}, (err, data) => {
    if (err) console.log("There's a problem with the database: ", err);
    else if (data) console.log(data);
  });
}

//clear out the database
function clearDatabase(team,channel) {
  db.remove({team:team, channel:channel}, { multi: true }, function(err) {
    if (err) console.log("There's a problem with the database: ", err);
    else console.log("database cleared");
  });
}
(async () => {
  // boilerplate to start the app
  await app.start(process.env.PORT || 3000);
  //printDatabase();
  console.log("⚡️ Bolt app is running!");
})();
