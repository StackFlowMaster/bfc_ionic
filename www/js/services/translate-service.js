angular.module('bfc')
.service('translateService', function ($q, $http, BACKEND_API, HEADERS, languageService, Utils, $localstorage) {
	var self = this;

    self.translate = {};

    self.default_trans = {
        /*
        about : "About",
        bible_stories : "Bible Stories",
        error : "Error",
        header_description : "Bible For Children exists to make Jesus Christ known to children by distributing illustrated Bible stories through: the Web, Cell Phone/PDAs, printed color tracts and coloring books, in many languages.",
        header_footer1 : "All materials on this website are free for non-commercial use and are",
        header_global_keywords : "Bible for Children, children, story, Bible, Bible Story, Bible stories, Sunday School, teaching, Jesus, Jesus Christ, God, Moses, David, kids, free downloads, Christian, education, fun, family, free Bible, free story, free stories, free Bible stories, tra",
        header_lan : "Other Languages",
        header_site : "Bible for Children",
        header_tagline : "Your favorite stories from the Bible. Absolutely free.",
        img_header_alt_text : "Children Standing from all over the world",
        loading : "Loading",
        new_testament : "New Testament",
        old_testament : "Old Testament",
        other_languages : "Other Languages",
        setting : "Setting",
        website : "Website"
        */
        language_translation_id : "1",
        translation : "1",
        translation_about : "About",
        translation_about_text : "Bible For Children exists to make Jesus Christ known to children through distributing illustrated Bible stories and related material in different forms and media, including the World Wide Web, Cell Phone/PDA's, printed color tracts and coloring books, in every language a child may speak.",
        translation_copyright : "All materials on this website are free for non-commercial use and are &copy;",
        translation_donate : "Donate",
        translation_languages : "Other Languages",
        translation_new_testament : "New Testament",
        translation_old_testament : "Old Testament",
        translation_site : "Bible for Children",
        translation_stories : "Bible Stories",
    };
    
    self.get_language_translates = function() {
        
        var cur_lang = languageService.get_current_language();

        Utils.show();

        var data = toparams({
            lang_id: cur_lang.language_id
        });

        var defer = $q.defer();

        var req = {
            method: 'POST',
            url: BACKEND_API + '/get_language_translates',
            data : data,
            headers: HEADERS
        };

        $http(req).
        success(function(data, status, headers, config) {
            Utils.hide();
            
            if (data.state == "success" && data.result.length > 0) {
                self.translate = data.result[0];
                console.log(self.translate);
                defer.resolve(self.translate);
            } else {
                self.translate = self.get_local_translates();
                defer.reject(self.translate);
            };
        }).
        error(function(data, status, headers, config) {
            Utils.hide();
            self.translate = self.get_local_translates();
            defer.reject(self.translate);
        });

        return defer.promise;
    };

    self.set_local_translates = function(trans) {
        $localstorage.setObject("local_translate", trans);
    };

    self.get_local_translates = function() {
        var t = $localstorage.getObject("local_translate");
        if (isEmpty(t)) {
            t = self.default_trans;
        }
        return t;
    };

    self.get_default_translates = function() {
        return self.default_trans;
    };


});