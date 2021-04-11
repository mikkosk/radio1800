def get_request() =
  let (status,headers,data) = http.get("http://localhost:3001/api/audio/next", headers=[("Authorization", "AUTH")])
  let (_,_,metadata) = http.get("http://localhost:3001/api/audio/metadata")
  let md_json = of_json(default=[("key", "value")], metadata)
  let voice_id_number = md_json["voice_id"]
  let voice_id = "#{voice_id_number}"
  let voice_length = md_json["voice_length"]
  let from_text = md_json["from_text"]
  let to_text = md_json["to_text"]
  year = md_json["year"]

  let final = "{'voice_id': '#{voice_id}', 'voice_length': '#{voice_length}', 'from_text': '#{from_text}', 'to_text': '#{to_text}', 'year': '#{year}'}"
  
  #request.create(data, persistent=true)
  request.create("annotate:title=\"#{final}\":#{data}",persistent=true)
end

radio = audio_to_stereo(request.dynamic(conservative=false,get_request))

def now_playing(m) =
  title = m["title"]
  http.post("http://localhost:3001/api/audio/next", headers=[("Content-Type","application/json")], data='{"unparsed": "#{title}"}')
  print(title)
end

radio = on_metadata(now_playing, radio)

security = single("radio/sounds/default.mp3")

 # Stream it out
output.icecast(%vorbis,
  host = "localhost", port = 8000,
  password = "PASS", mount = "basic-radio",
  icy_metadata="true",
  mksafe(radio))