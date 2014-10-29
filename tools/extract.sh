#!/bin/sh
# extract matches from http://tournamentscheduler.net/schedule/MTQyMzA5NDU3MQ

#tidy -q -n -utf8 -asxhtml --show-warnings no $f

xml sel -T\
	-N x='http://www.w3.org/1999/xhtml'\
	-t -m '//x:table[@class="schedule"]/x:tbody/x:tr[@data-matchid]'\
		-o '- round: '\
			-v './x:td[@class="round-number"]' -n\
		-o '  match: '\
			-v 'translate(normalize-space(./x:td[@data-column="player1"]), " ", "")'\
			-o ' - '\
			-v 'translate(normalize-space(./x:td[@data-column="player2"]), " ", "")' -n\
		-o '  score: '\
			-i 'string-length(./x:td[@data-column="score1"]) > 0'\
				-v './x:td[@data-column="score1"]'\
				-o ' - '\
				-v './x:td[@data-column="score2"]'\
			-b -n\
		-o '  video: ' -n -n\
	<tidied.xhtml

