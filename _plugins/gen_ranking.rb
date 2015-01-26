#!/usr/bin/ruby

module Jekyll
	module GenRankingFilter
		Entry = Struct.new(:played, :wins, :losses, :for, :against, :points)

		def gen_ranking(input, matchPoints=3, mapPoints=0, ignoreDiff=false)
			ranking = Hash.new
			ranking.default = nil
			for m in input
				if m['score']
					op = m['match'].split(' - ')
					score = m['score'].split(' - ')
					if ranking[op[0]] == nil
						ranking[op[0]] = Entry.new(0, 0, 0, 0, 0, 0)
					end
					if ranking[op[1]] == nil
						ranking[op[1]] = Entry.new(0, 0, 0, 0, 0, 0)
					end
					if score[0] > score[1]
						ranking[op[0]].points += matchPoints
						ranking[op[0]].wins += 1
						ranking[op[1]].losses += 1
					else
						ranking[op[1]].points += matchPoints
						ranking[op[1]].wins += 1
						ranking[op[0]].losses += 1
					end
					ranking[op[0]].played += 1
					ranking[op[1]].played += 1
					ranking[op[0]].for += score[0].to_i
					ranking[op[0]].points += score[0].to_i * mapPoints
					ranking[op[0]].against += score[1].to_i
					ranking[op[1]].for += score[1].to_i
					ranking[op[1]].points += score[1].to_i * mapPoints
					ranking[op[1]].against += score[0].to_i
				end
			end
			ranking = ranking.sort { |a,b|
				if a[1].points == b[1].points
					#(b[1].for - b[1].against) <=> (a[1].for - a[1].against)
					bdiff = b[1].for - b[1].against
					adiff = a[1].for - a[1].against
					if bdiff == adiff or ignoreDiff
						# direct comparison, who won the game between them
						#FIXME: only when played once, not twice
						# it's just a list - linear search
						arr = [a[0], b[0]].sort
						# select removes games without score
						for m in input.select{ |i| !i['score'].nil? }
							marr = m['match'].split(' - ').sort
							if marr[0] == arr[0] and marr[1] == arr[1]
								# found game
								score = m['score'].split(' - ')
								if score[0] > score[1]
									winner = m['match'].split(' - ')[0]
								else
									winner = m['match'].split(' - ')[1]
								end
								if a[0] == winner
									res = -1
								else
									res = 1
								end
								break
							end
						end
						if res.nil?
							#not found - can't decide
							0
						else
							res
						end
					else
						bdiff <=> adiff
					end
				else
					b[1].points <=> a[1].points
				end
			}
			arr = []
			ranking.each { |key, entry|
				arr.push([key, entry.played, entry.wins, entry.losses, entry.for, entry.against, entry.points])
			}
			return arr
		end
	end
end

Liquid::Template.register_filter(Jekyll::GenRankingFilter)
