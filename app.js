// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

function slack() {
  // Listen for a slash command invocation
  app.command("/echo", async ({ ack, payload, context }) => {
    //console.log( "pokemon : "  + pokemonImage);
    // Acknowledge the command request
    ack();
    const pokemonQ = require("pokemon-random")();
    var pokemon = pokemonQ.toLowerCase();
    console.log("pokemon", pokemon);
    function pk(pokemon) {
      console.log(pokemon);
      //console.log("https://pokeapi.co/api/v2/pokemon/" + pokemon);
      var tab = "";
      var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
      var xhr = new XMLHttpRequest();
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open(
        "GET",
        "https://pokeapi.co/api/v2/pokemon/" + pokemon,
        false
      );
      xmlHttp.send(null);
      return xmlHttp.responseText;
      // console.log(xmlHttp);
    }

    var pokemonData = pk(pokemon);
    var pokemonObject = JSON.parse(pokemonData);
    // console.log(pokemonObject);
    var pokemonImage = "";
    var nb1 = Math.floor(Math.random() * 10);
    var nb2 = Math.floor(Math.random() * 10);
    $(pokemonObject).each(function(index, value) {
      //console.log(value.sprites.front_default);
      if (nb1 == nb2) {
        pokemonImage += value.sprites.front_shiny;
      } else {
        pokemonImage += value.sprites.front_default;
      }
    });
    console.log(pokemonImage);
    try {
      const result = await app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: payload.channel_id,
        // Include a button in the message (or whatever blocks you want!)
        blocks: [
          {
            type: "image",
            title: {
              type: "plain_text",
              text: "your pokemon is ... "
            },
            image_url: pokemonImage,
            alt_text: "image1"
          }
        ],
        // Text in the notification
        text: "Message from pokebot"
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });
}

function congé() {
  // Listen for a slash command invocation
  app.command("/congé", async ({ ack, payload, context }) => {
    //console.log( "pokemon : "  + pokemonImage);
    // Acknowledge the command request
    ack();

    try {
      const result = await app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: payload.channel_id,
        // Include a button in the message (or whatever blocks you want!)
        blocks: [
          {
            title: {
              type: "plain_text",
              text: "Modal Title"
            },
            submit: {
              type: "plain_text",
              text: "Submit"
            },
            type: "modal",
            blocks: [
              {
                type: "input",
                element: {
                  type: "plain_text_input"
                },
                label: {
                  type: "plain_text",
                  text: "Label",
                  emoji: true
                }
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "conversations_select",
                    placeholder: {
                      type: "plain_text",
                      text: "Select private conversation",
                      emoji: true
                    },
                    filter: {
                      include: ["private"]
                    },
                    action_id: "actionId-0"
                  }
                ]
              }
            ]
          }
        ],
        // Text in the notification
        text: "Message from congé"
      });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  });
}

slack();
// All the room in the world for your code
(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

app.event("app_home_opened", async ({ event, client, context }) => {
  try {
    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await client.views.publish({
      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view object that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Welcome to your _App's Home_* :tada:"
            }
          },
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "This button won't do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app."
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Click me!"
                }
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
  }
});
