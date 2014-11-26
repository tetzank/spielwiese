#!/usr/bin/ruby

module Jekyll
	module GenVidLinkFilter
		def gen_vid_link(input)
			if input.is_a? Array
				vid = ""
				if input[0].include? "youtube"
					vid = "'#{input[0][/youtube.com\/watch\?v=([\w\-]+)/,1]}'"
					for v in input[1..-1]
						if v.include? "youtube"
							vid += ", '#{v[/youtube.com\/watch\?v=([\w\-]+)/,1]}'"
						end
					end
					return "<a href=\"\#player\" onclick=\"embedYTVideo(event,[#{vid}]);\">Youtube</a>"
				else
					return "error: only youtube arrays supported for now"
				end
			else
				if input.include? "twitch"
					vid = 'c' + input[/twitch.tv\/\w+\/c\/(\d+)/,1]
					return "<a href=\"#player\" onclick=\"embedTWVideo(event,'#{vid}');\">Twitch</a>"
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
