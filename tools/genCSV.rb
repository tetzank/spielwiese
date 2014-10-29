#!/usr/bin/ruby

lengths = []
#players = File.readlines('players.txt').each { |l|
players = STDIN.readlines.each { |l|
	l.chomp!
	lengths << l.length
}

#lengths.max.times { print " " }
#printf("%#{lengths.max}s", "Player")
print "Player"
players.each { |p| print "," + p }
puts ""

str = ""
lengths.each { |l|
	str << ","
	#l.times { str << " " }
}

#players.each { |p| printf("%#{lengths.max}s%s\n", p, str) }
players.each { |p| printf("%#s%s\n", p, str) }

