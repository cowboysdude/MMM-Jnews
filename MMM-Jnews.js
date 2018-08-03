/* Magic Mirror
 * Module: MMM-PNews
 *
 * By Cowboysdude
 * MIT Licensed.
 */
Module.register("MMM-Jnews", {

    // Module config defaults.
    defaults: {
        updateInterval: 60 * 60 * 1000, // every 10 minutes
        animationSpeed: 110,
        initialLoadDelay: 5, // 0 seconds delay
        retryDelay: 2500,
        rotateInterval: 30 * 1000,
        apiKey: "",
		image: false,
		clang: ""
    },
	
	langTrans: {
            "ar": "ar",
            "de": "de",
            "en": "en",
            "es": "es",
            "fr": "fr",
            "zh_cn": "zh",
            "it": "it",
            "nl": "nl",
            "ru": "ru",
			"he": "he",
            "no": "no",
            "pt": "pt",
            "se": "se",
            "ud": "ud",
			"sv": "nl",
        },
		
	//	 getTranslations: function() {
    //    return {
    //        de: "translations/de.json"
    //    };

  //  },

    getScripts: function() {
        return ["moment.js"];
    },

    getStyles: function() {
        return ["MMM-Jnews.css"];
    },
	
	

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);
        this.config.lang = this.config.lang || config.language;
		var lang = this.langTrans[config.language];
        this.loaded = true;
        this.sendSocketNotification("CONFIG", this.config);   
        this.url = this.getUrl();
        this.news = {};
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
		this.getNews();
		console.log(this.url);
    },
	
	getUrl: function() {
		var url = null;
		 clang = this.config.clang;
		 key = this.config.apiKey;
		 
		console.log(this.config.lang+ " " +key);

		if (clang != "") {
			url = "https://newsapi.org/v2/top-headlines?language="+clang+"&pageSize=50&apiKey="+key
		} else   {
			url = "https://newsapi.org/v2/top-headlines?language="+this.config.lang+"&pageSize=50&apiKey="+key
		} 
		return url;
	},


    scheduleCarousel: function() {
        console.log("Scheduling items");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.classList.add("container");


        var keys = Object.keys(this.news);
        if (keys.length > 0) {
            if (this.activeItem >= keys.length) {
                this.activeItem = 0;
            }
            var news = this.news[keys[this.activeItem]];

            date = moment(news.publishedAt).format("MM-DD-YYYY");
            time = moment(news.publishedAt).valueOf();

		 if (this.config.image === true){	
			if ( typeof news.urlToImage == "string" && news.urlToImage !== null){
            var ully = document.createElement("div");
            ully.classList.add("fixed");
            var Icon = document.createElement("img");
            Icon.classList.add("image");
            Icon.src = news.urlToImage;
            ully.appendChild(Icon);
            wrapper.appendChild(ully); 
		    }
		 }
		 
            function timeago(date) {
                var seconds = Math.floor((new Date() - time) / 1000);
                if (Math.round(seconds / (60 * 60 * 24 * 365.25)) >= 2) return Math.round(seconds / (60 * 60 * 24 * 365.25)) + " years ago";
                else if (Math.round(seconds / (60 * 60 * 24 * 365.25)) >= 1) return "1 year ago";
                else if (Math.round(seconds / (60 * 60 * 24 * 30.4)) >= 2) return Math.round(seconds / (60 * 60 * 24 * 30.4)) + " months ago";
                else if (Math.round(seconds / (60 * 60 * 24 * 30.4)) >= 1) return "1 month ago";
                else if (Math.round(seconds / (60 * 60 * 24 * 7)) >= 2) return Math.round(seconds / (60 * 60 * 24 * 7)) + " weeks ago";
                else if (Math.round(seconds / (60 * 60 * 24 * 7)) >= 1) return "1 week ago";
                else if (Math.round(seconds / (60 * 60 * 24)) >= 2) return Math.round(seconds / (60 * 60 * 24)) + " days ago";
                else if (Math.round(seconds / (60 * 60 * 24)) >= 1) return "1 day ago";
                else if (Math.round(seconds / (60 * 60)) >= 2) return Math.round(seconds / (60 * 60)) + " hours ago";
                else if (Math.round(seconds / (60 * 60)) >= 1) return "1 hour ago";
                else if (Math.round(seconds / 60) >= 2) return Math.round(seconds / 60) + " minutes ago";
                else if (Math.round(seconds / 60) >= 1) return "1 minute ago";
                else if (seconds >= 2) return this.translate("seconds ago");
                else return  "seconds ago";
            }

            var dcontain = document.createElement("div");
            dcontain.classList.add("flex-item","dateColor");
            dcontain.innerHTML = date + "<br> " + news.source.name + "<br>" + (this.translate(timeago(date)));
            wrapper.appendChild(dcontain);

            var nextThis = document.createElement("div");
            nextThis.classList.add("flex-item");
			if ( typeof news.description == "string" && news.description !== null){
            nextThis.innerHTML = "<font color=white>"+news.title + "</font><br>" + news.description;
			} else {
			nextThis.innerHTML = news.title;
			}
            wrapper.appendChild(nextThis);

        }
        return wrapper;
    },
	
    processNews: function(data) {
        this.today = data.Today;
        this.news = data.articles;
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getNews();
        }, this.config.updateInterval);

        this.getNews(this.config.initialLoadDelay);
    },

    getNews: function() {
        this.sendSocketNotification('GET_NEWS', this.url);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "NEWS_RESULT") {
            this.processNews(payload);
            if (this.rotateInterval == null) {
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
    }

});
