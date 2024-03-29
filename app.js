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
  scopes: ['channels:read','chat:write','commands'], //add scopes here
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
	"type": "home",
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
				"image_url": "https://ca.slack-edge.com/EA62SV8QZ-WA62TKZU1-de03cea18223-512",
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
				"text": "*Membership Signups This Week*\n\n:first_place_medal: - <@WA6NV916H> with 31\n\n:second_place_medal: - <@WA7FN568N> with 29\n\n:third_place_medal: - <@WA5TRPRQ8> with 19\n\n*Total Signups for 1458*: 120"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://s3.amazonaws.com/nikeinc/assets/54289/Nike-Plus-Icon-Only_native_1000.jpg?1458055638",
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
				"text": "*Total Products Sold*       \n 🟩🟩🟩🟩🟩🟩🟩🟩82%\n*Revenue Target*               \n🟩🟩🟩🟩🟩🟩 62%\n*Jordan Promo Contest*   \n🟩🟩🟩🟩🟩🟩🟩🟩🟩 94%"
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
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Nike Lookup App*"
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": ":nike:",
					"emoji": true
				},
				"value": "click_me_123",
				"action_id": "button-action"
			}
		}
	]
}
    });
  }
  catch (error) {
    console.error(error);
  }
});


// The open_modal shortcut opens a plain old modal
app.action('button-action', async ({ body, ack, client }) => {

  try {
    // Acknowledge shortcut request
    await ack();

    // Call the views.open method using one of the built-in WebClients
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
	"callback_id": "nike_lookup_modal",
	"title": {
		"type": "plain_text",
		"text": "Nike Lookup",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": ":nike: Submit",
		"emoji": true
	},  
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Welcome to the lookup! :mag:"
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Select the item category from the below list",
					"emoji": true
				}
			]
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "static_select",
					"placeholder": {
						"type": "plain_text",
						"text": "Select an item",
						"emoji": true
					},
					"options": [
						{
							"text": {
								"type": "plain_text",
								"text": "Shoes",
								"emoji": true
							},
							"value": "value-0"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Clothing",
								"emoji": true
							},
							"value": "value-1"
						},
						{
							"text": {
								"type": "plain_text",
								"text": "Accessories & Equipment",
								"emoji": true
							},
							"value": "value-2"
						}
					],
					"action_id": "actionId-3"
				}
			]
		}
	]
}
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

// Listen for a button invocation with action_id `button_abc` (assume it's inside of a modal)
// You must set up a Request URL under Interactive Components on your app configuration page
app.action('actionId-3', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
    const result = await app.client.views.update({
      token: context.botToken,
      // Pass the view_id
      view_id: body.view.id,
      // View payload with updated blocks
      view: {
	"title": {
		"type": "plain_text",
		"text": "Nike Shoe Lookup",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": ":nike: Submit",
		"emoji": true
	},
	"type": "modal",
	"callback_id": "shoe_lookup",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Type in Name, SKU, or Category! We'll find it.",
				"emoji": true
			}
		}
	]
}
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});


app.view("shoe_lookup", async ({ ack, body, view, context }) => {
  try {

    await ack({
      response_action:"update",
      view:{
	"title": {
		"type": "plain_text",
		"text": "Nike Shoe Lookup",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": ":nike: Submit",
		"emoji": true
	},
	"type": "modal",
	"callback_id": "found_shoe",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "image",
			"title": {
				"type": "plain_text",
				"text": "Womens - Nike React Infinity Run Flyknit 2",
				"emoji": true
			},
			"image_url": "https://static.nike.com/a/images/f_auto/dpr_2.0/w_1680,c_limit/28ad4584-92b2-43a3-9610-63327b8aea51/womens-shoes-clothing-accessories.jpg",
			"alt_text": " "
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Enter Size",
				"emoji": true
			}
		},
		{
			"type": "input",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select color",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Violet Dust/Black/Cyber/Elemental Pink",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Anthracite/Black/Lagoon Pulse/Ghost",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "White/Platinum Tint/Light Zitron/White",
							"emoji": true
						},
						"value": "value-2"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Black/Iron Grey/White",
							"emoji": true
						},
						"value": "value-3"
					}
				],
				"action_id": "static_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Select Color",
				"emoji": true
			}
		}
	]
}
	    
    });

  } catch (error) {
    console.error(error);
  }
});

app.view("found_shoe", async ({ ack, body, view, context }) => {
	await ack();
  try {
//	  console.log("CONTEXT:");
//	  console.log(context);
//	  console.log("BODY:");
//	  console.log(body);
	  
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: body.user.id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Thank you <@WA62TKZU1> for your submission!\n\n\nPlease check <#C01JRKE063V>"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://static.nike.com/a/images/f_auto/dpr_2.0/w_1680,c_limit/28ad4584-92b2-43a3-9610-63327b8aea51/womens-shoes-clothing-accessories.jpg",
				"alt_text": " "
			}
		},
		{
			"type": "context",
			"elements": [
				{
					"type": "plain_text",
					"text": "Teams typically reply within minutes to confirm inventory",
					"emoji": true
				}
			]
		}
	],
      // Text in the notification
      text: 'Message from Nike Retail'
    });
    console.log(result); 
	  
	  const result2 = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: "C01JRKE063V",
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Hi @here! New request from Nike Store 1458"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://static.nike.com/a/images/f_auto/dpr_2.0/w_1680,c_limit/28ad4584-92b2-43a3-9610-63327b8aea51/womens-shoes-clothing-accessories.jpg",
				"alt_text": " "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Details*\nWomen's Nike React Infinity Run Flyknit 2 - <https://www.nike.com/t/react-infinity-run-flyknit-2-womens-running-shoe-jjdZzC/CT2423-500|more info>\n\n*Style* - CT2423-500\n*Color*: Violet Dust/Black/Cyber/Elemental Pink"
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "In Stock - Page Store 1458 :white_check_mark:",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "actionId-instock",
					"style": "primary"
				}
			]
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Cannot Locate/Out of Stock ",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "actionId-0",
					"style": "danger"
				}
			]
		}
	],
      // Text in the notification
      text: 'Message from Nike Retail'
    });
    console.log(result2); 

  } catch (error) {
    console.error(error);
  }
});

app.action('actionId-instock', async ({ ack, body, context }) => {
  // Acknowledge the button request
  ack();

  try {
	  console.log("BODY");
	  console.log(body);
	  console.log("CONTEXT");
	  console.log(context);
    const result = await app.client.chat.update({
     	token: context.botToken,
	channel: "C01JRKE063V",
	ts: body.message.ts,
	blocks: [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Terrific! <@WA62TKZU1>, Nordstrom's has agreed to hold the item(s) for up to 3 hours. Please provide Store Information to our customer:"
			},
			"accessory": {
				"type": "image",
				"image_url": "https://static.nike.com/a/images/f_auto/dpr_2.0/w_1680,c_limit/28ad4584-92b2-43a3-9610-63327b8aea51/womens-shoes-clothing-accessories.jpg",
				"alt_text": " "
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": ":round_pushpin: *Nordstrom* \n701 SW Broadway, Portland, OR 97205 \n503-224-6666 "
			}
		}
	]
    });
    console.log(result);
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
