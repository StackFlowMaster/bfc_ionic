angular.module('bfc')
.service('storyService', function ($q, $http, BACKEND_API, HEADERS, languageService, Utils, $localstorage) {
	var self = this;

    self.cur_lang = languageService.get_current_language();
    
    self.get_language_stories = function() {
        
        self.cur_lang = languageService.get_current_language();

        Utils.show();

        var data = toparams({
            lang_id: self.cur_lang.language_id
        });

        var defer = $q.defer();

        var req = {
            method: 'POST',
            url: BACKEND_API + '/get_language_stories',
            data : data,
            headers: HEADERS
        };

        $http(req).
        success(function(data, status, headers, config) {
            Utils.hide();
            
            if (data.state == "success") {
                self.story = data.result;
                defer.resolve(data.result);
            } else {
                self.story = self.get_local_stories();
                defer.reject(self.story);
            };
        }).
        error(function(data, status, headers, config) {
            Utils.hide();
            console.log(data);
            self.story = self.get_local_stories();
            defer.reject(self.story);
        });

        return defer.promise;
    };

    self.set_local_stories = function(stories) {
        /*
        "language_id":"1",
        "language_name":"english",
        "language_translated_name":"English",
        "language_iso":"en",
        "language_direction":"ltr",
        "language_status":"1",
        "language_created_date":"2016-11-28 13:08:25"
        */
        self.cur_lang = languageService.get_current_language();
        var current = self.cur_lang['language_name'];
        if (!current) { current = "english" };

        $localstorage.setObject("local_" + current + "_stories", stories);
    };

    self.get_local_stories = function() {
        self.cur_lang = languageService.get_current_language();
        var current = self.cur_lang['language_name'];
        if (!current) { current = "english" };

        var cur = $localstorage.getObject("local_" + current + "_stories");
        return cur;
    };

    self.update_story_time = function(index, time) {
        var list = self.get_local_stories();
        
        list[index].story_modified_date = time;

        self.set_local_stories(list);
    };

	self.story = [
        {
            'title': 'When God Made Everything',
            'url' : 'When_God_Made_Everything_English_PDA.pdf',
            'type' : 'old' 
        },
        {
            'title': 'The Start of Man\'s Sadness',
            'url' : 'The_Start_of_Mans_Sadness_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Noah and the Great Flood',
            'url' : 'Noah_and_the_Great_Flood_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'God\'s Promise to Abraham',
            'url' : 'Gods_Promise_to_Abraham_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'God Tests Abraham\'s Love',
            'url' : 'God_Tests_Abrahams_Love_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Jacob the Deceiver',
            'url' : 'Jacob_the_Deceiver_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'A Favorite Son Becomes a Slave',
            'url' : 'A_Favorite_Son_Becomes_a_Slave_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'God Honors Joseph the Slave',
            'url' : 'God_Honors_Joseph_the_Slave_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Prince From the River',
            'url' : 'The_Prince_From_the_River_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Prince Becomes a Shepherd',
            'url' : 'The_Prince_Becomes_a_Shepherd_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Goodbye Pharaoh',
            'url' : 'Goodbye_Pharaoh_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Forty Years',
            'url' : 'Forty_Years_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Joshua Takes Charge',
            'url' : 'Joshua_Takes_Charge_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Samson, God\'s Strong Man',
            'url' : 'Samson_Gods_Strong_Man_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Gideon\'s Little Army',
            'url' : 'Gideons_Little_Army_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Ruth - A Love Story',
            'url' : 'Ruth_A_Love_Story_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Samuel, God\'s Boy-Servant',
            'url' : 'Samuel_Gods_BoyServant_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Handsome Foolish King',
            'url' : 'The_Handsome_Foolish_King_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'David the Shepherd Boy',
            'url' : 'David_the_Shepherd_Boy_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'David the King (Part 1)',
            'url' : 'David_the_King_Part_1_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'David the King (Part 2)',
            'url' : 'David_the_King_Part_2_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Wise King Solomon',
            'url' : 'Wise_King_Solomon_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Good Kings, Bad Kings',
            'url' : 'Good_Kings_Bad_Kings_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Man of Fire',
            'url' : 'The_Man_of_Fire_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Elisha, Man of Miracles',
            'url' : 'Elisha_Man_of_Miracles_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Jonah and the Big Fish',
            'url' : 'Jonah_and_the_Big_Fish_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Isaiah Sees the Future',
            'url' : 'Isaiah_Sees_the_Future_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Jeremiah, Man of Tears',
            'url' : 'Jeremiah_Man_of_Tears_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Ezekiel: Man of Visions',
            'url' : 'Ezekiel_Man_of_Visions_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Beautiful Queen Esther',
            'url' : 'Beautiful_Queen_Esther_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Daniel the Captive',
            'url' : 'Daniel_the_Captive_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Daniel and the Mystery Dream',
            'url' : 'Daniel_and_the_Mystery_Dream_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Men Who Would Not Bend',
            'url' : 'The_Men_Who_Would_Not_Bend_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'Daniel and the Lions\' Den',
            'url' : 'Daniel_and_the_Lions_Den_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Great Wall of Nehemiah',
            'url' : 'The_Great_Wall_of_Nehemiah_English_PDA.pdf',
            'type' : 'old'
        },
        {
            'title': 'The Birth of Jesus',
            'url' : 'The_Birth_of_Jesus_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'A Man Sent From God',
            'url' : 'A_Man_Sent_From_God_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'A Terrible Time for Jesus',
            'url' : 'A_Terrible_Time_for_Jesus_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'Jesus Chooses 12 Helpers',
            'url' : 'Jesus_Chooses_12_Helpers_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'The Miracles of Jesus',
            'url' : 'The_Miracles_of_Jesus_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'A Temple Leader Visits Jesus',
            'url' : 'A_Temple_Leader_Visits_Jesus_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'Jesus the Great Teacher',
            'url' : 'Jesus_the_Great_Teacher_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'The Farmer and the Seed',
            'url' : 'The_Farmer_and_the_Seed_English_PDA.pdf',
            'type' : 'new'
        },
        {
            'title': 'Rich Man, Poor Man',
            'url' : 'Rich_Man_Poor_Man_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The Prodigal Son',
            'url' : 'The_Prodigal_Son_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The Good Samaritan',
            'url' : 'The_Good_Samaritan_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The Woman at the Well',
            'url' : 'The_Woman_at_the_Well_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Jesus Stills the Stormy Sea',
            'url' : 'Jesus_Stills_the_Stormy_Sea_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The Girl Who Lived Twice',
            'url' : 'The_Girl_Who_Lived_Twice_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Jesus Heals the Blind',
            'url' : 'Jesus_Heals_the_Blind_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Jesus Feeds 5000 People',
            'url' : 'Jesus_Feeds_5000_People_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Jesus and Lazarus',
            'url' : 'Jesus_and_Lazarus_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Jesus and Zaccheus',
            'url' : 'Jesus_and_Zaccheus_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The First Easter',
            'url' : 'The_First_Easter_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The Birth of the Church',
            'url' : 'The_Birth_of_the_Church_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'The Church Meets Trouble',
            'url' : 'The_Church_Meets_Trouble_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Peter and the Power of Prayer',
            'url' : 'Peter_and_the_Power_of_Prayer_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'From Persecutor to Preacher',
            'url' : 'From_Persecutor_to_Preacher_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Paul\'s Amazing Travels',
            'url' : 'Pauls_Amazing_Travels_English_PDA.pdf',
            'type' : 'new'
        },
         {
            'title': 'Heaven, God\'s Beautiful Home',
            'url' : 'Heaven_Gods_Beautiful_Home_English_PDA.pdf',
            'type' : 'new'
        }
    ];


});