#!/usr/bin/env liquidsoap

def get_request () =
  let (_,_,data) = http.get("http://web:3001/api/audio/next", headers=[("Authorization", "AUTH")])
  let (_,_,metadata) = http.get("http://web:3001/api/audio/metadata")
  md_json = of_json(default=[("key", "value")], metadata)
  voice_id_number = md_json["voice_id"]
  voice_id = "#{voice_id_number}"
  voice_length = md_json["voice_length"]
  from_text = md_json["from_text"]
  to_text = md_json["to_text"]
  year = md_json["year"]

  final = "{'voice_id': '#{voice_id}', 'voice_length': '#{voice_length}', 'from_text': '#{from_text}', 'to_text': '#{to_text}', 'year': '#{year}'}"
  
  #request.create(data, persistent=true)
  
  request.create("annotate:title=\"#{final}\":#{data}",persistent=true)
end

radio = audio_to_stereo(request.dynamic(conservative=false,get_request))

def now_playing(m) =
  title = m["title"]
  ignore(http.post("http://web:3001/api/audio/next", headers=[("Content-Type","application/json")], data='{"unparsed": "#{title}"}'))
  print(title)
end

radio = on_metadata(now_playing, radio)

 # Stream it out
output.icecast(%vorbis,
  host = "HOST", port = 8000,
  password = "PASS", mount = "MOUNT",
  icy_metadata="true",
  mksafe(radio))