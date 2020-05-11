const Alexa = require("ask-sdk-core");
const moment = require("moment-timezone");

const FeedingEvent = require("../../models/feeding-event");

// Alexa handlers
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const speechText = "Hello Stacey  - Your skill has launched";

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard("Hello World", speechText)
      .getResponse();
  },
};
// TODO: Hardcoding this to work just for Stacey/Isla's account for now until I figure out how to map Alexa users to this app's users
const LogFeedingEventRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AddFeedingEventIntent"
    );
  },

  async handle(handlerInput) {
    const time = handlerInput.requestEnvelope.request.intent.slots.time.value;
    const amount =
      handlerInput.requestEnvelope.request.intent.slots.amount.value;

    console.log(time);

    const serviceClientFactory = handlerInput.serviceClientFactory;
    const deviceId =
      handlerInput.requestEnvelope.context.System.device.deviceId;
    console.log(deviceId);

    let userTimeZone;
    try {
      const upsServiceClient = serviceClientFactory.getUpsServiceClient();
      userTimeZone = await upsServiceClient.getSystemTimeZone(deviceId);
      console.log(userTimeZone);
    } catch (error) {
      if (error.name !== "ServiceError") {
        return handlerInput.responseBuilder
          .speak("There was a problem connecting to the service.")
          .getResponse();
      }
      console.log("error", error.message);
    }
    console.log("userTimeZone", userTimeZone);

    // getting the current date with the time
    let fedOn = new Date();

    if (time) {
      moment.tz.setDefault(userTimeZone);
      fedOn = moment(time, "HH:mm");
    }

    console.log(fedOn.toISOString());

    console.log(
      `Received new Alexa intent with amount:${amount} and time:${time}`
    );

    const newFeedingEvent = new FeedingEvent({
      userEmail: "smcgowan1405@gmail.com",
      amount,
      fedOn: fedOn.toISOString(),
    });

    await newFeedingEvent.save();

    const speakOutput = time
      ? `Thanks Stacey, I'll log Isla's feeding event of ${amount} ounces at ${time}`
      : `Thanks Stacey, I'll log Isla's feeding event of ${amount} ounces`;
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

module.exports = { LaunchRequestHandler, LogFeedingEventRequestHandler };
