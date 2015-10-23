# POD Assistant - IOS 

POD Assistant is a mobile application built to be used by assistants at Point of Dispensing locations during a medical emergency. This application can be used as an example of building mobile apps using Appcelerator Titanium, and it can be customized for other uses.

### Usage
Edit the config.json and set MockDataMode to true.
```sh
{
   	"MockDataMode": true,
}
```

Alternatively, you can set up a web service to output data similar to that in app/lib/mockdata.js for the corresponding endpoints. You can add a file named /app/lib/privateconfig.js with the following data to setup basic authentication. 
```sh
{
   	"Username": "<YOUR_USERNAME>",
	"Password": "<YOUR_PASSWORD>",
	"PodLocation": "<POD_LOCATION_CODE>",
	"PodLocationPassword": "<POD_LOCATION_PASSWORD>"
}
```

