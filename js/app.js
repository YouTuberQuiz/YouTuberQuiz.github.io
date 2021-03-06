   gameMusic = new Audio('https://youtuberquiz.github.io/src/gameMusic.mp3');
   rightAnswer = new Audio('https://youtuberquiz.github.io/src/RightSound.mp3');
   wrongAnser = new Audio('https://youtuberquiz.github.io/src/wrongSound.mp3');
 
   gameMusic.play();
var points,
	pointsPerQuestion,
	currentQuestion,
	questionTimer,
	timeForQuestion = 60, // seconds
	timeLeftForQuestion,
	questions = 30;  // 1

$(function() {

	$('button.start').click(function(){
		var quest = $(this).attr("data-quest");
		setCookie("quest", quest, 365);
		start(quest);
	});
	$('.play_again button').click(restart);

	function restart() {
		points = 0;
		pointsPerQuestion = 10;
		currentQuestion = 0;
		timeLeftForQuestion = timeForQuestion;

		$('.finish.card').hide();
		$('div.start').show();
		$('.times_up').hide();
		$('.questions').html('');

		updateTime();
		updatePoints();
	}

	function start(quest) {
		gameMusic.pause();		
		$('.countdown').css('display', 'block');
		$('.points').css('display', 'block');
		$('div.start').fadeOut(200, function() {
			moveToNextQuestion(quest);
		});
	}

	// 2
	function moveToNextQuestion(quest) {
		currentQuestion += 1;
		myVar = setTimeout(function(){ 
		wrongAnser.pause();
		rightAnswer.pause();
		rightAnswer.currentTime = 0;
		wrongAnser.currentTime = 0;
		getQuestion(quest);
		clearTimeout(myVar);
		 }, 700);

	}

	// 3
	function getQuestion(quest) {
		$.ajax({
			url 	: 'https://offely-cf.umbler.net/backend.php?id=' + quest,
			data	: {					// 4
				action 	: 'get_question',
				number 	: currentQuestion
			},
			success	: function(data) {  // 5
				showQuestionCard(data);
				setupQuestionTimer();
			},
			error	: function(jqXHR, textStatus, errorThrown) {
				alert(textStatus);
			}
		})
	}

	// 6
	function showQuestionCard(html) {
		$('.questions').html(html);
		$('.question.card input').change(optionSelected);
	}

	function setupQuestionTimer() {
		if (currentQuestion > 1) {
			clearTimeout(questionTimer);
		}
		timeLeftForQuestion = timeForQuestion;
		questionTimer = setTimeout(countdownTick, 1000);
	}

	function countdownTick() {
		timeLeftForQuestion -= 1;
		updateTime();
		if (timeLeftForQuestion == 0) { 
			return finish();
		}
		questionTimer = setTimeout(countdownTick, 1000);
	}

	function updateTime() {
		$('.countdown .time_left').html(timeLeftForQuestion + 's');
	}

	function updatePoints() {
		$('.points span.points').html(points + ' Pontos');
	}

	// 7
	function optionSelected() {
		var selected = parseInt(this.value);
		checkAnswer(selected);
	}

	// 8
	function checkAnswer(selected) {
		var quest = getCookie("quest");
		$.ajax({
			url 	: 'https://offely-cf.umbler.net/backend.php?id=' + quest,
			data	: {
				action 	: 'check_answer',
				number 	: currentQuestion,
				answer 	: selected
			},
			success	: function(data) {
				// 9
				if (data) {
					points += pointsPerQuestion;
					updatePoints();
					correctAnimation();
				} else {
					wrongAnimation();
				}
				if (currentQuestion == questions) {
					clearTimeout(questionTimer);
					return finish();
				}
				moveToNextQuestion(quest);
			},
			error	: function(jqXHR, textStatus, errorThrown) {
				alert(textStatus);
			}
		})
	}

	function correctAnimation() {
		animatePoints('right');
		rightAnswer.play();
	}

	function wrongAnimation() {
		animatePoints('wrong');
		wrongAnser.play();
	}

	function animatePoints(cls) {
		$('header .points').addClass('animate ' + cls);
		setTimeout(function() {
			$('header .points').removeClass('animate ' + cls);
		}, 500);
	}

	function finish() {
		if (timeLeftForQuestion == 0) {
			$('.times_up').show();
		}
		var quest = getCookie("quest");
		if(quest==01)
		{
			var user = "cdnleon";
			var urlx = "CoisaDeNerd";
		}
		$('p.final_points').html(points + ' pontos');
		$('.twitter').attr("href", "https://twitter.com/intent/tweet?url=http://youtuberquiz.com/#" + urlx + "&text=Eu%20Fiz%20" + points + "%20pontos%20no%20@YoutuberQuizCom%20do%20@" + user + ",%20e%20voc%C3%AA%20quanto%20vai%C3%A1%20fazer%20?");
		$('.question.card:visible').hide();
		$('.finish.card').show();
		$('.countdown').css('display', 'none');
		$('.points').css('display', 'none');
		delCookie("quest");

	}

	restart();

});
