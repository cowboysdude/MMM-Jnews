This repository is maintained by Cowboysdude 
[This is the second version of this module for MagicMirror2]

# MMM-Jnews V2.0

**News for your Mirror**


## Examples

![](capture.png) 

*Automatically adjusts languge and all other settings based on your config.js!
[Will ONLY work for these language - ar,de,en,es,fr,zh,it,nl,ru,he,no,pt,se,ud]

## Your terminal installation instructions

* `git clone https://github.com/cowboysdude/MMM-Jnews` into the `~/MagicMirror/modules` directory.
*  `~MagicMirror/modules/MMM-Jnews`
*  `npm install`

## Get your free API key here 

 [https://newsapi.org/)

## Config.js entry and options
       {
        module: 'MMM-Jnews',
        config: {
		     apiKey: "YOUR API KEY",    // https://www.wunderground.com/weather/api  select the middle plan... 
	       image : true or false, [default is false, Raspberry Pi's don't like the images]
         rotateInterval: 25 * 1000 [This is default set to 25 seconds, you can change this if you'd like]
	     }
       },
       
## Start your mirror . . . enjoy! 
