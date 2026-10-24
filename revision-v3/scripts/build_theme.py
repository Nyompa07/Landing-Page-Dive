"""Assemble one self-contained Blogger XML theme from the review sources."""
from pathlib import Path
import base64,re,json,xml.etree.ElementTree as ET
from PIL import Image
from io import BytesIO
root=Path(__file__).resolve().parents[1]
html=(root/'index.html').read_text()
# HTML5 remains source; XML serializer handles void elements and literal ampersands.
body=html.split('<body>',1)[1].split('</body>',1)[0]
body=re.sub(r'&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)', '&amp;', body)
for slug in ('adventures', 'dive-snorkel', 'training', 'conservation', 'consultancy', 'contact'):
 body=body.replace(f'href="{slug}.html"', f'expr:href=\'data:blog.homepageUrl + "p/{slug}.html"\'')
def encode_asset(path):
 if path.suffix=='.svg': return 'data:image/svg+xml;base64,'+base64.b64encode(path.read_bytes()).decode()
 if path.suffix=='.png': return 'data:image/png;base64,'+base64.b64encode(path.read_bytes()).decode()
 image=Image.open(path);image.thumbnail((700,500));buffer=BytesIO();image.save(buffer,format='WEBP',quality=65)
 return 'data:image/webp;base64,'+base64.b64encode(buffer.getvalue()).decode()
# Assets embedded so Blogger import does not depend on a separate asset host.
for path in sorted(p for p in (root/'assets').glob('*') if p.suffix in ('.svg','.png','.webp')):
 mime='image/svg+xml' if path.suffix=='.svg' else 'image/webp'
 body=body.replace('assets/'+path.name, encode_asset(path))
css=(root/'styles.css').read_text()
js=(root/'packages.js').read_text()+'\n'+(root/'app.js').read_text()
image_map={}
for path in sorted(p for p in (root/'assets').glob('*') if p.suffix in ('.svg','.png','.webp')):
 needle=json.dumps('assets/'+path.name)
 if needle in js:
  image_map[path.name]=encode_asset(path)
  js=js.replace(needle, 'window.GOWA_IMAGE_MAP['+json.dumps(path.name)+']')
js='window.GOWA_IMAGE_MAP='+json.dumps(image_map)+';\n'+js
# The landing page is displayed only on the homepage; native Blog widget retains articles/pages.
xml='''<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:b="http://www.google.com/2005/gml/b" xmlns:data="http://www.google.com/2005/gml/data" xmlns:expr="http://www.google.com/2005/gml/expr" b:version="2" b:layoutsVersion="3" b:defaultwidgetversion="2" lang="id">
<head>
<meta content="width=device-width, initial-scale=1" name="viewport" />
<b:include data="blog" name="all-head-content" />
<title><data:blog.pageTitle /></title>
<meta content="Gowa Dive Center: pengalaman selam, snorkeling, pembelajaran dan konservasi laut. Rencanakan perjalanan Anda dari Makassar." name="description" />
<meta content="Gowa Dive Center" property="og:title" />
<meta content="website" property="og:type" />
<meta content="Jelajahi laut, pelajari dan jaga bersama Gowa Dive Center." property="og:description" />
<meta expr:content="data:blog.canonicalUrl" property="og:url" />
<b:skin><![CDATA[__GOWA_CSS__]]></b:skin>
</head><body>
<b:if cond="data:blog.url == data:blog.homepageUrl">
__GOWA_BODY__
<script type="text/javascript"><![CDATA[__GOWA_JS__]]></script>
</b:if>
<b:if cond="data:blog.url != data:blog.homepageUrl">
<header class="header"><a class="button aqua" expr:href="data:blog.homepageUrl">Gowa Dive Center — Beranda</a><nav aria-label="Navigasi utama"><a expr:href='data:blog.homepageUrl + "p/adventures.html"'>Adventures</a><a expr:href='data:blog.homepageUrl + "p/dive-snorkel.html"'>Dive &amp; Snorkel</a><a expr:href='data:blog.homepageUrl + "p/training.html"'>Training</a><a expr:href='data:blog.homepageUrl + "p/conservation.html"'>Conservation</a><a expr:href='data:blog.homepageUrl + "p/consultancy.html"'>Marine Consultancy</a><a expr:href='data:blog.homepageUrl + "p/contact.html"'>Contact</a></nav></header>
</b:if>
<b:section class="legacy-blog" id="legacyBlog" maxwidgets="1" showaddelement="no">
<b:widget id="Blog1" locked="true" title="Artikel dan Halaman" type="Blog" version="2" visible="true" />
</b:section>
<b:if cond="data:blog.url == data:blog.homepageUrl"><style>.legacy-blog{display:none}</style></b:if>
</body></html>'''
xml=xml.replace('__GOWA_CSS__',css).replace('__GOWA_BODY__',body).replace('__GOWA_JS__',js)
ET.fromstring(xml)
(root/'blogger-theme.xml').write_text(xml)
print('Valid XML written:',len(xml.encode()),'bytes')
