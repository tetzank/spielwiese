#!/usr/bin/ruby

module Jekyll
	module GenRankingFilter
		Entry = Struct.new(:played, :wins, :losses, :for, :against, :points)

		def gen_ranking(input)
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
						ranking[op[0]].points += 3
						ranking[op[0]].wins += 1
						ranking[op[1]].losses += 1
					else
						ranking[op[1]].points += 3
						ranking[op[1]].wins += 1
						ranking[op[0]].losses += 1
					end
					ranking[op[0]].played += 1
					ranking[op[1]].played += 1
					ranking[op[0]].for += score[0].to_i
					ranking[op[0]].against += score[1].to_i
					ranking[op[1]].for += score[1].to_i
					ranking[op[1]].against += score[0].to_i
				end
			end
			ranking = ranking.sort_by{ |key, entry| entry.points }.reverse
			arr = []
			ranking.each { |key, entry|
				arr.push([key, entry.played, entry.wins, entry.losses, entry.for, entry.against, entry.points])
			}
			return arr
		end
	end
end

Liquid::Template.register_filter(Jekyll::GenRankingFilter)
