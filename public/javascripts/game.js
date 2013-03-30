// Generated by CoffeeScript 1.6.1
(function() {
  var Game,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Game = (function() {

    function Game(user_id) {
      var _this = this;
      this.user_id = user_id;
      this.selectors = {
        users_table: $('#users-table'),
        category: $('#category'),
        message: $('#message'),
        bet_btn: $('.bet-btn')
      };
      $('#fold').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'fold'
        }));
      });
      $('#raise').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'raise',
          bet: $('input[name=raise]').val()
        }));
      });
      $('#call').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'call'
        }));
      });
      $('#answerA').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'answer',
          answer: $('#answerA').text(),
          button: 'A'
        }));
      });
      $('#answerB').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'answer',
          answer: $('#answerB').text(),
          button: 'B'
        }));
      });
      $('#answerC').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'answer',
          answer: $('#answerC').text(),
          button: 'C'
        }));
      });
      $('#answerD').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'answer',
          answer: $('#answerD').text(),
          button: 'D'
        }));
      });
      $('#joker50').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'joker50'
        }));
      });
      $('#joker_voice').on('click', function() {
        return _this.ws.send(JSON.stringify({
          kind: 'joker_voice'
        }));
      });
      this;
    }

    Game.prototype.start = function() {
      var _this = this;
      this.ws = new WebSocket('ws://localhost:9000/game/join');
      this.ws.onerror = function() {
        return alert("WebSocket Error " + error);
      };
      this.ws.onclose = function() {
        return _this.render({
          message: 'Connection closed'
        });
      };
      this.ws.onopen = function() {};
      this.ws.onmessage = function(e) {
        var data;
        data = JSON.parse(e.data);
        console.log(data.kind);
        switch (data.kind) {
          case 'join':
          case 'quit':
            return _this.render(data, 'users-table', _this.selectors.users_table);
          case 'start':
            return _this.startGame(data);
          case 'category':
            return _this.showCategory(data);
          case 'user_on_turn':
            return _this.betting(data);
          case 'call_or_raise':
            return _this.call_or_raise(data);
          case 'fold':
            return _this.fold(data);
          case 'win':
            return _this.win(data);
          case 'question':
            return _this.askQuestion(data);
          case 'answer':
            return _this.markAnswer(data);
          case 'message':
            return _this.message(data);
          case 'finish_answering':
            return _this.finishAnswering(data);
          case 'more_winners':
            return _this.moreWinners(data);
          case 'mark_right_answer':
            return _this.markRightAnswer(data);
          case 'finish':
            return _this.finishGame(data);
          case 'out_of_points':
            return $('#message-out-of-points').text(data.message);
          case 'joker_50':
            return _this.joker(data);
          case 'update_points':
            return $("#member-" + _this.user_id + " span.points").text(data.message);
          case 'joker_voice':
            return _this.joker_voice(data);
        }
      };
      return this;
    };

    Game.prototype.stop = function() {
      return this.ws.close();
    };

    Game.prototype.render = function(data, tmpl_name, el) {
      var result, template;
      if (tmpl_name == null) {
        tmpl_name = 'status';
      }
      if (el == null) {
        el = $('#status');
      }
      template = $("#" + tmpl_name + "-template").html();
      result = _.template(template, data);
      return el.html(result);
    };

    Game.prototype.joker_voice = function(data) {
      $('#choiceA').show();
      $('#choiceB').show();
      $('#choiceC').show();
      $('#choiceD').show();
      $('#choiceA').text("" + data.choice_answer1 + "%");
      $('#choiceB').text("" + data.choice_answer2 + "%");
      $('#choiceC').text("" + data.choice_answer3 + "%");
      $('#choiceD').text("" + data.choice_answer4 + "%");
      return $('div.jokers').hide();
    };

    Game.prototype.joker = function(data) {
      var answer1, answer2, answer3, answer4;
      answer1 = data.answer1;
      answer2 = data.answer2;
      answer3 = data.answer3;
      answer4 = data.answer4;
      $('#answerA').text(answer1);
      $('#answerB').text(answer2);
      $('#answerC').text(answer3);
      $('#answerD').text(answer4);
      return $('div.jokers').hide();
    };

    Game.prototype.finishGame = function(data) {
      $('#choiceA').hide();
      $('#choiceB').hide();
      $('#choiceC').hide();
      $('#choiceD').hide();
      $('div.jokers').hide();
      $('#timer').hide();
      $('#timer1').hide();
      $('#timer2').hide();
      $('#timer3').hide();
      $('#timer4').hide();
      $('#finish-message').show();
      $('#finish-message').text(data.message);
      $('#message-out-of-points').hide();
      $('#message').hide();
      $("div.user-answer").hide();
      $('div.question').hide();
      $('#bet').hide();
      $('#category').hide();
      $('.betting').removeClass('betting');
      return this.selectors.bet_btn.hide();
    };

    Game.prototype.startGame = function(data) {
      $('#message').show();
      return $('#message').text(data.message);
    };

    Game.prototype.showCategory = function(data) {
      var member, members, _i, _len, _results;
      $('#choiceA').hide();
      $('#choiceB').hide();
      $('#choiceC').hide();
      $('#choiceD').hide();
      $("div.user-answer").hide();
      $('div.jokers').hide();
      $('div.question').hide();
      $('#message').hide();
      $('#bet').show();
      $('#category').show();
      this.render(data, 'category', this.selectors.category);
      $('#bet').text("Залог: " + data.bet);
      members = data.members;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        _results.push($("#member-" + member.uid + " span.points").text(member.points));
      }
      return _results;
    };

    Game.prototype.betting = function(data) {
      var current_player, max_bet, slot, uncall_bet;
      console.log('betting');
      current_player = parseInt(data.user_on_turn);
      max_bet = parseInt(data.max_bet);
      uncall_bet = parseInt(data.user_uncall_bet);
      slot = data.slot;
      $("#timer" + slot).show();
      $("#timer" + slot).pietimer('start');
      $("#timer" + slot).pietimer({
        timerSeconds: 7,
        color: '#234',
        fill: false,
        showPercentage: true,
        callback: function() {
          $("#timer" + slot).hide();
          return $("#timer" + slot).pietimer('reset');
        }
      });
      $('.betting').removeClass('betting');
      $("#member-" + current_player).addClass('betting');
      $('input[name=raise]').attr("min", uncall_bet + 1);
      $('input[name=raise]').attr("value", uncall_bet + 1);
      $('input[name=raise]').attr("max", max_bet);
      $('span.bet').text(uncall_bet);
      if (current_player === this.user_id) {
        return this.selectors.bet_btn.show();
      } else {
        return this.selectors.bet_btn.hide();
      }
    };

    Game.prototype.call_or_raise = function(data) {
      var game_bet, message, user_points, user_uid;
      $('#timer1').hide();
      $('#timer2').hide();
      $('#timer3').hide();
      $('#timer4').hide();
      $('#message').show();
      message = data.message;
      user_uid = data.user_uid;
      game_bet = data.game_bet;
      user_points = data.user_points;
      $('#message').text(message);
      $("#member-" + user_uid + " span.points").text(user_points);
      return $('#bet').text("Залог: " + game_bet);
    };

    Game.prototype.fold = function(data) {
      var message;
      $('#timer1').hide();
      $('#timer2').hide();
      $('#timer3').hide();
      $('#timer4').hide();
      $('#message').show();
      message = data.message;
      return $('#message').text(message);
    };

    Game.prototype.win = function(data) {
      var message, user_points, user_uid;
      console.log('win');
      $('#category').hide();
      $('#bet').hide();
      $('.betting').removeClass('betting');
      this.selectors.bet_btn.hide();
      message = data.message;
      user_uid = data.user_uid;
      user_points = data.user_points;
      $('#message').show();
      $('#message').text(message);
      return $("#member-" + user_uid + " span.points").text(user_points);
    };

    Game.prototype.askQuestion = function(data) {
      var answer1, answer2, answer3, answer4, bet, hasjoker, members, members_out_of_coins, question, _ref, _ref1;
      hasjoker = parseInt(data.hasjoker);
      $('#choiceA').hide();
      $('#choiceB').hide();
      $('#choiceC').hide();
      $('#choiceD').hide();
      console.log('question');
      $('#message').show();
      $('div.jokers').show();
      $("div.user-answer").hide();
      $('#timer').show();
      $('#timer').pietimer('start');
      $('#timer').pietimer({
        timerSeconds: 15,
        color: '#234',
        fill: false,
        showPercentage: true,
        callback: function() {
          $('#timer').hide();
          return $('#timer').pietimer('reset');
        }
      });
      if (hasjoker === 1) {
        $('#joker_voice').show();
      } else {
        $('#joker_voice').hide();
      }
      $('#bet').hide();
      question = data.question;
      answer1 = data.answer1;
      answer2 = data.answer2;
      answer3 = data.answer3;
      answer4 = data.answer4;
      members = data.members;
      members_out_of_coins = data.members_out_of_coins;
      bet = data.bet;
      $('#category').hide();
      $('.betting').removeClass('betting');
      this.selectors.bet_btn.hide();
      $('div.question').show();
      $('h4.question').text(question);
      $('#answerA').text(answer1);
      $('#answerB').text(answer2);
      $('#answerC').text(answer3);
      $('#answerD').text(answer4);
      $('button.right').removeClass('right');
      $('button.check').removeClass('check');
      if ((_ref = this.user_id, __indexOf.call(members, _ref) >= 0)) {
        $('div.question').removeClass('unactive');
        $('#answerA').addClass('btn');
        $('#answerB').addClass('btn');
        $('#answerC').addClass('btn');
        $('#answerD').addClass('btn');
        $('#answerA').addClass('answer');
        $('#answerB').addClass('answer');
        $('#answerC').addClass('answer');
        $('#answerD').addClass('answer');
        $('#message').text("Играете за " + bet + " точки");
        if ((_ref1 = this.user_id, __indexOf.call(members_out_of_coins, _ref1) >= 0)) {
          return $('div.jokers').hide();
        }
      } else {
        $('div.question').addClass('unactive');
        $('#answerA').removeClass('btn');
        $('#answerB').removeClass('btn');
        $('#answerC').removeClass('btn');
        $('#answerD').removeClass('btn');
        $('#answerA').removeClass('answer');
        $('#answerB').removeClass('answer');
        $('#answerC').removeClass('answer');
        $('#answerD').removeClass('answer');
        $('#message').text("Не можете да отговаряте");
        return $('div.jokers').hide();
      }
    };

    Game.prototype.markAnswer = function(data) {
      var button;
      $('#choiceA').hide();
      $('#choiceB').hide();
      $('#choiceC').hide();
      $('#choiceD').hide();
      console.log('markanswer');
      $('div.jokers').hide();
      button = data.message;
      $("#answer" + button).addClass('check');
      $('#answerA').removeClass('btn');
      $('#answerB').removeClass('btn');
      $('#answerC').removeClass('btn');
      $('#answerD').removeClass('btn');
      $('#answerA').removeClass('answer');
      $('#answerB').removeClass('answer');
      $('#answerC').removeClass('answer');
      $('#answerD').removeClass('answer');
      return $('div.question').addClass('unactive');
    };

    Game.prototype.message = function(data) {
      $('#message').show();
      return $('#message').text(data.message);
    };

    Game.prototype.moreWinners = function(data) {
      var member, members, _i, _len, _results;
      $('#message').show();
      $('#message').text(data.message);
      members = data.members;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        _results.push($("#member-" + member.uid + " span.points").text(member.points));
      }
      return _results;
    };

    Game.prototype.markRightAnswer = function(data) {
      var rigth_answer;
      rigth_answer = data.message;
      if ($('#answerA').text() === rigth_answer) {
        return $('#answerA').addClass('right');
      } else if ($('#answerB').text() === rigth_answer) {
        return $('#answerB').addClass('right');
      } else if ($('#answerC').text() === rigth_answer) {
        return $('#answerC').addClass('right');
      } else if ($('#answerD').text() === rigth_answer) {
        return $('#answerD').addClass('right');
      }
    };

    Game.prototype.finishAnswering = function(data) {
      var member, members, time, _i, _len, _results;
      $('#choiceA').hide();
      $('#choiceB').hide();
      $('#choiceC').hide();
      $('#choiceD').hide();
      $('#message').hide();
      $('div.jokers').hide();
      $('#answerA').removeClass('btn');
      $('#answerB').removeClass('btn');
      $('#answerC').removeClass('btn');
      $('#answerD').removeClass('btn');
      $('#answerA').removeClass('answer');
      $('#answerB').removeClass('answer');
      $('#answerC').removeClass('answer');
      $('#answerD').removeClass('answer');
      $('div.question').addClass('unactive');
      members = data.members;
      _results = [];
      for (_i = 0, _len = members.length; _i < _len; _i++) {
        member = members[_i];
        time = parseInt(member.time);
        if (member.answer !== null) {
          $("#member-" + member.uid + " div.user-answer").show();
          $("#member-" + member.uid + " div.user-answer span.answer").text(member.answer);
          if (time < 10) {
            _results.push($("#member-" + member.uid + " div.user-answer span.time").text("time: 00:0" + time));
          } else if (time > 9) {
            _results.push($("#member-" + member.uid + " div.user-answer span.time").text("time: 00:" + time));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Game.prototype.createTimer = function(sec) {
      var counter;
      return counter = setInterval(this.timer(sec), 1000);
    };

    Game.prototype.timer = function(sec) {
      sec = sec - 1;
      if (sec <= 0) {
        clearInterval(counter);
      }
      if (sec > 9) {
        $('#timer').text("00:" + sec);
      }
      if (sec <= 9) {
        return $('#timer').text("00:0" + sec);
      }
    };

    return Game;

  })();

  window.Game = Game;

}).call(this);
