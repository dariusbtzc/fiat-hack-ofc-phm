"""Bundle index.html + css + js into dist/catechist-app.html (single file, for hosts that need one file)."""
import re,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
h=open("index.html",encoding="utf-8").read()
h=re.sub(r'<link rel="stylesheet" href="(css/[^"]*)"\s*/?>',lambda m:"<style>\n"+open(m.group(1),encoding="utf-8").read()+"</style>",h)
h=re.sub(r'<script src="(.*?)"></script>',lambda m:"<script>\n"+open(m.group(1),encoding="utf-8").read()+"</script>",h)
os.makedirs("dist",exist_ok=True);open("dist/catechist-app.html","w",encoding="utf-8").write(h);print("built dist/catechist-app.html")
