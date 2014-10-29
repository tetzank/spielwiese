#!/usr/bin/ruby

players = STDIN.readlines.each { |l|
	l.chomp!
}

fp = players.pop
for idx in 0..players.length-1 do
	print "- round: #{idx+1}\n"
	print "  match: #{fp} - #{players[idx]}\n  score: \n  video: \n\n"
	for i in 1..(players.length-1)/2 do
		print "- round: #{idx+1}\n"
		print "  match: #{players[(idx+i)%players.length]} - #{players[idx-i]}\n"
		print "  score: \n  video: \n\n"
	end
end
