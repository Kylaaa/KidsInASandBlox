# FOR COMPLETE DOCUMENTATION, SEE : https://dev.twitch.tv/docs/cli/websocket-event-command/
twitch event ws --port 8081 verify-subscription


# YOU CAN TRIGGER MOCK EVENTS WITH THE FOLLOWING COMMAND...
# twitch event trigger EVENT_ID --transport=websocket

# EXAMPLES)
# CHEER - twitch event trigger channel.cheer --transport=websocket

# YOU CAN TEST RECONNECT LOGIC WITH THE FOLLOWING COMMAND...
# twitch event websocket reconnect