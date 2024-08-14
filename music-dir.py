import os

FOOTER = """
    <div id="footer">
        <p>This website has been built, designed, and maintained by Nathan Smith</p>
    </div>
    <audio id="playing" controls="" src=""></audio>
</body>
</html>
         """

MUSIC = """
    <div class="content">
        <a href="/Music/{0}/{1}/"><img class="image" src="{0}/{1}/cover.jpg"/></a>
        <p>{0} - {1}</p>
    </div>
        """

HEADER_BASE = """
<!DOCTYPE html>
<head>
	<title>Music</title>
	<link rel="stylesheet" type="text/css" href="/style.css"/>
</head>
<body>
    <div id="bg"></div>
	<div id="directory">
		<b>Music</b>
	</div>
    <div id="gradient"></div>
	<div id="links">
		<a href="/" class="table">Home</a>
		<b><a href="/Music" class="table">Music</a></b>
        <a href="/Shows" class="table">Shows</a>
	</div>
    <script src=/js/album.js></script>
	<br>
	<div id="music">
            """

HEADER_ALBUM = """
<!DOCTYPE html>
<head>
	<title>Music</title>
	<link rel="stylesheet" type="text/css" href="/style.css"/>
</head>
<body>
    <div id="bg"></div>
    <div id="albumbg" style="background: rgba(0,0,0,0) url('cover.jpg') repeat scroll 0% 0% / cover;"></div>
	<div id="artist">{0}</div>
    <div id="album"><b>{1}</b></div>
    <div id="gradient"></div>
	<div id="links">
		<a href="/" class="table">Home</a>
		<b><a href="/Music" class="table">Music</a></b>
        <a href="/Shows" class="table">Shows</a>
	</div>
    <script src=/js/album.js></script>
	<br>
	<div id="music">
        <div class="zoom" onmouseleave="reset(this.children[0])">
            <div class="content" onmousemove="turnToMouse(this, event)" onmouseenter="mouseEnter()" onmouseleave="mouseLeave(this)">
                <img class="image" src="cover.jpg"/>
            </div>
        </div>
        <div class="album">
            """


def generate_album_art(artist, album, chosen_file, html): 
    # Write to main index file for the music folder we're currently in
    html.write(MUSIC.format(artist,album))

    # Generate cover photo inside music folder
    if 'cover.jpg' not in os.listdir(artist+'/'+album):
        os.system("ffmpeg -y -loglevel quiet -i \""+artist+"/"+album+"/"+chosen_file+"\" \""+artist+"/"+album+"/cover.jpg\"")
        if 'cover.jpg' not in os.listdir(artist+'/'+album): # It failed to create it
            print("Failed to generate album art for {} - {}".format(artist,album))
            

def generate_files():
    html = open("index.html","w")
    all_files = os.listdir()
    artists = [x for x in all_files if os.path.isdir(x)]
    loose_files = [y for y in all_files if os.path.isfile(y)]
    html.write(HEADER_BASE)
    #give_orphans_homes(loose_files)
    artists.sort()
    for artist in artists:
        if [x for x in os.listdir(artist) if (".mp3" in x or ".flac" in x or ".m4a" in x)]:
            print("{} folder incorrectly formatted, music files found without being contained".format(artist))
        for album in [x for x in os.listdir(artist) if os.path.isdir(artist+'/'+x)]:
            music = [x for x in os.listdir(artist+'/'+album) if (".mp3" in x or ".flac" in x or ".m4a" in x)]
            if music: # If it has no songs within the album directory, don't bother creating a webpage or link to it.
                album_index = open(artist+'/'+album+"/index.html","w")
                # Adding the basis for each new album page
                album_index.write(HEADER_ALBUM.format(artist,album))
    
                for f in music:
                    # Hacky way to split song name in two at extension.
                    temp = ".".join(f.split(".")[:-1]) # Preserve any additional '.'
                    new_song = "- ".join(temp.split("- ")[1:]) # Only separate at first '- '
                    if not new_song: # If the song had no dashes
                        new_song = temp
                    album_index.write('\n<button onclick="play_song(this)" id="{}">{}</button>'.format(f,new_song))

                album_index.write("</div></div>")
                album_index.write(FOOTER)
                album_index.close()

                generate_album_art(artist, album, music[0], html)
            else:
                print("FAILED TO CREATE WEBPAGE FOR {} - {}".format(artist,album))

    html.write("</div>")
    html.write(FOOTER)
    html.close()

# Needs a rewrite to accommodate the new file structure
def give_orphans_homes(files):
    for orphan in [x for x in files if (".flac" in x or ".mp3" in x or ".m4a" in x)]:
        print("Giving orphan file {} a home.".format(orphan))
        temp = ".".join(orphan.split(".")[:-1])
        os.mkdir(temp)
        files.append(temp)
        os.replace(orphan, temp+"/"+orphan)

if ( __name__ == "__main__" ):
    generateFiles()
