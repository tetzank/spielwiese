#!/usr/bin/ruby

module Jekyll
	module GenVidLinkFilter
		def gen_vid_link(input)
			ytregex = /youtube.com\/watch\?v=([\w-]+)/
			twregex = /twitch.tv\/\w+\/(c|b)\/(\d+)/

			if input.is_a? Array
				if input[0].include? "youtube"
					vids = input.collect {|i| "'#{i[ytregex,1]}'" }.join(",")
					return "<a href=\"\#player\" onclick=\"embedYTVideo(event,[#{vids}]);\">Youtube</a>"
				elsif input[0].include? "twitch"
					vids = input.collect {|i|
						m = twregex.match(i)
						m[1]=="b"? "'a#{m[2]}'": "'c#{m[2]}'"
					}.join(",")
					return "<a href=\"#player\" onclick=\"embedTWVideo(event,[#{vids}]);\">Twitch</a>"
				else
					raise "only youtube and twitch arrays supported for now"
				end
			else
				if input.include? "youtube"
					vid = "'#{input[ytregex,1]}'"
					return "<a href=\"\#player\" onclick=\"embedYTVideo(event,[#{vid}]);\">Youtube</a>"
				elsif input.include? "twitch"
					m = twregex.match(input)
					if m.nil?
						# something completely else
						raise "unsupported twitch link: "+ input
					else
						# b - broadcast has prefix a on video id
						# c - highlight has prefix c
						if m[1]=="b"
							return "<a href=\"#player\"	onclick=\"embedTWVideo(event,['a#{m[2]}']);\">Twitch/b/</a>"
						else
							return "<a href=\"#player\" onclick=\"embedTWVideo(event,['c#{m[2]}']);\">Twitch</a>"
						end
					end
				elsif input.include? "lpip"
					return "see LPIP"
				elsif input.include? "dead"
					return "dead"
				end
			end
		end
	end
end

Liquid::Template.register_filter(Jekyll::GenVidLinkFilter)
