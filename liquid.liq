#!/usr/bin/liquidsoap
# Log dir
#set("log.file.path","tmp/basic-radio.log")
# Music

def get_request() =
  let (status,headers,data) = http.get("http://localhost:3001/api/audio/next")
  let (_,_,metadata) = http.get("http://localhost:3001/api/audio/metadata")
  print(data)
  request.create("annotate:title=\"#{metadata}\":#{data}",persistent=true)
end

radio = audio_to_stereo(request.dynamic(conservative=false,get_request))

def now_playing(m) =
  title = m["title"]
  print(title)
end

radio = on_metadata(now_playing, radio)

security = single("radio/sounds/default.mp3")

 # Stream it out
output.icecast(%vorbis,
  host = "localhost", port = 8000,
  password = "joulupukki98", mount = "basic-radio",
  icy_metadata="true",
  mksafe(radio))