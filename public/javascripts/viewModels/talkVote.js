define(['knockout', 'libs/timer', 'libs/voteSender'], function (ko, timerFactory, voteSender) {
    var viewmodel = function(talkId, talkTitle){
        var self = this;

        self.templateName = "talkVoteTemplate";
        self.talkId = talkId;
        self.talkTitle = talkTitle;

        self.hasError = ko.observable(false);
        self.happyLevel = ko.observable(0);

        var voteNb = 0;

        var updateHappyLevel = function(){
            if(voteNb > 8) self.happyLevel(5);
            else if(voteNb > 6) self.happyLevel(4);
            else if(voteNb > 4) self.happyLevel(3);
            else if(voteNb > 1) self.happyLevel(2);
            else if(voteNb == 1) self.happyLevel(1);
            else self.happyLevel(0);

            voteNb = Math.floor(voteNb / 2);
        };

        var timer = timerFactory.create(500, updateHappyLevel);

        self.vote = function(){
            if(!voteSender.isEnabled()){
                self.hasError(true);
                return;
            }

            if(voteNb <= 0) {
                timer.restart();
                self.happyLevel(1);
            }

            voteNb++;
            voteSender.send(talkId);
        };

        voteSender.enable();
    };

    return {
        create: function(talkId, talkTitle){
            return new viewmodel(talkId, talkTitle);
        }
    };
});