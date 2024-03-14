<h1 align="center">TwitchBlox Localhost Server</h1>
<div align="center">
	A Twitch integration that exposes events like donations, raids, shouts, and more to be accessible within client-sided Roblox experiences.
</div>

## Table of Contents
1. [Overview](#overview) 
2. [Installation Guide](#installation-guide)
3. [Project Status and Roadmap](#project-status-and-roadmap)
<br/><br/><br/>



## Overview
One of the many joys of streaming on Twitch is interacting with viewers in chat. The goal of this integration is to allow for viewers to directly interact with the streamer's Roblox experience, while providing the flexibility and extensibility of a library that anyone can build on top of. This integration comes in 4 parts :
</div>

### 1) A Twitch Application
This piece simply registers the clientside application with Twitch.
<br/>

### 2) A Locally Hosted Server
This is the necessary evil of the project. Since Roblox's HttpService does not allow for socket connections, Roblox cannot connect to Twitch directly. To sidestep this limitation, this NodeJS server exists as an in-between that Roblox can long-poll for updates.
<br/>

### 3) A Lua Library - [TwitchBlox](https://github.com/Kylaaa/TwitchBlox)
All of the business logic of connecting to the local server, authenticating with Twitch, restoring the previous session, long-polling for updates, and exposing the events to Roblox is handled in this library. Anyone that wants to build a game or plugin of their own would be able to use this library as the starting point for their own project.
<br/>

### 4) A Roblox Studio Plugin - [KidsInASandblox](https://create.roblox.com/marketplace/plugins?creatorName=&includeOnlyVerifiedCreators=true&keyword=kidsinasandblox&pageNumber=1&querySource=0)
Anything can use the library, but I've designed this project specifically so that users can interact with a Roblox Studio environment.
<br/><br/><br/>




## Installation Guide
### Install the Twitch Application to your channel
TBD
<br/><br/>

### Launch the Localhost server
1. Download the released version of this project.
2. Launch the app. (TBD)
<br/><br/>

### Import the Twitchblox library to your project
Option 1) Wally
1. Add [TwitchBlox](https://wally.run/package/kylaaa/twitchblox) to your `wally.toml` project file. (Not yet published)
2. Download the library with the command `wally install`
<br/>

Option 2) Import directly into your project
1. Download the latest release of the library from the [TwitchBlox](https://github.com/Kylaaa/TwitchBlox) repo.
2. Open Roblox Studio and open your place.
3. Drag the `twitchblox.lua` file into the Workspace. This will unpack the file into a ModuleScript.
4. Drag the ModuleScript to ReplicatedStorage or wherever you are storing your other libraries.
<br/><br/><br/>



## Project Status and Roadmap
Minimum Viable Product
- [✔️] Library interface standardized
- [✔️] Library connects to localhost server
- [✔️] Localhost server Authenticates with Twitch
- [✔️] Localhost server observes cheers and donation events and stores the information
- [✔️] Localhost server API standardized
- [❌] Roblox Studio Plugin logs observed events

Expected Polish Before Release
- [❌] Library configuration allows for custom Twitch rewards
- [❌] Roblox Studio Plugin displays shouts and donations
- [✔️] Localhost server observes any supported event

Nice to Have
- [❌] GitAction to package the localhost server into an executable.
- [❌] Donators appear as NPCs in the plugin's ViewportFrame.
