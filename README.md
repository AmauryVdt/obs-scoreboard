# OBS Esport Scoreboard

This tool have been made to set up score during Esport streams.

## Start the application

Execute the `.msi` file and follow the wizzard to install the application.

### Shortcut

Some shortcute are set up to permit a use with a stream deck to make the use of this application as easier as possible.

> * `Ctrl+Shift+F`: Switch Teams
> * `Ctrl+Shift+1`: **Increase** the score of the team **1** by one.
> * `Ctrl+Alt+1`: **Decrease** the score of the team **1** by one.
> * `Ctrl+Shift+2`: **Increase** the score of the team **2** by one.
> * `Ctrl+Alt+2`: **Decrease** the score of the team **2** by one.

## Use it on OBS

There is several step to do before you can use this app properly.

### OBS Script

You have to fetch the OBS script at the following location (application installated's location): `C:\Program Files\obs-scoreboard\`.

The script name is: `script.lua`.

Once you know where the script is, you can import it to OBS.

On OBS, find the `Tools` section of the top MenuBar.

Then Click on `Script`.

Click on the `+` button and go the location of the `script.lua` file and double click on it.

The script is now imported, you can close the script window, no more action are needed.

### Source files location

You will find all source files (.txt) at the following location: `C:/wt-esport-scoreboard/`.

Please make sure you've already used the `Submit` button before fetching the file.

### Matches marker

This tool enable to see matches won by anyway you want (Color Source, Image).

But for this you have to name those elements correctly (be carful, it's case sensitive).\

**Team 1:**
> * Team1_Match1
> * Team1_Match2
> * etc

**Team 2:**
> * Team2_Match1
> * Team2_Match2
> * etc

# Developer tools

`npm run tauri dev` to start the developper mode.

`npm run tauri build` to create a distributable using Forge's.