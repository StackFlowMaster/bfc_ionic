angular.module('bfc')
.service('languageService', function ($q, $http, BACKEND_API, HEADERS, Utils, $localstorage) {
	var self = this;

    self.language_list = [];

    self.get_languages = function() {
        
        Utils.show();

        var defer = $q.defer();

        var req = {
            method: 'GET',
            url: BACKEND_API + '/get_languages',
            // data : data,
            headers: HEADERS
        };

        $http(req).
        success(function(data, status, headers, config) {
            Utils.hide();
            
            if (data.state == "success") {
                for (var i = 0; i < data.result.length; i++) {
                    if (data.result[i].language_name == "english") {
                        data.result[i].label = titleCase(data.result[i].language_translated_name);
                    } else {
                        data.result[i].label = titleCase(data.result[i].language_name + " - " + data.result[i].language_translated_name);
                    };
                };

                data.result = data.result.sort( predicatBy("language_name") );

                self.language_list = data.result;

                self.set_language_list();

                defer.resolve(data.result);
            } else {
                defer.reject("BFC API has some issue for now.");
            };
        }).
        error(function(data, status, headers, config) {
            Utils.hide();
            console.log(data);
            defer.reject('An error occured while communicating to the server.');
        });

        return defer.promise;
    }

    self.set_language_list = function() {
        $localstorage.setObject("language_list", self.language_list);
    };

    self.get_language_list = function() {
        return $localstorage.getObject("language_list");
    };

	self.set_current_language = function(lang) {
        /*
        "language_id":"1",
        "language_name":"english",
        "language_translated_name":"English",
        "language_iso":"en",
        "language_direction":"ltr",
        "language_status":"1",
        "language_created_date":"2016-11-28 13:08:25"
        */

        $localstorage.setObject("cur_lang", lang);
	};

	self.get_current_language = function() {
        var cur = $localstorage.getObject("cur_lang");
        
        if (isEmpty(cur)) {
            cur = {
                "language_id":"1",
                "language_name":"english",
                "language_translated_name":"English",
                "language_iso":"en",
                "language_direction":"ltr",
                "language_status":"1",
                "language_created_date":"2016-11-28 13:08:25"
            }
        }

        return cur;

	};

	self.languages = [
		{
	  		url : "/languages/acehnese/stories.php",
  			title : "Acehnese - Basa Acèh"
		},
		{
            url : "/languages/acholi/stories.php",
            title : "Acholi"
		},
		{
            url : "/languages/afaan_oromoo/stories.php",
			title : "Afaan Oromoo"
		},
		{
            url : "/languages/afrikaans/stories.php",
        	title : "Afrikaans"
		},
		{
            url : "/languages/albanian/stories.php",
        	title : "Albanian"
		},
		{
            url : "/languages/amharic/stories.php",
        	title : "Amharic - አማርኛ"
		},
		{
            url : "/languages/ao/stories.php",
        	title : "Ao"
		},
		{
            url : "/languages/arabic/stories.php",
        	title : "Arabic - العربية"
		},
		{
            url : "/languages/armenian/stories.php",
        	title : "Armenian - հայերեն"
		},
		{
            url : "/languages/assamese/stories.php",
        	title : "Assamese"
		},
		{
            url : "/languages/ateso/stories.php",
        	title : "Ateso"
		},
		{
            url : "/languages/azerbaijan/stories.php",
        	title : "Azerbaijan"
		},
		{
            url : "/languages/batak/stories.php",
        	title : "Batak - Batak Toba"
		},
		{
            url : "/languages/bemba/stories.php",
        	title : "Bemba"
		},
		{
            url : "/languages/bengali/stories.php",
        	title : "Bengali - মনিপুরি ëমëতলোল)"
		},
		{
            url : "/languages/bhojpuri/stories.php",
        	title : "Bhojpuri - भोजपुरी"
		},
		{
            url : "/languages/bodo/stories.php",
        	title : "Bodo - ब’र’/बॉडॉ BODO- राव"
		},
		{
            url : "/languages/bugis/stories.php",
        	title : "Bugis - Basa Ugi"
		},
		{
            url : "/languages/bulgarian/stories.php",
        	title : "Bulgarian - Български"
		},
		{
            url : "/languages/burmese/stories.php",
        	title : "Burmese - မြန်မာစာ"
		},
		{
		    url : "/languages/changana/stories.php",
        	title : "Changana"
    	},
		{
		    url : "/languages/chhattisgarhi/stories.php",
            title : "Chhattisgarhi - छत्तीसगढ़ी"
        },
		{
		    url : "/languages/chichewa/stories.php",
        	title : "Chichewa"
        },
        {
            url : "/languages/chinese/stories.php",
        	title : "Chinese - 简体中文"
        },
		{
		    url : "/languages/chinese_traditional/stories.php",
        	title : "Chinese - Traditional - 繁體中文"
        },
        {
            url : "/languages/czech/stories.php",
        	title : "Czech - čeština"
        },
		{
		    url : "/languages/dhundhari/stories.php",
		    title : "Dhundhari"
		},
    	{
    	    url : "/languages/dutch/stories.php",
    	    title : "Dutch - Nederlands"
    	},
        {
            url : "/languages/emakuwa/stories.php",
            title : "Emakuwa"
        },
        {
       	    url : "/languages/english/stories.php",
       	    title : "English"
       	},	
        {
       	    url : "/languages/estonian/stories.php",
       	    title : "Estonian - Eesti keeles"
       	},
		{
		    url : "/languages/finnish/stories.php",
		    title : "Finnish - Suomi"
        },
        {
            url : "/languages/french/stories.php",
            title : "French - Français"
        },
        {
        	url : "/languages/gaelic/stories.php",
        	title : "Gaelic"
        },
        {
            url : "/languages/garo/stories.php",
            title : "Garo - garo"
        },
        {
            url : "/languages/german/stories.php",
            title : "German - Deutsch"
        },
        {
            url : "/languages/greek/stories.php",
            title : "Greek - Ελληνικά"
        },
		{
			url : "/languages/gujarati/stories.php",
			title : "Gujarati - gujarati"
		},
		{
		    url : "/languages/gujarati_script/stories.php",
		    title : "Gujarati Script - દ્ધાુજરાતી"
		},
		{
		    url : "/languages/hadoti/stories.php",
		    title : "Hadoti - हाड़ोती"
		},
		{
		    url : "/languages/haitian/stories.php",
		    title : "Haitian - Kréyol Ayisyen"
        },
        {
            url : "/languages/hakha/stories.php",
            title : "Hakha"
        },
        {
        	url : "/languages/haryanvi/stories.php",
        	title : "Haryanvi"
        },
        {
        	url : "/languages/hausa/stories.php",
        	title : "Hausa"
        },
		{
		    url : "/languages/hebrew/stories.php",
		    title : "Hebrew -  עברית"
        },
        {
            url : "/languages/hiligaynon/stories.php",
            title : "Hiligaynon"
        },
        {
            url : "/languages/hindi/stories.php",
            title : "Hindi - हिंदी"
        },
		{
		    url : "/languages/hmongb/stories.php",
		    title : "Hmongb Blue - lol Hmongb"
		},
		{
		    url : "/languages/hungarian/stories.php",
		    title : "Hungarian - Magyar"
        },
        {
            url : "/languages/icelandic/stories.php",
            title : "Icelandic - Íslenska"
        },
        {
        	url : "/languages/igbo/stories.php",
        	title : "Igbo"
        },
		{
		    url : "/languages/indonesian/stories.php",
		    title : "Indonesian - Bahasa Indonesia"
        },
        {
            url : "/languages/italian/stories.php",
            title : "Italian - Italiano"
        },
		{
		    url : "/languages/japanese/stories.php",
		    title : "Japanese - 日本語"
        },
        {
            url : "/languages/javanese/stories.php",
            title : "Javanese - Basa Jawa Prasaja"
        },
		{
		    url : "/languages/kannada/stories.php",
		    title : "Kannada - ಕನ್ನಡ"
        },
        {
            url : "/languages/karbi/stories.php",
            title : "Karbi - Mikir"
        },
		{
		    url : "/languages/kinyarwanda/stories.php",
		    title : "Kinyarwanda"
		},
		{
		    url : "/languages/kirundi/stories.php",
		    title : "Kirundi"
		},	
		{
		    url : "/languages/konkani/stories.php",
		    title : "Konkani - कोंकणी"
        },
        {
            url : "/languages/konyak/stories.php",
            title : "Konyak"
        },
        {
            url : "/languages/korean/stories.php",
            title : "Korean - 한국어"
        },
		{
		    url : "/languages/kui/stories.php",
		   title :  "Kui - କୁଈ"
        },
        {
            url : "/languages/lomwe/stories.php",
            title : "Lomwe"
		},
        {
            url : "/languages/low_german/stories.php",
            title : "Low German - Plautdietsch"
        },
        {
            url : "/languages/lozi/stories.php",
            title : "Lozi"
        },
		{
		    url : "/languages/luganda/stories.php",
		    title : "Luganda - Oluganda"
        },
        {
            url : "/languages/lusoga/stories.php",
            title : "Lusoga"
        },
		{
		    url : "/languages/madurese/stories.php",
		    title : "Madurese - Madhura"
        },
        {
            url : "/languages/maithili/stories.php",
            title : "Maithili - maithili"
        },
		{
		    url : "/languages/malagasy/stories.php",
		    title : "Malagasy"
		},	
		{
		    url : "/languages/malay/stories.php",
		    title : "Malay - Bahasa Melayu"
        },
        {
            url : "/languages/malayalam/stories.php",
            title : "Malayalam - മലയാളം"
        },
		{
		    url : "/languages/mara/stories.php",
		    title : "Mara - Nahmapa rei palasa ma y"
        },
        {
            url : "/languages/marathi/stories.php",
            title : "Marathi - मराठी"
        },
		{
		    url : "/languages/marwari/stories.php",
		    title : "Marwari"
		},
		{
		    url : "/languages/meitei_manipuri/stories.php",
		    title : "Meitei Manipuri - মৈতৈলোন্"
        },
        {
            url : "/languages/menya/stories.php",
            title : "Menya"
        },
		{
		    url : "/languages/mizo/stories.php",
		    title : "Mizo"
		},
		{
		    url : "/languages/mongolian/stories.php",
		    title : "Mongolian - Монгол хэл"
        },
        {
            url : "/languages/nepali/stories.php",
            title : "Nepali - नेपाली भाषा"
        },
		{
		    url : "/languages/nias/stories.php",
		    title : "Nias- Li Niha"
        },
        {
            url : "/languages/odiya/stories.php",
            title : "Odiya - ଓଡ଼ିଆ"
        },
		{
		    url : "/languages/persian/stories.php",
		    title : "Persian - فارسی"
        },
        {
            url : "/languages/phom/stories.php",
            title : "Phom"
        },
		{
		    url : "/languages/polish/stories.php",
		    title : "Polish - Polski"
        },
        {
            url : "/languages/portuguese/stories.php",
            title : "Portuguese - Português"
        },
		{
		    url : "/languages/punjabi/stories.php",
		    title : "Punjabi - ਪੰਜਾਬੀ"
		},
		{
		    url : "/languages/rajbanshi/stories.php",
		    title : "Rajbanshi - rajbanshi"
        },
        {
            url : "/languages/romanian/stories.php",
            title : "Romanian -  Română"
        },
		{
		    url : "/languages/rongmei/stories.php",
		    title : "Rongmei"
		},
		{
		    url : "/languages/runyankore/stories.php",
		    title : "Runyankore"
		},
		{
		    url : "/languages/runyoro/stories.php",
		    title : "Runyoro - Runyoro Rutooro"
        },
        {
            url : "/languages/russian/stories.php",
            title : "Russian - Pусский"
        },
		{
		    url : "/languages/sadri/stories.php",
		    title : "Sadri - सादरी"
        },
        {
            url : "/languages/santali/stories.php",
            title : "Santali - Satār"
        },
		{
		    url : "/languages/sema/stories.php",
		    title : "Sema - Sumi"
		},
		{
		    url : "/languages/serbian/stories.php",
		    title : "Serbian - Српски"
        },
        {
            url : "/languages/setswana/stories.php",
            title : "Setswana"
        },
        {
            url : "/languages/shona/stories.php",
            title : "Shona"
        },
		{
		    url : "/languages/sinhalese/stories.php",
		    title : "Sinhalese - සිංහල"
		},
		{
		    url : "/languages/somali/stories.php",
		    title : "Somali - Af-Soomaali"
        },
        {
            url : "/languages/spanish/stories.php",
            title : "Spanish - Español"
        },
		{
		    url : "/languages/sundanese/stories.php",
		    title : "Sundanese - Sunda"
		},
		{
		    url : "/languages/swahili/stories.php",
		    title : "Swahili"
		},
		{
		    url : "/languages/tagalog/stories.php",
		    title : "Tagalog - Filipino"
       	},
       	{
       	    url : "/languages/tamil/stories.php",
       	    title : "Tamil - தமிழ்"
       	},
		{
		    url : "/languages/tangkhul/stories.php",
		    title : "Tangkhul"
		},
		{
		    url : "/languages/tedimchin/stories.php",
		    title : "Tedim Chin - Sukte"
        },
        {
            url : "/languages/telugu/stories.php",
            title : "Telugu - తెలుగు"
        },
		{
		    url : "/languages/thadou/stories.php",
		    title : "Thadou - thadou"
        },
        {
            url : "/languages/thai/stories.php",
            title : "Thai - ภาษาไทย"
        },
		{
		    url : "/languages/tigrigna/stories.php",
		    title : "Tigrigna - ትግርኛ"
        },
        {
            url : "/languages/tonga/stories.php",
            title : "Tonga - Tongan"
        },
		{
		    url : "/languages/tumbuka/stories.php",
		    title : "Tumbuka - chiTumbuka"
        },
        {
            url : "/languages/turkish/stories.php",
            title : "Turkish - Türkçe"
        },
		{
		    url : "/languages/ukrainian/stories.php",
		    title : "Ukrainian - Українська"
        },
        {
            url : "/languages/urdu/stories.php",
            title : "Urdu -  سیکشن ایف"
        },
		{
		    url : "/languages/uzbek/stories.php",
		    title : "Uzbek"
		},			
		{
		    url : "/languages/vietnamese/stories.php",
		    title : "Vietnamese - tiếng Việt"
        },
        {
            url : "/languages/wagdi/stories.php",
            title : "Wagdi - वागडी"
        },
		{
		    url : "/languages/welsh/stories.php",
		    title : "Welsh"
		},
		{
		    url : "/languages/xhosa/stories.php",
		    title : "Xhosa"
		},
		{
		    url : "/languages/yao/stories.php",
		    title : "Yao"
		},
		{
		    url : "/languages/yoruba/stories.php",
		    title : "Yoruba - Oluwashina Oluwadimu"
        },
        {
            url : "/languages/zulu/stories.php",
            title : "Zulu"
        }
	];	
});